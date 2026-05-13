import express from "express";
import {
  createPayment,
  getPayments,
  getNotifications,
} from "../controllers/paymentController.js";
 
const router = express.Router();
 
// Payment routes
router.post("/payments", createPayment);
router.get("/payments", getPayments);
 
// Notification routes
router.get("/notifications", getNotifications);
 
export default router;