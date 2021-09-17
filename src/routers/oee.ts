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

router.get('/oee', async function (req, res) {
    return res.render('oee', {
        MachineData: MachineData,
        config: config
    })
});

router.get('/OEEMachineStates', async function (req, res) {
    const States = await MachineDataBase.GetMachineStatesForSession(MachineData.UserSession)
    return res.json(JSON.stringify({ MachineStates: States }))
});

router.get('/OEEReferences', async function (req, res) {
    const References = await MachineDataBase.GetReferencesForSession(MachineData.UserSession)
    return res.json(JSON.stringify({ References: References }))
})
router.get('/OEEReferencesWithMachineStates', async function (req, res) {
    const References = await MachineDataBase.GetReferencesForSession(MachineData.UserSession)
    const MachineStates = await MachineDataBase.GetMachineStatesForSession(MachineData.UserSession)
    References.forEach(ActReference => {
        let StartIndex = MachineStates.findIndex(obj => obj.FromTime.getTime() === ActReference.FromTime.getTime())
        let EndIndex = MachineStates.findIndex(obj => obj.ToTime.getTime() === ActReference.ToTime.getTime())

        const ActRefStates = MachineStates.slice(StartIndex, EndIndex + 1);
        ActReference.MachineStates = ActRefStates
        //Get target time
        const ConfigReference = config.References.filter(obj => obj.name == ActReference.Reference)
        ActReference.TargetTime = ConfigReference[0].TargetTime
    });
    return res.json(JSON.stringify({ ReferencesWithStates: References }))
})


export { StartRouting };