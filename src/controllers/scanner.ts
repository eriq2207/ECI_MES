import * as readline from "readline";
import * as Machine from "../models/MachineData"

let MachineData: Machine.MachineData;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (data) => {
    if (MachineData.ActivePage == Machine.Page.Login) {
        MachineData.User = data;
    }
})

function StartScanner(MachineDataProp: Machine.MachineData) {
    MachineData = MachineDataProp
}

export { StartScanner }

