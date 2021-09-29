import * as machine from "../models/MachineData"
import * as config from "../config.json"
import SerialPort from "serialport"

const Readline = SerialPort.parsers.Readline;
const ReadLineParser = new Readline({ delimiter: '\r\n' });

let machineData: machine.MachineData;
const Scanner = new SerialPort(config.scannerComPort, {
    autoOpen: false,
    baudRate: 9600,
    stopBits: 1,
    parity: "even",
    rtscts: false,
})

function start(machineDataParam: machine.MachineData) {
    machineData = machineDataParam;
    ScannerComm()
    OpenCommPort()
}

async function OpenCommPort() {
    try {
        const ports = await SerialPort.list()
        const SelectedPort = ports.filter((port) => {
            return port.path == config.scannerComPort
        })
        if (SelectedPort.length == 0) {
            setTimeout(OpenCommPort, 5000)
            return false;
        }
        Scanner.open()

    } catch (ex) {
        console.log("Error opening COM port: " + ex.stack)
    }
}

function ScannerComm() {
    Scanner.on('open', () => {
        console.log("Opened scanner COM port!")
    })
    Scanner.on('close', () => {
        console.log("Scanner COM port closed!")
        setTimeout(OpenCommPort, 5000)
    })
    Scanner.on('error', (err) => {
        console.log("Error occured on scanner: " + err.stack)
        setTimeout(OpenCommPort, 5000)
    })
    Scanner.pipe(ReadLineParser);
    ReadLineParser.on('data', (data) => {
        machineData.lastScannedText.text = data;
        machineData.lastScannedText.page = machineData.activePage
    })
}

export { start }

