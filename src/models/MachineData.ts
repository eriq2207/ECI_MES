import * as Reference from "../models/Reference";
import { MachineDataBase } from "src/controllers/machineDB";

enum MachineState {
    Work = "Praca", 
    Retooling = "Przezbrojenie", 
    Failure = "Awaria", 
    Standstill = "Postój"
}
enum Page {Login, Reference, Main}

class MachineData {
    constructor(){
        this.SetMachineStateTimer()
        this.SetReferenceTimer()
    }
    public MachineStateTimer: any;
    public ReferenceTimer: any;
    public UpdateInterval: number = 10000;
    public LastScannedText = {
        text: "",
        page: Page.Login
    }
    private _User: any = "";
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
            "ReferenceFromTime": this._Reference.FromTime.getTime(),
            "ReferenceToTime": this._Reference.ToTime.getTime(),
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
    set MachineStateToTime(value: Date) {
        this._MachineStateToTime = value
    }
    get ActivePage(): Page {
        return this._ActivePage
    }
    set ActivePage(value: Page) {
        this._ActivePage = value
    }
    private async MachineStateIncTimer(UpdateTime: number) {
        if (this.User == "") 
            return;
        this.MachineStateToTime = new Date(this.MachineStateToTime.getTime() + UpdateTime)
        const res = await MachineDataBase.UpdateMachineState(this)  
    }
    private async ReferenceIncTimer(UpdateTime: number) {
        if (this.Reference.Name == "") 
            return;
        this.Reference.ToTime = new Date(this.Reference.ToTime.getTime() + UpdateTime)
        const res = await MachineDataBase.UpdateReference(this)
    }
    public SetMachineStateTimer() {
        clearInterval(this.MachineStateTimer);
        this.MachineStateTimer = setInterval(this.MachineStateIncTimer.bind(this), this.UpdateInterval, this.UpdateInterval)
    }
    public SetReferenceTimer() {
        clearInterval(this.ReferenceTimer);
        this.ReferenceTimer = setInterval(this.ReferenceIncTimer.bind(this), this.UpdateInterval, this.UpdateInterval)
    }

}

export {MachineState, Page, MachineData}