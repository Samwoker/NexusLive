

export interface AppConfig{
       port :number;
       dbConnection:string;
       nodeEnv:string;
       jwt:{
        jwtSecret:string;
       }
    }
export interface PayloadType{
    id:Types.ObjectId;
    role:string[]
}