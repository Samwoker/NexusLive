import mongoose from "mongoose";

export interface ICredentialSchema extends mongoose.Document{
    credentialId:Buffer;
    publicKey:Buffer;
    counter:number;
    deviceType?:string;
    backedUp?:boolean;
    transports?:string[]
}

const credentialSchema = new mongoose.Schema<ICredentialSchema>({
    credentialId:Buffer,
    publicKey:String,
    counter:Number,
    deviceType:String,
    backedUp:Boolean,
    transports:[String],
})

export default credentialSchema;