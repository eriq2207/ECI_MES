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
        setInterval(this.UpdateMachineData.bind(this), this.UpdateInterval)
    }
    public MachineStateTimer: any;
    public ReferenceTimer: any;
    public UpdateInterval: number = 5000;
    public LastScannedText = {
        text: "",
        page: Page.Login
    }
    public User: any = "";
    public UserSession: number = -1;
    public Reference: Reference.Reference = new Reference.Reference()
    public MachineState: MachineStates = MachineStates.Standstill
    public MachineStateFromTime: Date = new Date
    public MachineStateToTime: Date = new Date
    public ActivePage: Page = Page.Login
    toJSON(): object {
        return {
            "User": this.User,
            "LastScannedText": this.LastScannedText,
            Reference: {
                "Name": this.Reference.Name,
                "Description": this.Reference.Description,
                "Done": this.Reference.Done,
                "FromTime": this.Reference.FromTime.getTime(),
                "ToTime": this.Reference.ToTime.getTime(),
                "TargetTime": this.Reference.TargetTime
            },
            "MachineState": this.MachineState,
            "MachineStateFromTime": this.MachineStateFromTime.getTime(),
            "MachineStateToTime": this.MachineStateToTime.getTime(),
            "ActivePage": this.ActivePage
        }

    }
    private async UpdateMachineData(UpdateTime: number) {
        let ActDate = new Date;
        if (this.User != "")
        {
            this.MachineStateToTime = ActDate;
            const res = await MachineDataBase.UpdateMachineState(this)
        }
        if(this.Reference.Name != "")
        {
            this.Reference.ToTime = ActDate
            const res = await MachineDataBase.UpdateReference(this)
        }
    }
    public async ChangeMachineState(MachineStateParam: MachineStates, ChangeDate: Date): Promise<any> {
        this.MachineStateToTime = ChangeDate;
        await MachineDataBase.UpdateMachineState(this)
        this.MachineStateFromTime = ChangeDate;
        this.MachineStateToTime = ChangeDate;
        this.MachineState = MachineStateParam
        await MachineDataBase.UpdateMachineState(this)
    }

}

export { MachineStates, Page, MachineData }