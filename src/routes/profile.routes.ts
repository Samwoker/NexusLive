import express from "express";
import * as profileController from "../controllers/profile.controllers.ts"
import authenticate from "../middlewares/auth.ts";

const router = express.Router();

router.get("/:username",authenticate,profileController.getProfile)
router.patch("/update-profile",authenticate,profileController.updateProfile)
router.patch("/change-password",authenticate,profileController.changePassword)
router.delete("/delete-account",authenticate,profileController.deleteAccount)


export default router;