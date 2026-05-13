import axios from "axios";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });

const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://localhost:8083";

export const OrderServiceClient = {
  async getOrder(orderId) {
    const res = await axios.get(`${ORDER_SERVICE_URL}/orders/${orderId}`);
    return res.data;
  },

  async updateOrderStatus(orderId, status) {
    const res = await axios.patch(
      `${ORDER_SERVICE_URL}/orders/${orderId}/status`,
      {
        status,
      },
    );
    return res.data;
  },
};
