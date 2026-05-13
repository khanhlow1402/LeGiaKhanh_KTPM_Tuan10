import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrderApi } from "../api/food.api";
import "../styles/Main.css";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } =
    useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const orderPayload = {
        userId: localStorage.getItem("userId") || "user_default",
        items: cart.map((item) => ({
          foodId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const res = await createOrderApi(orderPayload);
      console.log("Order created:", res.data);

      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error(err);
      setError("Không thể đặt hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🛒</div>
        <h2
          style={{ color: "#1a1a2e", fontWeight: "700", marginBottom: "10px" }}
        >
          Giỏ hàng của bạn đang trống
        </h2>
        <p style={{ color: "#8892a4", margin: "0 0 28px" }}>
          Hãy bắt đầu thêm những món ăn thật ngon nhé!
        </p>
        <button
          onClick={() => navigate("/home")}
          className="add-btn"
          style={{ padding: "12px 32px", borderRadius: "10px" }}
        >
          Đi tới Thực đơn
        </button>
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{ maxWidth: "800px", padding: "40px 20px" }}
    >
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            color: "#1a1a2e",
            fontWeight: "800",
            fontSize: "1.8rem",
            margin: 0,
          }}
        >
          Giỏ Hàng Của Bạn
        </h1>
        <p style={{ color: "#8892a4", marginTop: "6px", fontSize: "0.9rem" }}>
          {cart.length} món · {cartTotal.toLocaleString()}đ
        </p>
      </div>

      {/* Danh sách món */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        {cart.map((item) => (
          <div
            key={item._id}
            style={{
              background: "white",
              borderRadius: "14px",
              padding: "16px 20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              border: "1px solid #f0f0f5",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <img
              src={item.image || "https://via.placeholder.com/80"}
              alt={item.name}
              style={{
                borderRadius: "10px",
                width: "70px",
                height: "70px",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />

            {/* Tên + giá đơn vị */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3
                style={{
                  margin: 0,
                  color: "#1a1a2e",
                  fontWeight: "600",
                  fontSize: "1rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.name}
              </h3>
              <p
                style={{
                  color: "#8892a4",
                  fontSize: "0.82rem",
                  margin: "4px 0 0",
                }}
              >
                {item.price?.toLocaleString()}đ / phần
              </p>
            </div>

            {/* Số lượng */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  border: "1.5px solid #e0e0ea",
                  background: "white",
                  color: "#4a4a6a",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                −
              </button>
              <span
                style={{
                  minWidth: "20px",
                  textAlign: "center",
                  fontWeight: "700",
                  color: "#1a1a2e",
                }}
              >
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  border: "1.5px solid #e0e0ea",
                  background: "white",
                  color: "#4a4a6a",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +
              </button>
            </div>

            {/* Thành tiền */}
            <div
              style={{
                minWidth: "90px",
                textAlign: "right",
                fontWeight: "700",
                color: "var(--primary, #f97316)",
                fontSize: "0.95rem",
              }}
            >
              {(item.price * item.quantity).toLocaleString()}đ
            </div>

            {/* Xoá */}
            <button
              onClick={() => removeFromCart(item._id)}
              style={{
                background: "#fff5f5",
                border: "none",
                borderRadius: "8px",
                width: "34px",
                height: "34px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                flexShrink: 0,
              }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Lỗi */}
      {error && (
        <div
          style={{
            background: "#fff5f5",
            color: "#c53030",
            padding: "12px 16px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "0.9rem",
            border: "1px solid #fed7d7",
          }}
        >
          {error}
        </div>
      )}

      {/* Tổng & nút đặt hàng */}
      <div
        style={{
          background: "white",
          borderRadius: "14px",
          padding: "20px 24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          border: "1px solid #f0f0f5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ margin: 0, color: "#8892a4", fontSize: "0.85rem" }}>
            Tổng cộng
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "1.6rem",
              fontWeight: "800",
              color: "#1a1a2e",
            }}
          >
            {cartTotal.toLocaleString()}
            <span
              style={{ fontSize: "1rem", color: "#8892a4", fontWeight: "500" }}
            >
              đ
            </span>
          </p>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="add-btn"
          style={{
            padding: "14px 36px",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: "700",
          }}
        >
          {loading ? "Đang đặt hàng..." : "🛒 Đặt hàng"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
