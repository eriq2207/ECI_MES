import { Router } from "express";
import * as machine from "../models/machineData"
import { machineDataBase } from "../controllers/machineDb";
import * as config from "../config.json"

const router = Router()
let machineData: machine.MachineData;

function startRouting(machineDataParam: machine.MachineData): Router {
    machineData = machineDataParam;
    return router;
}

router.get('/', async function (req, res) {
    return res.render('oee', {
        machineData: machineData,
        config: config
    })
});

router.get('/machineStates', async function (req, res) {
    const States = await machineDataBase.getMachineStatesForSession(machineData.userSession)
    return res.json(JSON.stringify({ machineStates: States }))
});

router.get('/references', async function (req, res) {
    const References = await machineDataBase.getReferencesForSession(machineData.userSession)
    return res.json(JSON.stringify({ references: References }))
})
router.get('/referencesWithMachineStates', async function (req, res) {
    const references = await machineDataBase.getReferencesForSession(machineData.userSession)
    const machineStates = await machineDataBase.getMachineStatesForSession(machineData.userSession)
    references.forEach(actReference => {
        let startIndex = machineStates.findIndex(obj => obj.fromTime.getTime() === actReference.fromTime.getTime())
        let endIndex = machineStates.findIndex(obj => obj.toTime.getTime() === actReference.toTime.getTime())

        const actRefStates = machineStates.slice(startIndex, endIndex + 1);
        actReference.machineStates = actRefStates
        //Get target time
        const configReference = config.references.filter(obj => obj.name == actReference.reference)
        actReference.targetTime = configReference[0].targetTime
    });
    return res.json(JSON.stringify({ referencesWithStates: references }))
})


export { startRouting };