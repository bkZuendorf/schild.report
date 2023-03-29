export class DOrte {
    constructor(l) {
        this.list = l
    }    
    nameByPLZ(PLZ) {
        return this.list.find(o=> o.PLZ==PLZ)?.Bezeichnung || ""
    }
    byPLZ(PLZ) {
        return this.list.find(o=> o.PLZ==PLZ) 
    }
    byName(name) {
        return this.list.find(o=> o.Bezeichnung==name)
    }
    static Assign(list) { return new DOrte(list)  }
}
