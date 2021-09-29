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

router.get('/login', function (req, res) {
    if (machineData.user === "")
        return res.render('login')
        
    return res.redirect('reference')
});

router.post('/login', async function (req, res) {
    machineData.lastScannedText.text = ""
    if (machineData.user != "")
        return res.redirect('login');

    const user: String = req.body.user;
    if(!config.disableUserCheck)
    {
        const userInList = config.users.filter((obj)=>{
            return obj.name === user
        })
        if(userInList.length == 0)
            return res.render('login', {
                error: 'Brak operatora "' + user + '" na liście zarejestrowanych operatorów!'
            })
    }
    //Check OP pattern
    if(!user.startsWith("OP"))
    {
        return res.render('login', {
            error: 'Nazwa operatora musi zaczynać się od OP...'
        })
    }
    //Set new session ID
    const lastMachineState = await machineDb.getLastMachineState();
    if(lastMachineState == null)
        machineData.userSession = 0
    else
        machineData.userSession = lastMachineState.userSession + 1;
        
    const actDate = new Date;
    machineData.machineState = machine.MachineStates.retooling;
    machineData.user = user;
    machineData.machineStateFromTime = actDate;
    machineData.machineStateToTime = actDate;
    await machineDb.updateMachineState(machineData)
    return res.redirect('reference')
})

router.get('/logout', async function (req, res) {
    const actDate = new Date;
    machineData.machineStateToTime = actDate;
    await machineDb.updateMachineState(machineData)
    machineData.lastScannedText.text = ""
    machineData.user = ""
    return res.redirect('login')
});

router.get('/loginData', function (req, res) {
    machineData.activePage = machine.Page.login
    return res.json(JSON.stringify(machineData))
});
router.get('/users', async function (req, res) {
    const actUsers = await machineDb.getUsers()
    return res.json(actUsers)
});

export { startRouting };