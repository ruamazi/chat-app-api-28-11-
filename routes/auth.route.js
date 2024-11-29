import { Router } from "express";
import {
 checkAuth,
 signin,
 signout,
 signup,
 validateSignUp,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = Router();

router.post("/signup", validateSignUp, signup);
router.post("/signin", signin);
router.get("/signout", signout);

router.get("/check", protectRoute, checkAuth);

export default router;
