import express from "express";
import session from "express-session";
import path from "path";

import {MachineData} from "./models/machineData";

import * as scanner from "./controllers/scanner"
import {machineDataBase} from "./controllers/machineDb"

import * as login from "./routers/login"
import * as main from "./routers/main"
import * as reference from "./routers/reference"
import * as oee from "./routers/oee"

declare module 'express-session' {
    export interface SessionData {
        user: { [key: string]: any };
    }
}

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(session({
    secret: "secret_key",
    resave: true,
    saveUninitialized: false
}));
app.use(express.urlencoded({extended: true}))
app.use(express.json());

const MachineObject = new MachineData();
machineDataBase.connect();

scanner.startScanner(MachineObject)

app.use("/",login.startRouting(MachineObject))
app.use("/",main.startRouting(MachineObject))
app.use("/",reference.startRouting(MachineObject))
app.use("/oee",oee.startRouting(MachineObject))

app.listen(80);