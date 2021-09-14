import { MongoClient, Db} from 'mongodb'
import config from '../config.json'
import * as MachineDBModels from "../models/MachineDBModels"

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
    public async SaveUsers(Users: MachineDBModels.User[] | String[]): Promise<any> {
        await this.db.collection("Users").deleteMany({})
        await this.db.collection("Users").insertMany(Users)
    }
    public async GetUsers(): Promise<any> {
        return this.db.collection("Users").find({}).project({name: 1, _id: 0}).toArray()
    }
    public async SaveReferences(References: MachineDBModels.Reference[] | any[]): Promise<any> {
        await this.db.collection("References").deleteMany({})
        await this.db.collection("References").insertMany(References)
    }
    
}
const MachineDataBase = new MachineDB()
export {MachineDataBase}
