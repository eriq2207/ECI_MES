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

router.get('/reference', function (req, res) {
    if (MachineData.User === "")
        return res.redirect('login')

    if(MachineData.Reference.Name != "")
        return res.redirect('/')

    return res.render('reference', MachineData.toJSON())
    
});

router.post('/reference', async function (req, res) {
    if (MachineData.User === "")
        return res.redirect('login');

    const reference: String = req.body.reference;
    const ReferenceInList = config.References.filter((obj)=>{
        return obj.name === reference
    })
    if(ReferenceInList.length == 0)
    {
        res.statusCode = 500;
        return res.end()
    }
    //Set correct machine state
    MachineData.MachineStateToTime = new Date;
    await MachineDataBase.UpdateMachineState(MachineData)
    MachineData.MachineStateFromTime = new Date;
    MachineData.MachineStateToTime = new Date;
    MachineData.MachineState = Machine.MachineState.Work;
    await MachineDataBase.UpdateMachineState(MachineData)
    MachineData.SetMachineStateTimer()
    //Set reference
    MachineData.Reference.Name = reference
    MachineData.Reference.FromTime = new Date;
    MachineData.Reference.ToTime = new Date;
    await MachineDataBase.UpdateReference(MachineData)
    res.statusCode = 200
    return res.end()
})

router.get('/ReferenceData', function (req, res) {
    MachineData.ActivePage = Machine.Page.Reference
    return res.json(JSON.stringify(MachineData.toJSON()))
});

router.get('/References', async function (req, res) {
    const ReferencesAct = await MachineDataBase.GetReferences()
    return res.json(ReferencesAct)
});

export { StartRouting };