import { expose } from "comlink";
import Knex from 'knex'
import { Model } from 'objection'
import { Schueler, Versetzung, Schule, Schuelerfoto, Fach, Nutzer, Adressen, Ort, Fachklasse} from './models.js'

class Schild {
  constructor() {
    this.options = null;
    this.knex = null;
  }

  async connect(knexConfig) {
    try {
      this.knex = await Knex(knexConfig);
      Model.knex(this.knex);
    } catch (e) {
      throw e;
    }
  }

  disconnect() {
    if (this.knex) this.knex.destroy();
  }

  async testConnection() {
    try {
      await this.knex.raw('select 1+1 as result')
      console.log('Testverbindung konnte aufgebaut werden');
      return true;
    } catch (err) {
      console.log(err);
      console.log('Testverbindung konnte nicht aufgebaut werden');
      throw err
    }
  }

  async suche(pattern) {
    const pattern_w = pattern+'%'
    try {
      const sres = await Schueler
      .query()
      .whereRaw(`
        Geloescht='-'
          AND Gesperrt='-'
          AND (CONCAT(LOWER(Vorname),' ',LOWER(Name)) LIKE ?
            OR CONCAT(LOWER(Name),', ',LOWER(Vorname)) LIKE ?)
          `
        , [pattern_w, pattern_w])
      .select('Name', 'Vorname', 'Klasse', 'Status', 'AktSchuljahr', 'ID')
      .orderBy('AktSchuljahr', 'desc')
      const schueler = sres.map(s => {
        return {
          value: `${s.Name}, ${s.Vorname} (${s.Klasse})`,
          status: s.Status,
          jahr: s.AktSchuljahr,
          id: s.ID
        };
      })
      const kres = await Versetzung.query().whereRaw(`LOWER(Klasse) LIKE ?`, [`${pattern}%`]).select('Klasse').orderBy('Klasse', 'desc')
      const klassen = kres.map(k => {
          return {
            value: k.Klasse,
            id: k.Klasse
          };
        })
      return schueler.concat(klassen)
    } catch (e) {
      throw e;
    }
  }

  async getSchueler(id) {
    try {
      const res = await Schueler.query()
        .where(function () {
          this.where('Geloescht', '-')
          .andWhere('Gesperrt', '-')
          .andWhere('ID', id)})
          .withGraphFetched(`
              [
                abschnitte.[noten.fach, lehrer],
                fachklasse.[fach_gliederungen], versetzung, bk_abschluss,
                bk_abschluss_faecher.fach, fhr_abschluss, fhr_abschluss_faecher.fach,
                abi_abschluss, abi_abschluss_faecher.fach, vermerke, sprachenfolgen.fach, 
                zubringerschule, erziehungsberechtigung.[ort], 
                kontakte.[adresse, vertragsArt, ansprechPartner, betreuungsLehrer], 
                telefonkontakte.[art]
              ]
          `)
          .modifyGraph('abschnitte', builder => {
            builder.orderBy('ID');
          }).first();
      return res.toJSON()
    } catch (e) {
      throw e;
    }
  }

  async getKlasse(klasse) {
    try {
      const res = await Versetzung.query()
        .where('Klasse', klasse)
        .withGraphFetched(`
          [schueler.[abschnitte.[noten.fach, lehrer],
          fachklasse.[fach_gliederungen], versetzung, bk_abschluss,
          bk_abschluss_faecher.fach, fhr_abschluss, fhr_abschluss_faecher.fach,
          abi_abschluss, abi_abschluss_faecher.fach, vermerke, sprachenfolgen.fach, 
          zubringerschule, erziehungsberechtigung.[ort]], fachklasse,
          jahrgang]
        `)
        .modifyGraph('schueler', builder => {
          builder.where(function () {
            this.where('Geloescht', '-')
            .andWhere('Gesperrt', '-')})
            .orderBy('Name');
          })
        .first();
      return res.toJSON()
    } catch (e) {
      throw e;
    }
  }

  async getStaticData() {
    return { 
      schule: await this.getSchule(),
      orte: await this.getOrte(),
      faecher: await this.getFaecher(),
      fachklassen: await this.getFachklassen()
    }
  }

  async getSchule() {
    try {
      const res = await Schule.query().first()
      delete res.SchulLogo;
      delete res.Einstellungen;
      delete res.Einstellungen2;

      return res.toJSON()
    } catch (e) {
      throw e;
    }
  }

  async getOrte() {
    try {
      let res = await Ort.query()
                .whereRaw(`Sichtbar='+'`)
                .select('ID', 'PLZ', 'Bezeichnung as Name', 'Kreis')
                .orderBy('Bezeichnung', 'asc')
        return res
    } catch (e) {
      throw e;
    }
  }

  async getFaecher() {
    try {
      let res=await Fach.query()
            .select('FachKrz as Name', 'Bezeichnung', 'Zeugnisbez as Zeugnisbezeichnung', 'StatistikKrz as StatistikName')
            .where('Sichtbar','+')
            .orderBy('FachKrz')
        return res
    } catch (e) {
      throw e;
    }
  }

  async getFachklassen() {
    try {
      let res = await Fachklasse.query()
            .select('BKIndex', 'FKS as Fachklasse', 'AP as Auspraegung', 'Bezeichnung as Bildungsgang', 'BKIndexTyp as Gliederung', 'Ebene1Klartext as Fachrichtung', 'Ebene2Klartext as Schwerpunkt', 'Ebene3Klartext as Zeugniskopf')
            .where('Sichtbar','+')
            .orderBy([{column:'BKIndex'},{column:'FKS'}])
      
        return res
    } catch (e) {
      throw e;
    }
  }

  async getAdressen() {
    try {
      const res = await Adressen.query()
        .withGraphFetched(`
          [ort,art,ansprechPartner]
        `) 
        .whereRaw(`Sichtbar='+'`)
      return res
    } catch (e) {
      throw e;
    }
  }

  async getSchuelerfoto(id) {
    try {
      const data = await Schuelerfoto.query().where('Schueler_ID', id).first();
      return Buffer.from(data.Foto, 'binary').toString('base64');
    } catch (e) {
      throw e;
    }
  }

  async getNutzer(username) {
    try {
      const res = await Nutzer.query().where('US_LoginName', username).first();
      return res.toJSON()
    } catch (e) {
      throw e;
    }
  }

}
expose(new Schild())