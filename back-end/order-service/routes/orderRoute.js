import express from "express";
const router = express.Router();
import { sepayCallback } from "../controllers/orderController.js";

router.post("/payment", sepayCallback);

export default router;
