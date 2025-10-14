import mongoose  from "mongoose";

export interface IUser extends mongoose.Document{
    name:string,
    email:string,
    password:string,
    avatar?:string,
    bio?:string,
    friends?:mongoose.Types.ObjectId[],
    posts?:mongoose.Types.ObjectId[],
    isVerified:boolean,
    createdAt:Date,
    updatedAt:Date
}

const userSchema:mongoose.Schema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minLength:3,
        maxLength:50
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        miLength:8,
        trim:true
    },
    avatar:{
        type:String,
    },
    bio:{
        type:String
    },
    friends:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    posts:[{type:mongoose.Schema.Types.ObjectId,ref:"Post"}],
    isVerified:{
       type:Boolean,default:false
    }
},{
    timestamps:true
})

export default mongoose.model<IUser>("User",userSchema)