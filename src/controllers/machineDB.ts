import { MongoClient, Db} from 'mongodb'
import config from '../config.json'
import * as Machine from "../models/MachineData"

const url = config.MongoDB.ConnString;
class MachineDB {
    public client: MongoClient;
    public db: Db;
    constructor(){
        this.client = new MongoClient(url);
    }
    public async connect(){
        await this.client.connect()
        this.db = this.client.db(config.MongoDB.DbName)
        //Temporary save users and ref from config file - will be from external system
        this.SaveUsers(config.Users)
        this.SaveReferences(config.References)
    }
    public async SaveUsers(Users: any[]): Promise<any> {
        await this.db.collection("Users").deleteMany({})
        return await this.db.collection("Users").insertMany(Users)
    }
    public async SaveReferences(References: any[]): Promise<any> {
        await this.db.collection("ReferencesList").deleteMany({})
        return await this.db.collection("ReferencesList").insertMany(References)
    }
    public async GetUsers(): Promise<any> {
        return this.db.collection("Users").find({}).project({name: 1, _id: 0}).toArray()
    }
    public async GetReferences(): Promise<any> {
        return this.db.collection("ReferencesList").find({}).project({name: 1, _id: 0}).toArray()
    }
    public async UpdateMachineState(MachineData: Machine.MachineData): Promise<any> {
        return await this.db.collection("MachineStates").updateOne(
            {FromTime: MachineData.MachineStateFromTime, State: MachineData.MachineState},
            {$set: {
                State: MachineData.MachineState, 
                ToTime: MachineData.MachineStateToTime,
                FromTime: MachineData.MachineStateFromTime,
                Operator: MachineData.User
            }},
            {upsert: true})
    }
    public async UpdateReference(MachineData: Machine.MachineData): Promise<any> {
        return await this.db.collection("ReferencesHistory").updateOne(
            {FromTime: MachineData.Reference.FromTime},
            {$set: {
                Reference: MachineData.Reference.Name, 
                ToTime: MachineData.Reference.ToTime,
                FromTime: MachineData.Reference.FromTime,
                Operator: MachineData.User
            }},
            {upsert: true})
    }
}
const MachineDataBase = new MachineDB()
export {MachineDataBase}
