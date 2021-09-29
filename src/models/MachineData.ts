import {Reference} from "./Reference";
import { machineDb } from "../controllers/machineDb";

enum MachineStates {
    work = "Praca",
    retooling = "Przezbrojenie",
    failure = "Awaria",
    standstill = "Postój"
}
enum Page { login, reference, main }

class MachineData {
    constructor() {
        setInterval(this.updateMachineData.bind(this), this.updateInterval)
    }
    public machineStateTimer: any;
    public referenceTimer: any;
    public updateInterval: number = 5000;
    public lastScannedText = {
        text: "",
        page: Page.login
    }
    public disableOperatorCheck: Boolean = false;
    public user: any = "";
    public userSession: number = -1;
    public reference: Reference = new Reference()
    public machineState: MachineStates = MachineStates.standstill
    public machineStateFromTime: Date = new Date
    public machineStateToTime: Date = new Date
    public activePage: Page = Page.login
    
    private async updateMachineData(UpdateTime: number) {
        let ActDate = new Date;
        if (this.user != "")
        {
            this.machineStateToTime = ActDate;
            const res = await machineDb.updateMachineState(this)
        }
        if(this.reference.name != "")
        {
            this.reference.toTime = ActDate
            const res = await machineDb.updateReference(this)
        }
    }
    public async changeMachineState(MachineStateParam: MachineStates, ChangeDate: Date): Promise<any> {
        this.machineStateToTime = ChangeDate;
        await machineDb.updateMachineState(this)
        this.machineStateFromTime = ChangeDate;
        this.machineStateToTime = ChangeDate;
        this.machineState = MachineStateParam
        await machineDb.updateMachineState(this)
    }

}

export { MachineStates, Page, MachineData }