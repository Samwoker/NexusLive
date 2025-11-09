import type { WebAuthnCredential } from "@simplewebauthn/server";
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
    credentialId:Uint8Array,
    publicKey:String,
    counter:Number,
    deviceType:String,
    backedUp:Boolean,
    transports:[String],
})

export default credentialSchema;