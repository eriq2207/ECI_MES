import { Router } from "express";
import * as Machine from "../models/MachineData"
import { MachineDataBase } from "../controllers/machineDB"; 
import * as config from "../config.json"

const router = Router()
let MachineData: Machine.MachineData;

function StartRouting(MachineDataParam: Machine.MachineData): Router {
    MachineData = MachineDataParam;
    return router;
}

router.get('/UserSessionMachineStates', async function (req, res) {
    const States = await MachineDataBase.GetMachineStatesForSession(MachineData.UserSession)
    return res.json({MachineStates: States})
});

router.get('/UserSessionReferences', async function (req, res) {
    const References = await MachineDataBase.GetReferencesForSession(MachineData.UserSession)
    return res.json({References: References})
})

export { StartRouting };