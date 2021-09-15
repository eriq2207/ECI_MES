import { Router } from "express";
import * as readline from "readline";
import { MachineDataBase } from "src/controllers/machineDB";
import * as Machine from "../models/MachineData"
//import * as MachineDB from "../controllers/sqlcomm"

let router = Router()
let  MachineData: Machine.MachineData;

function StartRouting(MachineDataParam: Machine.MachineData): Router {
    MachineData = MachineDataParam
    return router
}

router.get('/', function (req, res) {
    if (MachineData.User === "")
        return res.redirect('/login');

    return res.render('main', MachineData.toJSON())
});

router.get('/MachineData', function (req, res) {
    MachineData.ActivePage = Machine.Page.Main
    return res.end(JSON.stringify(MachineData.toJSON()))
});

router.post('/ChangeMachineState', async function (req, res, next) {
    let ReceivedMachineState: any = req.body.MachineState
    if (!Object.values(Machine.MachineState).includes(ReceivedMachineState))
        return res.end(JSON.stringify(MachineData.toJSON()))

    //Save machine change state to DB
    if (MachineData.MachineState == ReceivedMachineState)
        return res.end(JSON.stringify(MachineData.toJSON()))

    try {
        //await MachineData.updateMachineStateToTime(new Date())
        MachineData.MachineStateFromTime = new Date()
        MachineData.MachineState = ReceivedMachineState
        //clearInterval();
        //MachineStateIncTimer = setInterval(MachineStateIncTimer, UpdateInterval, UpdateInterval);
        return res.end(JSON.stringify(MachineData.toJSON()))
    } catch (ex) {
        return next(ex)
    }
});

export { StartRouting }
