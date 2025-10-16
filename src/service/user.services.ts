import CustomError from "../utils/customError.ts";
import httpStatus from 'http-status'
import User  from '../models/user.model.ts'
import type {IUser} from '../models/user.model.ts'
import {redisClient} from '../utils/redisClient.ts'

export const createUser = async(body:Partial<IUser>): Promise<IUser> =>{
    if(await User.isEmailTaken(body.email as string)){
        throw new CustomError(httpStatus.BAD_REQUEST,"Email already taken")
    }
    const user = await User.create(body)
    await redisClient.setex(`signup:${body.email}`,300,JSON.stringify(body))
    return user
}