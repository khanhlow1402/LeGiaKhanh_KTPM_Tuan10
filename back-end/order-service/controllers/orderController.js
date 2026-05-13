import Order from '../models/Order.js';

export const sepayCallback = async (req, res) => {
  try {
    const apiKey = req.headers.authorization?.replace('Apikey ', '');
    const expectedApiKey = process.env.SEPAY_API_KEY;

    if (!apiKey || apiKey !== expectedApiKey) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid API key',
      });
    }

    const { id, transferType, transferAmount, content, code } = req.body;

    if (transferType !== 'in') {
      return res.status(200).json({ success: true, message: 'Not a credit transaction' });
    }

    let orderId = code || null;
    if (!orderId && content) {
      const match = content.match(/[0-9a-fA-F]{24}/);
      if (match) orderId = match[0];
    }

    if (!orderId) {
      console.log('Không xác định được đơn hàng:', content);
      return res.status(200).json({ success: true, message: 'Order ID not found in content' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      console.log('Đơn hàng không tồn tại:', orderId);
      return res.status(200).json({ success: true, message: 'Order not found' });
    }

    if (Number(transferAmount) < order.total) {
      console.log(`Thanh toán thiếu: Nhận ${transferAmount}, Cần ${order.total}`);
      return res.status(200).json({ success: true, message: 'Amount insufficient' });
    }

    order.status = "PAID"; 
    await order.save();

    console.log(`Đơn hàng ${orderId} đã thanh toán thành công!`);

    return res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      data: { orderId: order._id, status: order.status }
    });

  } catch (error) {
    console.error('Lỗi SePay Callback:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};