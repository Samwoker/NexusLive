import express from "express";
import * as profileController from "../controllers/profile.controllers.ts"
import authenticate from "../middlewares/auth";

const router = express.Router();

router.get("/",authenticate,profileController.getProfile)


export default router;