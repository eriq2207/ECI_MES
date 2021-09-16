import * as Reference from "../models/Reference";
import { MachineDataBase } from "src/controllers/machineDB";

enum MachineStates {
    Work = "Praca",
    Retooling = "Przezbrojenie",
    Failure = "Awaria",
    Standstill = "Postój"
}
enum Page { Login, Reference, Main }

class MachineData {
    constructor() {
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
    public User: any = "";
    public Reference: Reference.Reference = new Reference.Reference()
    public MachineState: MachineStates = MachineStates.Standstill
    public MachineStateFromTime: Date = new Date
    public MachineStateToTime: Date = new Date
    public ActivePage: Page = Page.Login
    toJSON(): object {
        return {
            "User": this.User,
            "LastScannedText": this.LastScannedText,
            "ReferenceName": this.Reference.Name,
            "ReferenceDescription": this.Reference.Description,
            "ReferenceFromTime": this.Reference.FromTime.getTime(),
            "ReferenceToTime": this.Reference.ToTime.getTime(),
            "MachineState": this.MachineState,
            "MachineStateFromTime": this.MachineStateFromTime.getTime(),
            "MachineStateToTime": this.MachineStateToTime.getTime(),
            "ActivePage": this.ActivePage
        }

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
    public async ChangeMachineState(MachineStateParam: MachineStates): Promise<any> {
        this.MachineStateToTime = new Date;
        await MachineDataBase.UpdateMachineState(this)
        this.MachineStateFromTime = new Date;
        this.MachineStateToTime = new Date;
        this.MachineState = MachineStateParam
        await MachineDataBase.UpdateMachineState(this)
        this.SetMachineStateTimer()
    }

}

export { MachineStates, Page, MachineData }