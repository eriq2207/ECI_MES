import express from "express";
import session from "express-session";
import path from "path";

import {MachineData} from "./models/MachineData";

import * as scanner from "./controllers/scanner"
import {MachineDataBase} from "./controllers/machineDB"

import * as login from "./routers/login"
import * as main from "./routers/main"
import * as reference from "./routers/reference"

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
MachineDataBase.connect();

scanner.StartScanner(MachineObject)

app.use("/",login.StartRouting(MachineObject))
app.use("/",main.StartRouting(MachineObject))
app.use("/",reference.StartRouting(MachineObject))

app.listen(80);