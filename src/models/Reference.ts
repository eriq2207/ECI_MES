export class Reference {
    private _Name: String = ""
    private _Description: String = "Opis referencji"
    private _TargetTime: number = 150
    private _ActualTime: number = 50

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

    get TargetTime(): number {
        return this._TargetTime
    }
    set TargetTime(value: number) {
        this._TargetTime = value
    }

    get ActualTime(): number {
        return this._ActualTime
    }
    set ActualTime(value: number) {
        this._ActualTime = value
    }
}

