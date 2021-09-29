import express from "express";
import path from "path";

import { MachineData } from "./models/MachineData";

import * as scanner from "./controllers/scanner"
import { machineDb } from "./controllers/machineDb"
import * as config from "./config.json"

import * as login from "./routers/login"
import * as main from "./routers/main"
import * as reference from "./routers/reference"
import * as oee from "./routers/oee"

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.urlencoded({extended: true}))
app.use(express.json());

const machineObject = new MachineData();
machineObject.disableOperatorCheck = config.disableUserCheck
machineDb.connect();

scanner.start(machineObject)

app.use("/",login.startRouting(machineObject))
app.use("/",main.startRouting(machineObject))
app.use("/",reference.startRouting(machineObject))
app.use("/oee",oee.startRouting(machineObject))

app.listen(80);