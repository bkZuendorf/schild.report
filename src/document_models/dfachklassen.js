export class DFachklassen {
    constructor(l) {
        this.list = l
    }
    byFachklasseAuspraegungGliederung(fks, ap, gliederung) { 
        let c = this.list.find((v)=> {
          return v.Fachklasse==fks && v.Auspraegung==ap && v.Gliederung==gliederung
        })
        if(!c) return undefined
        return c.BKIndex+"-"+c.Fachklasse+"-"+c.Auspraegung
      }
    
    byFachklasseAuspraegung(fks, ap) { 
        let c = this.list.find((v)=> {
          return v.Fachklasse==fks && v.Auspraegung==ap
        })
        if(!c) return undefined
        return c.BKIndex+"-"+c.Fachklasse+"-"+c.Auspraegung
      }

      static Assign(list) { return new DFachklassen(list)  }
    }