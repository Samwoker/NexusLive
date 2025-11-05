import catchAsync from "../utils/catchAsync.ts";
import CustomError from "../utils/customError.ts";
import type { Request , Response } from "express";
import httpStatus from "http-status"
import * as sessionService from "../service/session.services.ts"

export const sessions = catchAsync(async(req:Request,res:Response)=>{
    const userId = (req.user as any)._id
    const sessions = await sessionService.getSessionByUserId(userId);
    res.status(httpStatus.OK).json({sessions})
})