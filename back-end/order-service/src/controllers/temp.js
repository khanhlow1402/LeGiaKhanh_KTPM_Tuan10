import Order from "../models/Order.js";
import { foodBreaker, userBreaker } from "../services/circuitBreaker.js";

// POST /orders
export const createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({
        message: "Missing data",
      });
    }

    /*
      =========================
      VALIDATE USER
      =========================
    */

    const user = await userBreaker.fire(userId);

    if (user.error) {
      return res.status(503).json({
        message: user.error,
      });
    }

    /*
      =========================
      GET FOOD INFO
      =========================
    */

    const orderItems = [];

    for (const item of items) {
      const food = await foodBreaker.fire(item.foodId);

      if (food.error) {
        return res.status(503).json({
          message: food.error,
        });
      }

      orderItems.push({
        foodId: food._id,
        name: food.name,
        price: food.price,
        quantity: item.quantity,
      });
    }

    /*
      =========================
      CALCULATE TOTAL
      =========================
    */

    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    /*
      =========================
      CREATE ORDER
      =========================
    */

    const order = await Order.create({
      userId,
      items: orderItems,
      total,
      status: "PENDING",
    });

    res.status(201).json({
      message: "Order created",
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// GET /orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "PENDING",
      "PAID",
      "CANCELLED",
      "DELIVERING",
      "DONE",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status không hợp lệ. Chọn: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }, // trả về document sau khi update
    );

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.json({ message: `Cập nhật status → ${status}`, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
