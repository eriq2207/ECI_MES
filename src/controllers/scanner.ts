import * as readline from "readline";
import * as machine from "../models/machineData"
import * as config from "../config.json"

let machineData: machine.MachineData;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (data) => {
    if (machineData.activePage == machine.Page.login) {
        machineData.lastScannedText.text = data;
        machineData.lastScannedText.page = machine.Page.login;
        const userInList = config.users.filter((obj) => {
            return obj.name === data
        })
        if (userInList.length == 1)
            machineData.user = data;
    }
    else if (machineData.activePage == machine.Page.reference)
    {
        machineData.lastScannedText.text = data;
        machineData.lastScannedText.page = machine.Page.reference;
    }
})

function startScanner(machineDataProp: machine.MachineData) {
    machineData = machineDataProp
}

export { startScanner }

