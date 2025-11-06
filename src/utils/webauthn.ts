import { generateRegistrationOptions,verifyRegistrationResponse } from "@simplewebauthn/server";
import {isoUint8Array} from "@simplewebauthn/server/helpers"
import type { RegistrationResponseJSON } from "@simplewebauthn/server";
import mongoose from 'mongoose'
import {config} from "../config/config.ts"

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

export const verifyRegistrationResponses=async(credential:RegistrationResponseJSON,challenge:string)=>{
    return verifyRegistrationResponse({
        response:credential,
        expectedChallenge:challenge,
        expectedOrigin:config.baseUrl,
        expectedRPID:"localhost"
    })
}