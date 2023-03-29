export class DFaecher {
    constructor(l) {
        this.list = l
    }
    byZeugnis(name) {
        return this.list.find(o=> o.Zeugnisbezeichnung==name)
    }
    byName(name) {
        return this.list.find(o=> o.Name==name)
    }
    zeugnisByName(name) {
        return this.list.find(o=> o.Name==name)?.Zeugnisbezeichnung || ""
    }
    byBezeichnung(name) {
        return this.list.find(o=> o.Bezeichnung==name)
    }

    static Assign(list) { return new DFaecher(list)  }
}