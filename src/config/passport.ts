import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import type {Profile , VerifyCallback} from "passport-google-oauth20"
import {config} from "./config.ts";
import * as userService from "../service/user.services.ts"
import mongoose from "mongoose";

export interface AppUser{
    id:string;
    email?:string;
}

const googleStrategyObject = {
    clientID:config.googleClientId,
    clientSecret:config.googleClientSecret,
    callbackURL:config.googleCallbackUrl
}

const getUserStrategy = async(accessToken:string ,refreshToken:string,profile:Profile,done:VerifyCallback):Promise<void>=>{
    try {
        let user = await userService.findOrCreateGoogleUser(profile);
        return done(null,user as AppUser)
    } catch (error) {
        return done(error as any ,undefined)
    }
}

const serializeUserFunction = (user:AppUser,done:(err:any,id?:unknown)=>void):void=>{
    done(null,user.id)
}

const deserializeUserFunction = async(id:mongoose.Schema.Types.ObjectId,done:(err:any , user?:AppUser |false| null)=>void):Promise<void>=>{
    try {
        const user = await userService.getUserById(id)
        done(null,user as AppUser)
    } catch (error) {
        done(error as any,null)
    }
}

const googleStrategy = new GoogleStrategy(
    googleStrategyObject,
    getUserStrategy
)

export default {
    googleStrategy,
    serializeUserFunction,
    deserializeUserFunction
}