import { PaymentStore } from "../models/PaymentStore.js";
import { NotificationService } from "../services/notificationService.js";
import { OrderServiceClient } from "../services/orderServiceClient.js";

export const createPayment = async (req, res) => {
  try {
    const { orderId, userId, method } = req.body;

    if (!orderId || !userId || !method) {
      return res
        .status(400)
        .json({ message: "Thiếu orderId, userId hoặc method" });
    }

    const validMethods = ["COD", "BANKING"];
    if (!validMethods.includes(method.toUpperCase())) {
      return res.status(400).json({
        message: `Phương thức không hợp lệ. Chọn: ${validMethods.join(" hoặc ")}`,
      });
    }

    const existing = PaymentStore.findByOrderId(orderId);
    if (existing) {
      return res.status(409).json({
        message: `Đơn hàng #${orderId} đã được thanh toán rồi`,
        payment: existing,
      });
    }

    let order;
    try {
      order = await OrderServiceClient.getOrder(orderId);
    } catch (err) {
      console.warn("⚠️  Không lấy được order từ Order Service:", err.message);
      order = { _id: orderId, total: 0, userId };
    }

    const payment = PaymentStore.create({
      orderId,
      userId,
      method: method.toUpperCase(),
      amount: order.total || 0,
    });

    try {
      await OrderServiceClient.updateOrderStatus(orderId, "PAID");
      console.log(`✅ Đã cập nhật order #${orderId} → PAID`);
    } catch (err) {
      console.warn("⚠️  Không thể cập nhật Order Service:", err.message);
      // Vẫn tiếp tục, không fail payment
    }

    const userName = `User ${userId}`;
    NotificationService.sendOrderSuccess({
      userName,
      orderId,
      amount: payment.amount,
      method: payment.method,
    });
    return res.status(201).json({
      message: "Thanh toán thành công",
      payment,
    });
  } catch (error) {
    console.error("❌ Payment error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = PaymentStore.findAll();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = NotificationService.getAll();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
