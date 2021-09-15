export class Reference {
    private _Name: String = ""
    private _Description: String = "Opis referencji"
    private _FromTime: Date = new Date
    private _ToTime: Date = new Date

    get Name(): String {
        return this._Name
    }
    set Name(value: String) {
        this._Name = value
    }
    get Description(): String {
        return this._Description
    }
    set Description(value: String) {
        this._Description = value
    }
    get ToTime(): Date {
        return this._ToTime
    }
    set ToTime(value: Date) {
        this._ToTime = value
    }
    get FromTime(): Date {
        return this._FromTime
    }
    set FromTime(value: Date) {
        this._FromTime = value
    }
}

