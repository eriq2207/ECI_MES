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

router.get('/login', function (req, res) {
    if (MachineData.User === "")
        return res.render('login')
        
    return res.redirect('reference')
});

router.post('/login', async function (req, res) {
    if (MachineData.User != "")
        return res.redirect('login');

    const user: String = req.body.user;
    const UserInList = config.Users.filter((obj)=>{
        return obj.name === user
    })
    if(UserInList.length == 0)
        return res.render('login', {
            error: 'Brak operatora "' + user + '" na liście zarejestrowanych operatorów!'
        })
    //Set new session ID
    const LastMachineState = await MachineDataBase.GetLastMachineState();
    if(LastMachineState == null)
        MachineData.UserSession = 0
    else
        MachineData.UserSession = LastMachineState.UserSession + 1;
    const ActDate = new Date;
    MachineData.MachineState = Machine.MachineStates.Retooling;
    MachineData.User = user;
    MachineData.MachineStateFromTime = ActDate;
    MachineData.MachineStateToTime = ActDate;
    await MachineDataBase.UpdateMachineState(MachineData)
    MachineData.SetMachineStateTimer()
    return res.redirect('reference')
})

router.get('/logout', async function (req, res) {
    await req.session.destroy((err)=>{
        if(err)
            console.log("Session destroy error occured: " + err.stack)
    });
    const ActDate = new Date;
    MachineData.MachineStateToTime = ActDate;
    await MachineDataBase.UpdateMachineState(MachineData)
    MachineData.LastScannedText.text = ""
    MachineData.User = ""
    return res.redirect('login')
});

router.get('/LoginData', function (req, res) {
    MachineData.ActivePage = Machine.Page.Login

    return res.json(JSON.stringify(MachineData.toJSON()))
});
router.get('/Users', async function (req, res) {
    const UsersAct = await MachineDataBase.GetUsers()
    return res.json(UsersAct)
});

export { StartRouting };