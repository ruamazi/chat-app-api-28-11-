import { Router } from "express";
import {
 getCurrentUser,
 resetUsers,
 updatePic,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = Router();

router.get("/", protectRoute, getCurrentUser);
router.post("/update-pic", protectRoute, updatePic);
router.get("/reset", resetUsers);

export default router;
