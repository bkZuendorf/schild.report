export class DOrte {
    constructor() {
        this.orte = []
    }
    nameByPLZ(PLZ) {
        return this.orte.find(o=> o.PLZ==PLZ)?.Bezeichnung || ""
    }
    byPLZ(PLZ) {
        return this.orte.find(o=> o.PLZ==PLZ) 
    }
    byName(name) {
        return this.orte.find(o=> o.Bezeichnung==name)
    }
}