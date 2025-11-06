import mongoose from "mongoose";

const credentialSchema = new mongoose.Schema({
    credentialId:String,
    publicKey:String,
    counter:Number,
    deviceType:String,
    backedUp:Boolean,
    transports:[String],
})

export default credentialSchema;