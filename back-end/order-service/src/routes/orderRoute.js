import express from "express";
import { createOrder, getOrderById, getOrders, updateOrderStatus } from "../controllers/temp.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);

export default router;