import { MongoClient, Db} from 'mongodb'
import config from '../config.json'
import * as machine from "../models/MachineData"

const url = config.mongoDB.connString;
class MachineDB {
    public client: MongoClient;
    public db: Db;
    constructor(){
        this.client = new MongoClient(url);
    }
    public async connect(){
        await this.client.connect()
        this.db = this.client.db(config.mongoDB.dbName)
        //Temporary save users and ref from config file - will be from external system
        this.saveUsers(config.users)
        this.saveReferences(config.references)
    }
    public async saveUsers(users: any[]): Promise<any> {
        await this.db.collection("users").deleteMany({})
        return await this.db.collection("users").insertMany(users)
    }
    public async saveReferences(references: any[]): Promise<any> {
        await this.db.collection("referencesList").deleteMany({})
        return await this.db.collection("referencesList").insertMany(references)
    }
    public async getUsers(): Promise<any> {
        return this.db.collection("users").find({}).project({name: 1, _id: 0}).toArray()
    }
    public async getReferences(): Promise<any> {
        return this.db.collection("referencesList").find({}).project({name: 1, _id: 0}).toArray()
    }
    public async updateMachineState(machineData: machine.MachineData): Promise<any> {
        return await this.db.collection("machineStates").updateOne(
            {fromTime: machineData.machineStateFromTime, state: machineData.machineState},
            {$set: {
                state: machineData.machineState, 
                toTime: machineData.machineStateToTime,
                fromTime: machineData.machineStateFromTime,
                user: machineData.user,
                userSession: machineData.userSession
            }},
            {upsert: true})
    }
    public async updateReference(machineData: machine.MachineData): Promise<any> {
        return await this.db.collection("referencesHistory").updateOne(
            {FromTime: machineData.reference.fromTime},
            {$set: {
                reference: machineData.reference.name, 
                toTime: machineData.reference.toTime,
                fromTime: machineData.reference.fromTime,
                done: machineData.reference.done,
                user: machineData.user,
                userSession: machineData.userSession
            }},
            {upsert: true})
    }
    public async getLastMachineState(): Promise<any> {
        return await this.db.collection("machineStates").findOne({}, {sort:{$natural:-1}})
    }
    public async getMachineStatesForSession(userSessionParam: number): Promise<any> {
        return await this.db.collection("machineStates").find({userSession: userSessionParam}).toArray()
    }
    public async getReferencesForSession(userSessionParam: number): Promise<any> {
        return await this.db.collection("referencesHistory").find({userSession: userSessionParam}).toArray()
    }
}
const machineDb = new MachineDB()
export {machineDb }
