import { Router } from "express";
import {
 signin,
 signout,
 signup,
 validateSignUp,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = Router();

router.post("/signup", validateSignUp, signup);
router.post("/signin", signin);
router.post("/signout", signout);

router.get("/check");

export default router;
