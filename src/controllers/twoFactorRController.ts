import catchAsync from "../utils/catchAsync.ts";
import type{ Request,Response } from "express";
import * as userService from "../service/user.services.ts"
import  httpStatus from "http-status";
import * as tokenService from "../service/token.services.ts"
import { generateTwoFactorSecret, verifyTwoFactorToken } from "../utils/twoFactorSecret.ts";

export const generateSecret = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    const userId = (req.user as any)._id;
    const user = await userService.getUserById(userId);
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    if (user.twoFactorEnabled)
        return res.status(httpStatus.BAD_REQUEST).json({ message: "2FA is already enabled" });

    const { secret, qrCodeDataUrl } = await generateTwoFactorSecret(user.email);
    await userService.updateUserById(userId, { twoFactorTempSecret: secret });
    res.json({ qrCodeDataUrl });
});

export const verifyToken = catchAsync(async(req:Request,res:Response)=>{
    const {token} = req.body;
    const userId = (req.user as any)._id;
    const user = await userService.getUserById(userId);
    if(!user?.twoFactorTempSecret) return res.status(httpStatus.BAD_REQUEST).json({message:"No 2FA setup in progress"})
     const isValid = verifyTwoFactorToken(token,user.twoFactorTempSecret)
    if(!isValid) return res.status(httpStatus.BAD_REQUEST).json({message:"Invalid token"})
        await userService.updateUserById(userId,{
            twoFactorSecret:user.twoFactorTempSecret,
            twoFactorTempSecret:null,
            twoFactorEnabled:true
        })   
       res.status(httpStatus.OK).json({message:"2FA enabled"}) 
})

export const validateToken = catchAsync(async(req:Request,res:Response)=>{
    const {token} = req.body;
    const userId = (req as any).user._id;
    const user = await userService.getUserById(userId)
    if(!user?.twoFactorEnabled || !user.twoFactorSecret){
        return res.status(httpStatus.BAD_REQUEST).json({message:"2FA not enabled"})
    }
    const isValid = verifyTwoFactorToken(token,user.twoFactorSecret)
    if(!isValid) return res.status(httpStatus.BAD_REQUEST).json({message:"Invalid token"})
     user.twoFactorEnabled = true;
    const tokens = await tokenService.generateAuthTokens(userId)
    res.json({message:"2FA validation successful"})
})