import catchAsync from "../utils/catchAsync.ts";
import httpStatus from 'http-status'
import type {Request,Response} from 'express'
import * as userService from '../service/user.services.ts'
import * as tokenService from "../service/token.services.ts"
import type mongoose from "mongoose"
import * as authService from "../service/auth.services.ts"
import {config} from "../config/config.ts"
import {sendEmail} from "../utils/sendEmail.ts"
import { tokenTypes } from "../config/tokens.ts";
import CustomError from "../utils/customError.ts";
import Token from "../models/token.model.ts";


export const createUser=catchAsync(async(req:Request , res:Response)=>{
    const user = await userService.createUser(req.body)
    if(!user){
        return res.status(httpStatus.BAD_REQUEST).json({message:"User registration failed"})
    }
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user._id as mongoose.Schema.Types.ObjectId)

    const verifyUrl = `${config.baseUrl}/api/v1/auth/verify-email?token=${verifyEmailToken}`
    await sendEmail(
        user.email,
        "Verify your email",
        `<p>Hello ${user.name}, please verify your email by clicking this link:</p>
     <a href="${verifyUrl}">${verifyUrl}</a>`
    )
    
    res.status(httpStatus.CREATED).json({
        success:true,
        message:"Registration completed please check your email to verify your account",
    })
})

export const verifyEmail = catchAsync(async(req:Request,res:Response)=>{
        const verifyEmailToken = req.query.token as string
        const tokenDoc = await tokenService.verifyToken(verifyEmailToken,tokenTypes.VERIFY_EMAIL)
        const user = await userService.getUserById(tokenDoc.user)
        if(!user){
            throw new CustomError(httpStatus.NOT_FOUND,"user not found")
        }
    const token = await tokenService.generateAuthTokens(user._id as mongoose.Schema.Types.ObjectId)
    user.emailVerified = true
    await user.save()
    await Token.deleteOne({_id:tokenDoc._id})
    res.status(httpStatus.CREATED).json({
        success:true,
        message:"Email verifies successfully",
        data:{
            user,
            token
        }
    })
})

export const login = catchAsync(async(req:Request,res:Response)=>{
    const {email,password} = req.body;
    const user = await userService.login(email,password,req.socket.remoteAddress || "unknown_ip",req.headers["user-agent"] || "unknown_device")
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

export const resendVerificationEmail = catchAsync(async(req:Request,res:Response)=>{
    const {email} = req.body;
    if(!email){
        throw new CustomError(httpStatus.BAD_REQUEST,"Email is required")
    }
    const user = await userService.getUserByEmail(email)
    if(!user){
        throw new CustomError(httpStatus.NOT_FOUND,"User not found")
    }
    if(user.emailVerified){
        throw new CustomError(httpStatus.BAD_REQUEST,"Email is already verified")
    }
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user._id as mongoose.Schema.Types.ObjectId)

    const verifyUrl = `${config.baseUrl}/api/v1/auth/verify-email?token=${verifyEmailToken}`
    await sendEmail(
        user.email,
        "Resend email verification",
        `<p>Hello ${user.name}, please verify your email by clicking this link:</p>
     <a href="${verifyUrl}">${verifyUrl}</a>`
    )
    res.status(httpStatus.OK).json({
        success:true,
        message:"Verification email resent successfully"
    })
})

export const forgotPassword  = catchAsync(async(req:Request,res:Response)=>{
    const {email} = req.body;
    const user = await userService.getUserByEmail(email)
    if(!user){
        throw new CustomError(httpStatus.NOT_FOUND,"User not found")
    }
    const resetPasswordToken = await tokenService.generateResetPasswordToken(user._id as mongoose.Schema.Types.ObjectId)
    const resetPasswordUrl = `${config.baseUrl}/api/v1/auth/reset-password?token=${resetPasswordToken}`
    await sendEmail(
        user.email,
        "Reset your password",
        `<p>Hello ${user.name}, please reset your password by clicking this link:</p>
         <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>`
    )
    res.status(httpStatus.OK).json({
        success:true,
        message:"Password reset email sent successfully"
    })
})

export const resetPassword = catchAsync(async(req:Request,res:Response)=>{
    const {newPassword} = req.body;
    const resetPasswordToken = req.query.token as string
    const tokenDoc = await tokenService.verifyToken(resetPasswordToken,tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(tokenDoc.user)
    if(!user){
        throw new CustomError(httpStatus.NOT_FOUND,"User not found")
    }
    user.password = newPassword;
    await user.save()
    await Token.deleteMany({user:user._id,type:tokenTypes.RESET_PASSWORD})
    res.status(httpStatus.OK).json({
        success:true,
        message:"Password reset successful"
    })
})

export const googleLoginCallback = catchAsync(async (req:Request,res:Response)=>{
    const user =  req.user as any;
    const token = await tokenService.generateAuthTokens(user._id as mongoose.Schema.Types.ObjectId);
    res.status(httpStatus.OK).json({message:"Login successful" , user, token})
})