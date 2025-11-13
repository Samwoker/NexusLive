import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.ts";

const storage = new CloudinaryStorage({
    cloudinary,
    params:async(req,file)=>{
        return {
            folder:"uploads",
            allowed_formats:["jpg","png","jpeg","webp"],
            public_id:file.originalname.split(".")[0]
        }
    }
})

export const upload = multer({storage});