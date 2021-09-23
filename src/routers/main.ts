import { Router } from "express";
import { machineDb } from "../controllers/machineDb";
import * as machine from "../models/MachineData"

let router = Router()
let machineData: machine.MachineData;

function startRouting(machineDataParam: machine.MachineData): Router {
    machineData = machineDataParam
    return router
}

router.get('/', function (req, res) {
    if (machineData.user === "")
        return res.redirect('/login');

    if (machineData.reference.name === "")
        return res.redirect('/reference')

    return res.render('main', machineData)
});

router.get('/machineData', function (req, res) {
    machineData.activePage = machine.Page.main
    return res.end(JSON.stringify(machineData))
});

router.post('/changeMachineState', async function (req, res, next) {
    let receivedMachineState: any = req.body.machineState
    if (!Object.values(machine.MachineStates).includes(receivedMachineState))
        return res.end(JSON.stringify(machineData))

    //Save machine change state to DB
    if (machineData.machineState == receivedMachineState)
        return res.end(JSON.stringify(machineData))

    const actDate = new Date;
    machineData.changeMachineState(receivedMachineState, actDate)
    //Update reference
    machineData.reference.toTime = actDate;
    machineDb.updateReference(machineData);
    
    return res.end(JSON.stringify(machineData))
});

export { startRouting }
