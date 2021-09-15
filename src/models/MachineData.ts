import * as Reference from "../models/Reference";

enum MachineState {
    Work = "Praca", 
    Retooling = "Przezbrojenie", 
    Failure = "Awaria", 
    Standstill = "Postój"
}
enum Page {Login, Reference, Main}

class MachineData {
    
    private _User: any = "";
    public LastScannedText = {
        text: "",
        page: Page.Login
    }
    private _Reference: Reference.Reference = new Reference.Reference()
    private _MachineState: MachineState = MachineState.Standstill
    private _MachineStateFromTime: Date = new Date
    private _MachineStateToTime: Date = new Date
    private _ActivePage: Page = Page.Login
    toJSON() : object{
        return {
            "User": this._User,
            "LastScannedText": this.LastScannedText,
            "ReferenceName": this._Reference.Name,
            "ReferenceDescription": this._Reference.Description,
            "ReferenceTargetAmount": this._Reference.TargetTime,
            "ReferenceActualAmount": this._Reference.ActualTime,
            "MachineState": this.MachineState,
            "MachineStateFromTime": this._MachineStateFromTime.getTime(),
            "MachineStateToTime": this._MachineStateToTime.getTime(),
            "ActivePage": this._ActivePage
        }
        
    }
    get User(): any {
        return this._User
    }
    set User(value: any) {
        this._User = value
    }
    get Reference(): Reference.Reference {
        return this._Reference
    }
    set Reference(value: Reference.Reference) {
        this._Reference = value
    }
    get MachineState(): MachineState {
        return this._MachineState
    }
    set MachineState(value: MachineState) {
        this._MachineState = value
    }
    get MachineStateFromTime(): Date {
        return this._MachineStateFromTime
    }
    set MachineStateFromTime(value: Date) {
        this._MachineStateFromTime = value
    }

    get MachineStateToTime(): Date {
        return this._MachineStateToTime
    }
    // updateMachineStateToTime(NewMachineStateToTime: Date) : Promise<any> {
    //     this._MachineStateToTime = NewMachineStateToTime
    //     //return MachineDB.UpdateMachineState(this)
    // }
    
    get ActivePage(): Page {
        return this._ActivePage
    }
    set ActivePage(value: Page) {
        this._ActivePage = value
    }
    

}

export {MachineState, Page, MachineData}