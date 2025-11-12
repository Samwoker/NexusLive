import express from "express";
import * as profileController from "../controllers/profile.controllers.ts"
import authenticate from "../middlewares/auth.ts";

const router = express.Router();

router.get("/:username",authenticate,profileController.getProfile)
router.patch("/update-profile",authenticate,profileController.updateProfile)


export default router;