const notificationLog = [];

export const NotificationService = {
  sendOrderSuccess({ userName, orderId, amount, method }) {
    const message = `🎉 ${userName} đã đặt đơn #${orderId} thành công | Tổng: ${amount.toLocaleString("vi-VN")}đ | Thanh toán: ${method}`;

    console.log("\n========================================");
    console.log("📣 [NOTIFICATION]", new Date().toLocaleString("vi-VN"));
    console.log(message);
    console.log("========================================\n");

    const notification = {
      id: notificationLog.length + 1,
      message,
      orderId,
      userName,
      amount,
      method,
      sentAt: new Date().toISOString(),
    };
    notificationLog.push(notification);
    return notification;
  },

  getAll() {
    return [...notificationLog].reverse();
  },
};
