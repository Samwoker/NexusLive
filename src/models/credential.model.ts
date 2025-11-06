import mongoose from "mongoose";

const credentialSchema = new mongoose.Schema({
    credentialId:Uint8Array,
    publicKey:String,
    counter:Number,
    deviceType:String,
    backedUp:Boolean,
    transports:[String],
})

export default credentialSchema;