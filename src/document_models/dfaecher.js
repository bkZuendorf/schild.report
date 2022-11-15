export class DFaecher {
    constructor() {
        this.faecher = []
    }
    byZeugnis(name) {
        return this.orte.find(o=> o.Zeugnisbez==name)
    }
    byKurzbezeichnung(name) {
        return this.orte.find(o=> o.FachKrz==name)
    }
    zeugnisByKurzbezeichnung(name) {
        return this.orte.find(o=> o.FachKrz==name)?.Zeugnisbez || ""
    }
    byBezeichnung(name) {
        return this.orte.find(o=> o.Bezeichnung==name)
    }
}