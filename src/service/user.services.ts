import CustomError from "../utils/customError.ts";
import httpStatus from 'http-status'
import User  from '../models/user.model.ts'
import type {IUser} from '../models/user.model.ts'
import {redisClient} from '../utils/redisClient.ts'
import type mongoose from "mongoose";
import type {Profile} from "passport-google-oauth20"
import * as rateLimiter from "../middlewares/authLimiter.ts"
import { Session } from "../models/session.model.ts";
import { generateSessionId } from "../utils/generateSessionId.ts";

export const createUser = async(body:Partial<IUser>): Promise<IUser> =>{
    if(await User.isEmailTaken(body.email as string)){
        throw new CustomError(httpStatus.BAD_REQUEST,"Email already taken")
    }
    const user = await User.create(body)
    await redisClient.setex(`user:${body.email}`,3600,JSON.stringify(user))
    return user
}

export const login = async (email:string,password:string,ipAddr:string,device:string):Promise<IUser>=>{

    const promise = [rateLimiter.slowBruteLimiter.consume(ipAddr)]
    const cachedUser = await redisClient.get(`user:${email}`)

    if(cachedUser){
        const UserObj:IUser = JSON.parse(cachedUser)
        const userInstance = User.hydrate(UserObj)
        const isMatch = await userInstance.isPasswordMatch(password)
        if(!isMatch) {
            return UserObj
        }else{
            throw new CustomError(httpStatus.FORBIDDEN,"Invalid credentials ")
        }
    }
    const user = await User.findOne({email})
    if(!user || !(await user.isPasswordMatch(password)) ){
        user && promise.push(
             rateLimiter.emailIpBruteLimiter.consume(`${email}_${ipAddr}`),
            rateLimiter.emailBruteLimiter.consume(email)
        )
        await Promise.all(promise)
        throw new CustomError(httpStatus.NOT_FOUND,"User not found")
    }
    
    await redisClient.setex(`user:${email}`,3600,JSON.stringify(user))
   const session =  await Session.create({
        sessionId:generateSessionId(),
        userId:(user._id).toString(),
        ipAddress:ipAddr,
        device:device,
        createdAt:new Date(),
        lastUsedAt:new Date()
    })

    await redisClient.setex(`user:${user._id}`,3600,JSON.stringify(session))
    return user
}

export const getUserById = async (id:mongoose.Schema.Types.ObjectId):Promise<IUser | null> =>{
    const cacheKey = `user:${id}`
    const cachedUser = await redisClient.get(cacheKey)
    if(cachedUser){
        const user:IUser = JSON.parse(cachedUser)
        return user
    }
    const user = await User.findOne({_id:id})
    if(user) {
        await redisClient.setex(cacheKey,3600,JSON.stringify(user))
    }
    return user
}

export const getUserByEmail = async (email:string):Promise<IUser | null> =>{
    const cacheKey = `user:${email}`
    const cachedUser = await redisClient.get(cacheKey)
    if(cachedUser){
        const user:IUser = JSON.parse(cachedUser)
        return user
    }
    const user = await User.findOne({email})
    if(user) await redisClient.setex(cacheKey,3600,JSON.stringify(user))
    return user
}

export const updateUserById = async (id:mongoose.Schema.Types.ObjectId,updateBody:Partial<IUser>):Promise<IUser>=>{
    const user =await getUserById(id)
    if(!user){
        throw new CustomError(httpStatus.NOT_FOUND,"User not found")
    }
    Object.assign(user,updateBody)
    await user.save()
    await redisClient.setex(`user:${id}`,3600,JSON.stringify(user))
    await redisClient.setex(`user:${user.email}`,3600,JSON.stringify(user))
    return user
}

export const findOrCreateGoogleUser = async (profile:Profile) =>{
    const email = Array.isArray(profile.emails) && profile.emails.length > 0? profile.emails[0]?.value : undefined;
    let user = await User.findOne({email});
    if(!user){
        user = await User.create({
            name:profile.displayName,
            email:email,
            googleId:profile.id
        })
    }
    return user
}