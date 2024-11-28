import { Router } from "express";

const router = Router();

router.get("/users");
router.get("/messages/:id");
router.post("/send/:id");

export default router;
