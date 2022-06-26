export class DSchule {
    constructor() {
    }

    get Schulleiter_in() {
        return this.SchulleiterGeschlecht === 3 ? 'Schulleiter' : 'Schulleiterin'
    }
}