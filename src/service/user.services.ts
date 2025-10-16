import CustomError from "../utils/customError.ts";
import httpStatus from 'http-status'
import User  from '../models/user.model.ts'
import type {IUser} from '../models/user.model.ts'

export const createUser = async(body:Partial<IUser>): Promise<IUser> =>{
    if(await User.isEmailTaken(body.email as string)){
        throw new CustomError(httpStatus.BAD_REQUEST,"Email already taken")
    }
    const user = await User.create(body)
    return user
}