import mongoose, { Document, Types,Model } from 'mongoose';
import validator from  'validator';
import bcrypt from 'bcrypt'
import credentialSchema from "./credential.model.ts";



const { Schema } = mongoose;

export interface IUser extends Document {
  // Auth & identity
  _id:mongoose.Schema.Types.ObjectId;
  email: string;
  emailVerified: boolean;
  phone?: string;
  phoneVerified: boolean;
  password: string;
  confirmPassword?:string

  isPasswordMatch(password:string):Promise<boolean>

  // Basic profile
  name: {
    first: string;
    middle?: string;
    last: string;
  };
  username: string;
  bio?: string;
  birthday?: Date;
  gender: 'male' | 'female';

  // Media
  avatar?: {
    url?: string;
    provider?: string;
    uploadedAt?: Date;
  };
  coverPhoto?: {
    url?: string;
    provider?: string;
    uploadedAt?: Date;
  };

  // Social / Relations
  friends: Types.ObjectId[];
  friendRequestsSent: Types.ObjectId[];
  friendRequestsReceived: Types.ObjectId[];
  followers: Types.ObjectId[];
  following: Types.ObjectId[];

  // Activity counters
  counts: {
    posts: number;
    friends: number;
    followers: number;
    following: number;
  };

  // Preferences & privacy
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    friendListVisibility: 'public' | 'friends' | 'private';
    searchEngineIndexing: boolean;
  };
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };

  // Security & sessions
  lastLoginAt?: Date;
  lastSeenAt?: Date;
  twoFactorEnabled: boolean;
  twoFactorTempSecret?: string | null;
  twoFactorSecret?:string;

  // Verification & roles
  verified: boolean;
  roles: string[];

  challenge:string;

  // Metadata
  locale: string;
  timezone?: string;
  createdAt: Date;
  updatedAt: Date;

  // Soft delete
  isDeleted: boolean;
  deletedAt?: Date;
}

export interface IUserModel extends Model<IUser>{
  isEmailTaken(email:string):Promise<IUser>,
}

const NameSchema = new Schema({
  first: { type: String, trim: true, required: true },
  middle: { type: String, trim: true },
  last: { type: String, trim: true, required: true },
}, { _id: false });

const PictureSchema = new Schema({
  url: String,
  provider: String, 
  uploadedAt: Date
}, { _id: false });

const PrivacySchema = new Schema({
  profileVisibility: { type: String, enum: ['public','friends','private'], default: 'public' },
  friendListVisibility: { type: String, enum: ['public','friends','private'], default: 'friends' },
  searchEngineIndexing: { type: Boolean, default: true }
}, { _id: false });

const UserSchema = new Schema({
  
  email: { type: String, required: true, unique: true, lowercase: true, index: true ,
    validate:{
        validator:function(value){
            return typeof value === 'string' && validator.isEmail(value)
        },
        message:"Email is invalid"
    }
  },
  emailVerified: { type: Boolean, default: false },
  phone: { type: String, index: true, sparse: true },
  phoneVerified: { type: Boolean, default: false },
  password: { type: String ,required:true,trim:true,validate:{
    validator:function(value){
        return typeof value === 'string' && validator.isStrongPassword(value);
    },
    message:"password is not strong enough"
  }},
  confirmPassword: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          return this.password === value;
        },
        message: "Passwords do not match",
      },
      required:true
    },
  name: { type: NameSchema, required: true },
  username: { type: String, required: true, unique: true, index: true }, 
  bio: { type: String, maxLength: 500 },
  birthday: { type: Date },
  gender: { type: String, enum: ['male','female']},
  avatar: PictureSchema,
  coverPhoto: PictureSchema,
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
  friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  counts: {
    posts: { type: Number, default: 0 },
    friends: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
  },

  privacy: { type: PrivacySchema, default: () => ({}) },
  notifications: {
    push: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  },

  lastLoginAt: Date,
  lastSeenAt: Date,
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorTempSecret: { type: String },
  twoFactorSecret:{type:String},

  verified: { type: Boolean, default: false },
  roles: [{ type: String }], 

  credentials:[credentialSchema],
  challenge:String,

  locale: { type: String, default: 'en' },
  timezone: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
}, {
  timestamps: true,
});

// UserSchema.index({ username: 1 });
// UserSchema.index({ email: 1 });
UserSchema.index({ 'counts.friends': -1 }); 

UserSchema.statics.isEmailTaken = async function(email){
  const user = await this.findOne({email})
  return !!user
}

UserSchema.pre("save",async function(next){
  const user = this;
  if(user.isModified("password")){
    user.password = await bcrypt.hash(user.password,10);
    (user as any).confirmPassword = undefined;
  }
  next()
})


UserSchema.methods.isPasswordMatch = async function(password:string):Promise<boolean>{
  const user = this;
  return await bcrypt.compare(password,user.password)
}

const User = mongoose.model<IUser,IUserModel>("User",UserSchema)
export default User