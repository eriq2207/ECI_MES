import { Router } from "express";
import * as readline from "readline";
import * as Machine from "../models/MachineData"
//import * as MachineDB from "../controllers/sqlcomm"

let router = Router()
let MachineData: Machine.MachineData;
let UpdateInterval: number = 10000;
let StateCounterTimer: any;

function IncrementTime(UpdateTime: number): void {
    if(MachineData.User != "")
    {
        let newMachineStateToTime: Date = new Date(MachineData.MachineStateToTime.getTime() + UpdateTime)
        //MachineData.updateMachineStateToTime(newMachineStateToTime)
    }

}

function StartRouting(MachineDataParam: Machine.MachineData): Router {
    StateCounterTimer = setInterval(IncrementTime, UpdateInterval, UpdateInterval)
    MachineData = MachineDataParam
    return router
}


router.get('/', function (req, res) {

    if (MachineData.User == "")
        res.redirect('/login');
    else {
        res.render('main', MachineData.toJSON())
    }
});

router.get('/MachineData', function (req, res) {
    MachineData.ActivePage = Machine.Page.Main
    res.end(JSON.stringify(MachineData.toJSON()))

});

router.post('/ChangeMachineState', async function (req, res, next) {
    let ReceivedMachineState: any = req.body.MachineState
    if (Object.values(Machine.MachineState).includes(ReceivedMachineState)) {
        //Save machine change state to DB
        if (MachineData.MachineState != ReceivedMachineState) {
            try {
                //await MachineData.updateMachineStateToTime(new Date())
                MachineData.MachineStateFromTime = new Date()
                MachineData.MachineState = ReceivedMachineState
                clearInterval(StateCounterTimer);
                StateCounterTimer = setInterval(IncrementTime, UpdateInterval, UpdateInterval);
                res.end(JSON.stringify(MachineData.toJSON()))
            } catch (ex) {
                return next(ex)
            }
        } else
            res.end(JSON.stringify(MachineData.toJSON()))
    }
    else
        res.end(JSON.stringify(MachineData.toJSON()))
});

router.get('/GetUserStateTimes', function (req, res) {
    let user = req.query.user
    let response = {}
    // MachineDB.GetUserStateTimes(user).then((Data) => {
    //     response = Data
    // }).finally(() => {
    //     res.end(JSON.stringify(response))
    // })

});

export { StartRouting }
