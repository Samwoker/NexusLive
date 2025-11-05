import catchAsync from "../utils/catchAsync.ts";
import type { Request , Response } from "express";
import httpStatus from "http-status"
import * as sessionService from "../service/session.services.ts"

export const sessions = catchAsync(async(req:Request,res:Response)=>{
    const userId = ((req.user as any)._id).toString()
    const sessions = await sessionService.getSessionByUserId(userId);
    res.status(httpStatus.OK).json({sessions})
})

export const revokeSession = catchAsync(async(req:Request,res:Response)=>{
    const userId = ((req.user as any)._id).toString()
    const {sessionId} = req.params;
     await sessionService.findSessionAndDelete(userId,sessionId!);
    res.status(httpStatus.OK).json({message:"Session revoked"})
})