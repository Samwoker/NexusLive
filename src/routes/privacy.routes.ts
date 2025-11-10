import express from "express";
import { getUser } from "../controllers/getUser.ts";
import * as privacyController from "../controllers/privacy.controllers.ts"

const router = express.Router();

router.get("/:userId",getUser,privacyController.getUserPrivacy)


export default router;