export class Reference {
    private _Name: string = "BOBCAT-H"
    private _TargetTime: number = 150
    private _ActualTime: number = 50

    get Name(): string {
        return this._Name
    }
    set Name(value: string) {
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

