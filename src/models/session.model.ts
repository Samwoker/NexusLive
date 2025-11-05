import mongoose ,{Schema,Document} from "mongoose";

export interface IUserSession extends Document{
    sessionId:string;
    userId:string;
    ipAddress:string;
    device:string;
    createdAt:Date;
    lastUsedAt:Date;
}


const SessionSchema:Schema = new Schema({
    sessionId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    ipAddress:{
        type:String,
        required:true
    },
    device:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    lastUsedAt:{
        type:Date,
        default:Date.now
    }
})

export const Session= mongoose.model<IUserSession>("Session",SessionSchema)