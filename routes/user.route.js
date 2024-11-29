import { Router } from "express";
import {
 getUsers,
 resetUsers,
 updatePic,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = Router();

router.get("/users", protectRoute, getUsers);
router.put("/update-pic", protectRoute, updatePic);
router.get("/reset", resetUsers);

export default router;
