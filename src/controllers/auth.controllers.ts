import catchAsync from "../utils/catchAsync.ts";
import httpStatus from 'http-status'
import type {Request,Response} from 'express'
import * as userService from '../service/user.services.ts'
import * as tokenService from "../service/token.services.ts"
import type mongoose from "mongoose"
import * as authService from "../service/auth.services.ts"


export const createUser=catchAsync(async(req:Request , res:Response)=>{
    const user = await userService.createUser(req.body)
    if(!user){
        return res.status(httpStatus.BAD_REQUEST).json({message:"User registration failed"})
    }
    const token = await tokenService.generateAuthTokens(user._id as mongoose.Schema.Types.ObjectId)
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
    if(!user){
        return res.status(httpStatus.UNAUTHORIZED).json({message:"Invalid email or password"})
    }
    const token =await tokenService.generateAuthTokens(user._id as mongoose.Schema.Types.ObjectId)
    res.status(httpStatus.OK).json({
        success:true,
        message:"Login successful",
        data:{
            user,
            token
        }
    })
})

export const logout = catchAsync(async(req:Request,res:Response)=>{
    const {refreshToken} = req.body;
    if(!refreshToken){
        return res.status(httpStatus.BAD_REQUEST).json({message:"Refresh token is required"})
    }
    const tokenDoc = await tokenService.verifyToken(refreshToken,"refresh")
    if(!tokenDoc){
        return res.status(httpStatus.NOT_FOUND).json({message:"User already logged out"})
    }
    await tokenDoc.deleteOne()
    res.status(httpStatus.OK).json({
        success:true,
        message:"Logout successful"
    })
})

export const refreshToken = catchAsync(async(req:Request,res:Response)=>{
    const {refreshToken} = req.body;
    const token= await authService.refreshAuthToken(refreshToken)
    res.status(httpStatus.OK).json({
        success:true,
        message:"Token refreshed successfully",
        data:{
            token
        }
    })
})
