import catchAsync from "../utils/catchAsync.ts";
import httpStatus from "http-status";
import type{Request,Response} from "express"
import * as userService from "../service/user.services.ts";
import {formatProfile} from "../utils/profileFormatter.ts"
import CustomError from "../utils/customError.ts";


export const getProfile=catchAsync(async(req:Request,res:Response)=>{
    const {username} = req.params;
    const viewerId = (req as any).user?._id;
    const user = await userService.findUserByUsername(username as string);
    if(!user) return res.status(httpStatus.NOT_FOUND).json({message:"User not found"})
    return res.status(httpStatus.OK).json(formatProfile(user,viewerId));    
})

export const updateProfile = catchAsync(async(req:Request,res:Response)=>{
    const userId = (req as any).user._id;
    const allowedFields = [
        "name.first","name.middle","name.last","username","bio","birthday",
    ]
    const filteredUpdates = Object.fromEntries(
        Object.entries(req.body).filter(([key])=>allowedFields.includes(key))
    )

    const user = await userService.updateUserById(userId,filteredUpdates)
    return res.status(httpStatus.OK).json(formatProfile(user,userId))
})

export const changePassword = catchAsync(async(req:Request,res:Response)=>{
    const {userId} = (req as any).user?._id;
    const {newPassword,password} = req.body;
    const user = await userService.getUserById(userId);
    if(!user) return res.status(httpStatus.NOT_FOUND).json({message:"User not found"})
    if(!await user.isPasswordMatch(password)){
        throw new CustomError(httpStatus.UNAUTHORIZED,"Unauthorized");
    }
    user.password = newPassword;
    await user.save()
    return res.status(httpStatus.OK).json({message:"Password updated successfully"})
})