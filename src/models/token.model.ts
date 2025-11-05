import mongoose  from "mongoose";
import { tokenTypes } from "../config/tokens.ts";

export interface IToken extends mongoose.Document{
    token:string;
    user:mongoose.Schema.Types.ObjectId;
    type:string;
    expires:Date;
    blacklisted:boolean;
}


const tokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true,
        index:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    type:{
        type:String,
        required:true,
        enum:[tokenTypes.ACCESS,tokenTypes.REFRESH],
    },
    expires:{
        type:Date,
        required:true
    },
    blacklisted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const Token = mongoose.model<IToken>("Token",tokenSchema)

export default Token;