
declare namespace NodeJs{
    interface ProcessEnv{
        PORT?:number;
        MONGO_URI?:string;
        NODE_ENV?:string;
    }
}