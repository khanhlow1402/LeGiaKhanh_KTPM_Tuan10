import { v4 as uuidv4 } from "uuid";

const payments = [];

export const PaymentStore = {
  create({ orderId, userId, method, amount }) {
    const payment = {
      id: uuidv4(),
      orderId,
      userId,
      method, // "COD" | "BANKING"
      amount,
      status: "SUCCESS", // Giả lập luôn thành công
      createdAt: new Date().toISOString(),
    };
    payments.push(payment);
    return payment;
  },

  findAll() {
    return [...payments].reverse();
  },

  findByOrderId(orderId) {
    return payments.find((p) => p.orderId === orderId) || null;
  },
};
