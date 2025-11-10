import catchAsync from "../utils/catchAsync.ts";
import httpStatus from "http-status";
import type { Request, Response } from "express";
import type { IUser } from "../models/user.model.ts";

export const getUserPrivacy = catchAsync(async(req:Request,res:Response)=>{
    const user:IUser = (req as any).user;
    res.status(httpStatus.OK).json({message:"User privacy info retrieved successfully",data:{user}})
})

export const updatePrivacy = catchAsync(async(req:Request,res:Response)=>{
    const user:IUser = (req as any).user;
    const updateBody = req.body;
    const allowedKeys = [
        "profileVisibility",
        "friendListVisibility",
        "searchEngineIndexing",
        "showEmail",
        "showPhone",
        "allowedMessageFrom"
    ]
    allowedKeys.forEach((key)=>{
        if(updateBody[key] !== undefined){
            (user.privacy as any)[key] = updateBody[key];
        }
    })
    await user.save();
    res.status(httpStatus.OK).json({message:"Privacy setting updated successfully",data:{user}})
})