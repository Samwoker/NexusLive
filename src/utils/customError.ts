class CustomError extends Error{
    public readonly statusCode:number;
    public readonly isOperational:boolean;
    constructor(statusCode:number , message:string , isOperational=true,stack=""){
        super(message);
        Object.setPrototypeOf(this,new.target.prototype)
        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
        this.statusCode = statusCode;
        this.isOperational = isOperational;
    }
}

export default CustomError;