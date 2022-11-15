// Wrapper für die Erziehungsberichtigten

let t = text => text ? (text+" ") : ""

class ErziehungsPerson {
    constructor(owner, index) {
        this.owner=owner
        this.index=index
    }
    get geehrte_r () {
        return this.owner["Anrede"+this.index] === "Herr" ? 'geehrter Herr' : 'geehrte Frau'
    }
    get Geehrte_r () {
        return this.owner["Anrede"+this.index] === "Herr" ? 'Geehrter Herr' : 'Geehrte Frau'
    }
    get Geschlecht () {
        return this.owner["Anrede"+this.index] === "Herr" ? 'm' : 'w'
    }
    get VollstaendigerName () {
        return  t(this.owner["Titel"+this.index]) +
                t(this.owner["Vorname"+this.index]) +
                t(this.owner["Erz"+this.index+"ZusatzNachname"]) +
                t(this.owner["Name"+this.index])
      }
    get VollstaendigeAnrede () {
        return  t(this.owner["Anrede"+this.index]) +
                this.VollstaendigerName
    }
    get VollstaendigeBriefAnrede () {
        return (this.owner["Anrede"+this.index] === "Herr" ? 'Sehr geehrter Herr ' : 'Sehr geehrte Frau ')+ 
                this.VollstaendigerName
    }
    get Anrede () {
        return this.owner["Anrede"+this.index] || ""
    }
    
    get Email() { return (this.index==1 ? this.owner.ErzEMail : this.owner.ErzEMail2) || ""}
    get StaatsAngehoerigkeit() { return this.owner["Erz"+this.index+"StaatKrz"] || ""}
    get Titel() { return this.owner["Titel"+this.index] || ""}
    get Vorname() { return this.owner["Vorname"+this.index] || ""}
    get Name() { return this.owner["Name"+this.index] || ""}
    get Zusatz() { return this.owner["Erz"+this.index+"ZusatzNachname"] || "" }
}

export class DErziehungsberechtigung {
      
    constructor() {
        this.erstPerson = new ErziehungsPerson(this, 1)
        this.zweitPerson = new ErziehungsPerson(this, 2)    
    }

    get Bemerkung() { return this.ErzBemerkung || "" }
    get anschreibenErlaubt() { return this.ErzBemerkung==="+" }
    get Strasse() { return this.ErzStrasse || ""}
    get Ort() { return this.ort.Bezeichnung || ""}
    get PLZ() { return this.ort.PLZ || ""}
}
