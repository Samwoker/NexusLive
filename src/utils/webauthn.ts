import { generateRegistrationOptions,verifyRegistrationResponse } from "@simplewebauthn/server";
import {isoUint8Array} from "@simplewebauthn/server/helpers"
import mongoose from 'mongoose'

export const generateRegistrationOption =async (userId:mongoose.Schema.Types.ObjectId,username:string)=>{
  return generateRegistrationOptions({
    rpName:"NexusLive",
    rpID:'localhost',
    userID:isoUint8Array.fromUTF8String(userId.toString()),
    userName:username,
    timeout:6000,
    attestationType:'none'
   })

}