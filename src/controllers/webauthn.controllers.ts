import catchAsync from "../utils/catchAsync.ts";
import httpStatus from "http-status";
import type { Request,Response } from "express";
import * as userService from "../service/user.services.ts"
import * as webauthn from "../utils/webauthn.ts"

export const registerOptions = catchAsync(async(req:Request,res:Response)=>{
    const {username} = req.body;
    const user = await userService.findUserByUsername(username as string)
    const options = await webauthn.generateRegistrationOption(user._id,username)
    await userService.updateUserById(user._id,{challenge:options.challenge})
    res.status(httpStatus.CREATED).json(options)
})

export const register = catchAsync(async(req:Request,res:Response)=>{
    const {credential,username} = req.body;
    const user = await userService.findUserByUsername(username);
    const verification = await webauthn.verifyRegistrationResponses(credential,username)
    await userService.pushWebauthnCredentials(verification,username)
    res.status(httpStatus.CREATED).json({message:"Registration successful"})
    
})

export const authenticateOptions = catchAsync(async(req:Request,res:Response)=>{
    const {username} = req.body;
    const user  = await userService.findUserByUsername(username as string);
    const options = await webauthn.generateAuthenticationOption(user)
    await userService.updateUserById(user._id,{challenge:options.challenge})
    res.status(httpStatus.CREATED).json({options})
})