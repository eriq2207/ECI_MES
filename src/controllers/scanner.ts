import * as readline from "readline";
import * as Machine from "../models/MachineData"
import * as config from "../config.json"

let MachineData: Machine.MachineData;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (data) => {
    if (MachineData.ActivePage == Machine.Page.Login) {
        MachineData.LastScannedText.text = data;
        MachineData.LastScannedText.page = Machine.Page.Login;
        const UserInList = config.Users.filter((obj) => {
            return obj.name === data
        })
        if (UserInList.length == 1)
            MachineData.User = data;
    }
    else if (MachineData.ActivePage == Machine.Page.Reference)
    {
        MachineData.LastScannedText.text = data;
        MachineData.LastScannedText.page = Machine.Page.Reference;
    }
})

function StartScanner(MachineDataProp: Machine.MachineData) {
    MachineData = MachineDataProp
}

export { StartScanner }

