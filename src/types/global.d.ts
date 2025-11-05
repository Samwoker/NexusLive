

export interface AppConfig{
       port :number;
       dbConnection:string;
       nodeEnv:string;
       jwt:{
        jwtSecret:string;
        jwtAccessExpirationMinutes:number;
        jwtRefreshExpirationDays:number;
       };
       smtp:{
        smtpEmail:string;
        smtpPassword:string;
       }
       baseUrl:url
       googleClientId:string,
       googleClientSecret:string
       googleCallbackUrl:url
       rateLimiter:{
        maxAttemptsByIPUsername:number
       maxAttemptsPerDay:number
       maxAttemptsPerEmail:number
       }
    }
export interface PayloadType{
    
    sub:Types.ObjectId;
    type:string;
}

export interface TwoFactorSecret{
    secret:string;
    otpauthUrl:string;
    qrCodeDataUrl:string;
}