import express from "express";
import authenticate from "../middlewares/auth.ts";
import * as privacyController from "../controllers/privacy.controllers.ts"

const router = express.Router();

router.get("/:userId",authenticate,privacyController.getUserPrivacy)


export default router;