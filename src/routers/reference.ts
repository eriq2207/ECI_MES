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

router.get('/reference', function (req, res) {
    if (machineData.user === "")
        return res.redirect('login')

    if(machineData.reference.name != "")
        return res.redirect('/')

    return res.render('reference', machineData)
    
});

router.post('/reference', async function (req, res) {
    if (machineData.user === "")
        return res.redirect('login');

    const reference: String = req.body.reference;
    const referenceInList = config.references.filter((obj)=>{
        return obj.name === reference
    })
    if(referenceInList.length == 0)
    {
        res.statusCode = 500;
        return res.end()
    }
    const actDate = new Date;
    machineData.changeMachineState(machine.MachineStates.work, actDate)
    //Set reference
    machineData.reference.name = referenceInList[0].name;
    machineData.reference.targetTime = referenceInList[0].targetTime;
    machineData.reference.done = false;
    machineData.reference.fromTime = actDate;
    machineData.reference.toTime = actDate;
    await machineDataBase.updateReference(machineData)

    res.statusCode = 200
    return res.end()
})

router.get('/referenceData', function (req, res) {
    machineData.activePage = machine.Page.reference
    return res.json(JSON.stringify(machineData))
});

router.get('/references', async function (req, res) {
    const actReferences = await machineDataBase.getReferences()
    return res.json(actReferences)
});
router.post('/finishReference', async function (req, res) {
    const actDate = new Date;
    machineData.changeMachineState(machine.MachineStates.retooling, actDate)
    //Set reference
    machineData.reference.toTime = actDate;
    machineData.reference.done = true;
    await machineDataBase.updateReference(machineData)
    machineData.reference.name = ""

    return res.end();
});

export { startRouting };