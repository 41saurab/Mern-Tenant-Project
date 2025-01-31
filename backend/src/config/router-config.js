import express from "express";
import authRouter from "../modules/auth/auth-router.js";
import reviewRouter from "../modules/review/landlord-review-router.js";
import roomRouter from "../modules/room/room-router.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/review", reviewRouter);
router.use("/room", roomRouter);

export default router;
