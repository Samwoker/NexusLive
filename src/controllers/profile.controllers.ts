import catchAsync from "../utils/catchAsync.ts";
import httpStatus from "http-status";
import type{Request,Response} from "express"
import * as userService from "../service/user.services.ts";
import {formatProfile} from "../utils/profileFormatter.ts"
export const getProfile=catchAsync(async(req:Request,res:Response)=>{
    const {username} = req.params;
    const viewerId = (req as any).user?._id;
    const user = await userService.findUserByUsername(username as string);
    if(!user) return res.status(httpStatus.NOT_FOUND).json({message:"User not found"})
    return res.status(httpStatus.OK).json(formatProfile(user,viewerId));    
})