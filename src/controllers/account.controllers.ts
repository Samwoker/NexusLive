import catchAsync from "../utils/catchAsync.ts";
import httpStatus from "http-status"
import type { Request ,Response } from "express";
import type{IUser} from "../models/user.model.ts"

export const deleteUserAccount = catchAsync(async(req:Request,res:Response)=>{
    const user:IUser = (req as any).user;
    if(user.isDeleted){
        return res.status(httpStatus.BAD_REQUEST).json({message:"Account already deleted"})
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save()
    res.status(httpStatus.OK).json({message:"Account deleted you can recover within 30 days."})
})

export const recoverUserAccount=catchAsync(async(req:Request,res:Response)=>{
    const user:IUser = (req as any).user;
    if(!user.isDeleted){
        return res.status(httpStatus.BAD_REQUEST).json({message:"Account is already deleted"})
    }
    const recoveryWindowDays = 30;
    const now = new Date();
    const deletedAt = user.deletedAt ?? now;
    const differenceDays = (now.getTime() - deletedAt.getTime()) / (1000 * 60 * 60 * 24)
    if(differenceDays > recoveryWindowDays){
        return res.status(httpStatus.BAD_REQUEST).json({message:"Recovery window expired"})
    }
    user.isDeleted = false;
    (user.deletedAt as any )= undefined;
    await user.save();
    res.status(httpStatus.OK).json({message:"Account successfully recovered",user})
})