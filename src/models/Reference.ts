export class Reference {
    private _Name: String = ""
    private _TargetTime: number = 150
    private _ActualTime: number = 50

    get Name(): String {
        return this._Name
    }
    set Name(value: String) {
        this._Name = value
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

