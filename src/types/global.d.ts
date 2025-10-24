

export interface AppConfig{
       port :number;
       dbConnection:string;
       nodeEnv:string;
       jwt:{
        jwtSecret:string;
        jwtAccessExpirationMinutes:number;
        jwtRefreshExpirationDays:number;
       }
    }
export interface PayloadType{
    
    sub:Types.ObjectId;
    type:string;
}