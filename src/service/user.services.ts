import CustomError from "../utils/customError.ts";
import httpStatus from 'http-status'
import User  from '../models/user.model.ts'
import type {IUser} from '../models/user.model.ts'
import {redisClient} from '../utils/redisClient.ts'
import type mongoose from "mongoose";


export const createUser = async(body:Partial<IUser>): Promise<IUser> =>{
    if(await User.isEmailTaken(body.email as string)){
        throw new CustomError(httpStatus.BAD_REQUEST,"Email already taken")
    }
    const user = await User.create(body)
    await redisClient.setex(`signup:${body.email}`,300,JSON.stringify(body))
    return user
}

export const login = async (email:string,password:string):Promise<IUser>=>{
    const user = await User.findOne({email})
    if(!user){
        throw new CustomError(httpStatus.NOT_FOUND,"User not found")
    }
    const isMatch = await user.isPasswordMatch(password)
    if(!isMatch){
        throw new CustomError(httpStatus.UNAUTHORIZED,"Invalid credentials")
    }
    return user
}

export const getUserById = async (id:mongoose.Schema.Types.ObjectId):Promise<IUser | null> =>{
    const user = await User.findOne({_id:id})
    return user
}