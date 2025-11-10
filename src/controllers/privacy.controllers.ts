import catchAsync from "../utils/catchAsync.ts";
import httpStatus from "http-status";
import type { Request, Response } from "express";
import type { IUser } from "../models/user.model.ts";

export const getUserPrivacy = catchAsync(async(req:Request,res:Response)=>{
    const user:IUser = (req as any).user;
    res.status(httpStatus.OK).json({message:"User privacy info retrieved successfully",data:{user}})
})

export const updatePrivacy = catchAsync(async(req:Request,res:Response)=>{
    const 
})