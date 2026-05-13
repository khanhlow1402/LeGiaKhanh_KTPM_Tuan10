import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
import { createOrderApi, createPaymentApi } from "../api/food.api.js";
import "../styles/Main.css";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [method, setMethod] = useState("COD"); // "COD" | "BANKING"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lấy userId từ token (hoặc hardcode nếu chưa có JWT decode)
  const getUserId = () => {
    // Nếu User Service trả về userId trong response login thì lưu vào localStorage
    return localStorage.getItem("userId") || "user_default";
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      // Lấy orderId đã tạo từ Cart
      const orderId = localStorage.getItem("pendingOrderId");
      const total = localStorage.getItem("pendingOrderTotal");

      if (!orderId) {
        navigate("/cart");
        return;
      }

      await createPaymentApi({
        orderId,
        userId: localStorage.getItem("userId") || "user_default",
        method,
      });

      // Dọn dẹp sau khi thanh toán xong
      localStorage.removeItem("pendingOrderId");
      localStorage.removeItem("pendingOrderTotal");
      clearCart();

      showNotification(
        "🎉 Đặt hàng thành công! Cảm ơn bạn đã tin tưởng.",
        "success",
      );
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message || "Thanh toán thất bại. Vui lòng thử lại!",
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div
      className="container"
      style={{ maxWidth: "600px", padding: "40px 20px" }}
    >
      <h1 style={{ marginBottom: "30px" }}>Xác nhận đơn hàng</h1>

      {/* Danh sách món */}
      <div
        style={{
          background: "#f9f9f9",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        {cart.map((item) => (
          <div
            key={item._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span style={{ fontWeight: "bold" }}>
              {(item.price * item.quantity).toLocaleString()}đ
            </span>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "16px",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          <span>Tổng cộng</span>
          <span style={{ color: "var(--primary)" }}>
            {cartTotal.toLocaleString()}đ
          </span>
        </div>
      </div>

      {/* Chọn phương thức thanh toán */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "12px" }}>Phương thức thanh toán</h3>
        <div style={{ display: "flex", gap: "16px" }}>
          {["COD", "BANKING"].map((m) => (
            <label
              key={m}
              style={{
                flex: 1,
                padding: "16px",
                border: `2px solid ${method === m ? "var(--primary)" : "#ddd"}`,
                borderRadius: "10px",
                cursor: "pointer",
                textAlign: "center",
                background: method === m ? "#fff8f0" : "white",
                transition: "all 0.2s",
              }}
            >
              <input
                type="radio"
                name="method"
                value={m}
                checked={method === m}
                onChange={() => setMethod(m)}
                style={{ display: "none" }}
              />
              <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>
                {m === "COD" ? "💵" : "🏦"}
              </div>
              <div style={{ fontWeight: "bold" }}>
                {m === "COD" ? "Tiền mặt (COD)" : "Chuyển khoản"}
              </div>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "#ffe0e0",
            color: "red",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="add-btn"
        style={{ width: "100%", padding: "16px", fontSize: "1.1rem" }}
      >
        {loading
          ? "Đang xử lý..."
          : `Đặt hàng • ${cartTotal.toLocaleString()}đ`}
      </button>
    </div>
  );
};

export default Checkout;
