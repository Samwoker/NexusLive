import catchAsync from "../utils/catchAsync.ts";
import httpStatus from "http-status";
import type { Request,Response } from "express";
import * as userService from "../service/user.services.ts"
import { generateRegistrationOptions } from "@simplewebauthn/server";

export const registerOptions = catchAsync(async(req:Request,res:Response)=>{
    const {username} = req.body;
    const user = await userService.findUserByUsername(username as string)
    const options = generateRegistrationOptions()
})