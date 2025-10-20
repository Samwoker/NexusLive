import catchAsync from "../utils/catchAsync.ts";
import httpStatus from 'http-status'
import type {Request,Response} from 'express'
import * as userService from '../service/user.services.ts'
import * as tokenService from "../service/token.services.ts"
import type { PayloadType } from "../types/global";

export const createUser=catchAsync(async(req:Request , res:Response)=>{
    const user = await userService.createUser(req.body)
    if(!user){
        return res.status(httpStatus.BAD_REQUEST).json({message:"User registration failed"})
    }
    const payload:PayloadType ={
        id:user._id,
        role:user.roles
    }
    const token = tokenService.generateToken(payload)
    res.status(httpStatus.CREATED).json({
        success:true,
        message:"User created successfully",
        data:{
            user,
            token
        }
    })
})

export const login = catchAsync(async(req:Request,res:Response)=>{
    const {email,password} = req.body;
    const user = await userService.login(email,password)
     const payload:PayloadType = {
        id:user._id,
        role:user.roles
     }
    const token = tokenService.generateToken(payload)
    res.status(httpStatus.OK).json({user,token})
})

