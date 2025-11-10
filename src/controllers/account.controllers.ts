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