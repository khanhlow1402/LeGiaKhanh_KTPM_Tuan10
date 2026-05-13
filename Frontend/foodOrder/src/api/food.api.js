import api, {
  USER_SERVICE_URL,
  FOOD_SERVICE_URL,
  PAYMENT_SERVICE_URL,
  ORDER_SERVICE_URL,
} from "./api";

// Auth API
export const loginApi = (data) => api.post(`${USER_SERVICE_URL}/login`, data);
export const registerApi = (data) =>
  api.post(`${USER_SERVICE_URL}/register`, data);

// Food API
export const getFoodsApi = () => api.get(`${FOOD_SERVICE_URL}/foods`);
export const getFoodByIdApi = (id) =>
  api.get(`${FOOD_SERVICE_URL}/foods/${id}`);

export const createOrderApi = (data) =>
  api.post(`${ORDER_SERVICE_URL}/orders`, data);
export const getOrdersApi = () => api.get(`${ORDER_SERVICE_URL}/orders`);

export const createPaymentApi = (data) =>
  api.post(`${PAYMENT_SERVICE_URL}/payments`, data);
export const getPaymentsApi = () => api.get(`${PAYMENT_SERVICE_URL}/payments`);
