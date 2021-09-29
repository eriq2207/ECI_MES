import { Router } from "express";
import * as machine from "../models/MachineData"
import { machineDb } from "../controllers/machineDb";
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

router.get('/history', async function (req, res) {
    if (!req.query.userSession) {
        const lastMachineState = await machineDb.getLastMachineState()
        if(machineData.user == "")
            lastMachineState.userSession++;
        if(lastMachineState.userSession<1)
            return res.redirect("/oee")
        return res.redirect("history?userSession=" + (lastMachineState.userSession - 1).toString())
    }
    return res.render('oeeHistory', {
        config: config
    })
});


router.get('/machineStates', async function (req, res) {
    let userSession = machineData.userSession
    if (req.query.userSession)
        userSession = parseInt(req.query.userSession.toString())

    const States = await machineDb.getMachineStatesForSession(userSession)
    return res.json(JSON.stringify({ machineStates: States }))
});

router.get('/references', async function (req, res) {
    let userSession = machineData.userSession;
    if (req.query.userSession)
        userSession = parseInt(req.query.userSession.toString())
    const References = await machineDb.getReferencesForSession(userSession)
    return res.json(JSON.stringify({ references: References }))
})
router.get('/referencesWithMachineStates', async function (req, res) {
    let userSession = machineData.userSession;
    if (req.query.userSession)
        userSession = parseInt(req.query.userSession.toString())
    const references = await machineDb.getReferencesForSession(userSession)
    const machineStates = await machineDb.getMachineStatesForSession(userSession)
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