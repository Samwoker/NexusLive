import express from "express";
import * as profileController from "../controllers/profile.controllers.ts"
import authenticate from "../middlewares/auth.ts";
import {upload} from "../config/multer.ts"

const router = express.Router();

router.get("/:username",authenticate,profileController.getProfile)
router.patch("/update-profile",authenticate,profileController.updateProfile)
router.patch("/change-password",authenticate,profileController.changePassword)
router.delete("/delete-account",authenticate,profileController.deleteAccount)
router.post("/restore-account",authenticate,profileController.recoverAccount)
router.post("upload-avatar",authenticate,upload.single("image"),profileController.uploadAvatar)
router.post("/upload-cover",authenticate,upload.single("image"),profileController.uploadCoverPhoto)

export default router;