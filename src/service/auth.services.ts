import type mongoose from "mongoose"
import { tokenTypes } from "../config/tokens.ts"
import CustomError from "../utils/customError.ts"
import { generateAuthTokens, verifyToken } from "./token.services.ts"
import * as userService from "./user.services.ts"
import httpStatus from "http-status"

export const refreshAuthToken = async(refreshToken:string)=>{
    try {
        
        const tokenDoc = await verifyToken(refreshToken,tokenTypes.REFRESH)
        const user = await userService.getUserById(tokenDoc.user)
        if(!user) {
            throw new CustomError(httpStatus.NOT_FOUND,"User not found")
        }
        await tokenDoc.deleteOne()
        return await generateAuthTokens(user._id as mongoose.Schema.Types.ObjectId)

    } catch (error) {
        if (error instanceof CustomError){
            throw error
        }
        throw new CustomError(httpStatus.UNAUTHORIZED,"Please authenticate")
    }
}