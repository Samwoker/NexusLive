import { generateRegistrationOptions,verifyRegistrationResponse } from "@simplewebauthn/server";
import {isoUint8Array} from "@simplewebauthn/server/helpers"
import { generateAuthenticationOptions, type RegistrationResponseJSON } from "@simplewebauthn/server";
import mongoose from 'mongoose'
import {config} from "../config/config.ts"
import type { IUser } from "../models/user.model.ts";

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


export const generateAuthenticationOption = async(user:IUser):Promise<ReturnType<typeof generateAuthenticationOptions>>=>{
  const toBase64Url = (input:Buffer | Uint8Array | ArrayBuffer | string)=>{
    const buf = typeof input === 'string' ?
      Buffer.from(input):input instanceof ArrayBuffer
       ? Buffer.from(new Uint8Array(input))
       :Buffer.from(input as Uint8Array);
       return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
    const allowCredentials = user.credentials.map((c) => {
    const cred: any = {
      id: toBase64Url(c.credentialId),
      type: 'public-key',
    };
    if (c.transports) cred.transports = c.transports as unknown as /* AuthenticatorTransportFuture[] */ any;
    return cred;
  });
  return generateAuthenticationOptions({
    rpID:'localhost',
    allowCredentials,
    timeout:6000,
    userVerification:"preferred",
  })
}