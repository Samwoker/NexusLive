import catchAsync from "../utils/catchAsync.ts";
import type { Request,Response } from "express";
import httpStatus from 'http-status';
import * as userService from "../service/user.services.ts"
import * as tokenService from "../service/token.services.ts"
import {config} from "../config/config.ts"
import { sendEmail } from "../utils/sendEmail.ts";
import { tokenTypes } from "../config/tokens.ts";

export const sendMagicLink = catchAsync(async(req:Request,res:Response)=>{
    const {email} = req.body;
    const user = await userService.getUserByEmail(email);
    if(!user) return res.status(httpStatus.OK).end()
    const token = await tokenService.generateVerifyEmailToken(user._id) 
    const magicLink = `${config.baseUrl}/api/v1/auth/magic/verify?token=${token}`;
    await sendEmail( user.email,
        "Login via magic link",
        `<p>Hello ${user.name}, please verify your email by clicking this link:</p>
        <a href="${magicLink}">${magicLink}</a>`)

        res.status(httpStatus.OK).json({message:"Magic link sent"})
})

export const verifyMagicLink = catchAsync(async(req:Request,res:Response)=>{
    const {token} = req.query;
    const tokenDocument = await tokenService.verifyToken(token as any,tokenTypes.VERIFY_EMAIL)
    const id = tokenDocument.user
    const sessionToken = await tokenService.generateAuthTokens(id);
    const user = await userService.getUserById(id)
    res.status(httpStatus.OK).json({message:"Login successful",data:{
        user,
        sessionToken
    }})
})