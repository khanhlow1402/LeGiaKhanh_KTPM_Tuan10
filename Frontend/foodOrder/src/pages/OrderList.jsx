import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrdersApi, createPaymentApi } from "../api/food.api";
import { useNotification } from "../context/NotificationContext";
import "../styles/Main.css";

// ── Badge trạng thái ──────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    PENDING: {
      label: "Chờ thanh toán",
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fef3c7",
    },
    PAID: {
      label: "Đã thanh toán",
      color: "#10b981",
      bg: "#f0fdf4",
      border: "#dcfce7",
    },
    DELIVERING: {
      label: "Đang giao",
      color: "#3b82f6",
      bg: "#eff6ff",
      border: "#dbeafe",
    },
    DONE: {
      label: "Hoàn thành",
      color: "#6366f1",
      bg: "#f5f3ff",
      border: "#e0e7ff",
    },
    CANCELLED: {
      label: "Đã huỷ",
      color: "#ef4444",
      bg: "#fef2f2",
      border: "#fee2e2",
    },
  };
  const s = map[status] || {
    label: status,
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#f3f4f6",
  };
  return (
    <span
      style={{
        padding: "8px 16px",
        borderRadius: "12px",
        fontSize: "0.8rem",
        fontWeight: "700",
        color: s.color,
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: s.color,
        }}
      ></span>
      {s.label}
    </span>
  );
};

// ── Modal thanh toán ─────────────────────────────────────────
const PaymentModal = ({ order, onClose, onSuccess }) => {
  const [method, setMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      await createPaymentApi({
        orderId: order._id,
        userId: localStorage.getItem("userId") || "user_default",
        method,
      });
      onSuccess(order._id);
    } catch (err) {
      setError(err.response?.data?.message || "Thanh toán thất bại. Thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "28px",
          padding: "40px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
        }}
      >
        <h2
          style={{
            margin: "0 0 10px",
            color: "#1a1a2e",
            fontWeight: "800",
            fontSize: "1.6rem",
          }}
        >
          Xác nhận thanh toán
        </h2>
        <p
          style={{
            color: "#8892a4",
            marginBottom: "30px",
            fontSize: "0.95rem",
          }}
        >
          Mã đơn hàng:{" "}
          <span style={{ color: "#1a1a2e", fontWeight: "700" }}>
            #{order._id?.slice(-8).toUpperCase()}
          </span>
        </p>

        <div
          style={{
            background: "#f8fafc",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "30px",
            textAlign: "center",
            border: "1px solid #f1f5f9",
          }}
        >
          <p
            style={{
              margin: "0 0 6px",
              color: "#64748b",
              fontSize: "0.9rem",
              fontWeight: "600",
              letterSpacing: "0.05em",
            }}
          >
            TỔNG SỐ TIỀN
          </p>
          <h3
            style={{
              margin: 0,
              color: "#f97316",
              fontSize: "2.2rem",
              fontWeight: "900",
            }}
          >
            {order.total?.toLocaleString()}đ
          </h3>
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
          {[
            { v: "COD", i: "💵", l: "Tiền mặt" },
            { v: "BANKING", i: "🏦", l: "Banking" },
          ].map((m) => (
            <div
              key={m.v}
              onClick={() => setMethod(m.v)}
              style={{
                flex: 1,
                padding: "20px",
                borderRadius: "20px",
                cursor: "pointer",
                textAlign: "center",
                border: `2px solid ${method === m.v ? "#f97316" : "#f1f5f9"}`,
                background: method === m.v ? "#fff7ed" : "white",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>
                {m.i}
              </div>
              <div
                style={{
                  fontWeight: "800",
                  fontSize: "0.9rem",
                  color: "#1a1a2e",
                }}
              >
                {m.l}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "16px",
              borderRadius: "14px",
              border: "none",
              background: "#f1f5f9",
              color: "#64748b",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Đóng
          </button>
          <button
            onClick={handlePay}
            disabled={loading}
            className="add-btn"
            style={{
              flex: 2,
              padding: "16px",
              borderRadius: "14px",
              fontSize: "1rem",
              fontWeight: "700",
            }}
          >
            {loading ? "Đang xử lý..." : "Xác nhận ngay"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────
const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId") || "user_default";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrdersApi();
      const myOrders = res.data.filter((o) => o.userId === currentUserId);
      setOrders(
        myOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: "PAID" } : o)),
    );
    setSelectedOrder(null);
    showNotification("🎉 Thanh toán thành công!", "success");
  };

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "120px",
          color: "#8892a4",
          fontSize: "1.1rem",
        }}
      >
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div
      className="container"
      style={{ maxWidth: "900px", padding: "60px 24px" }}
    >
      {/* Header rộng rãi */}
      <div
        style={{
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              color: "#1a1a2e",
              fontWeight: "900",
              fontSize: "2.2rem",
              margin: 0,
            }}
          >
            Lịch sử đơn hàng
          </h1>
          <p style={{ color: "#8892a4", marginTop: "8px", fontSize: "1rem" }}>
            Quản lý và theo dõi quá trình giao hàng của bạn
          </p>
        </div>
        <button
          onClick={() => navigate("/home")}
          style={{
            background: "white",
            border: "2px solid #f1f5f9",
            padding: "12px 24px",
            borderRadius: "15px",
            color: "#475569",
            fontWeight: "750",
            cursor: "pointer",
            fontSize: "0.95rem",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          }}
        >
          + Đặt thêm món mới
        </button>
      </div>

      {orders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "100px 40px",
            background: "white",
            borderRadius: "30px",
            border: "1px solid #f1f5f9",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🍱</div>
          <h3
            style={{
              color: "#1a1a2e",
              fontSize: "1.5rem",
              marginBottom: "12px",
            }}
          >
            Bạn chưa đặt món nào
          </h3>
          <p style={{ color: "#8892a4", marginBottom: "30px" }}>
            Những món ăn ngon lành đang chờ bạn khám phá đấy!
          </p>
          <button
            onClick={() => navigate("/home")}
            className="add-btn"
            style={{ padding: "14px 32px", fontSize: "1rem" }}
          >
            Khám phá thực đơn ngay
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                background: "white",
                borderRadius: "24px",
                padding: "30px",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.04)",
                border: "1px solid #f1f5f9",
                transition: "transform 0.2s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <span
                    style={{
                      color: "#1a1a2e",
                      fontWeight: "900",
                      fontSize: "1.1rem",
                      letterSpacing: "0.02em",
                    }}
                  >
                    ĐƠN HÀNG #{order._id?.slice(-6).toUpperCase()}
                  </span>
                  <div
                    style={{
                      color: "#94a3b8",
                      fontSize: "0.85rem",
                      marginTop: "4px",
                      fontWeight: "500",
                    }}
                  >
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "18px",
                  padding: "20px 25px",
                  marginBottom: "20px",
                }}
              >
                {order.items?.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      fontSize: "1rem",
                      borderBottom:
                        i !== order.items.length - 1
                          ? "1px dashed #e2e8f0"
                          : "none",
                    }}
                  >
                    <span style={{ color: "#475569", fontWeight: "500" }}>
                      {item.name}{" "}
                      <span
                        style={{
                          color: "#94a3b8",
                          marginLeft: "8px",
                          fontSize: "0.9rem",
                        }}
                      >
                        x{item.quantity}
                      </span>
                    </span>
                    <span style={{ fontWeight: "800", color: "#1e293b" }}>
                      {(item.price * item.quantity).toLocaleString()}đ
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "20px",
                  borderTop: "2px solid #f8fafc",
                }}
              >
                <div>
                  <span
                    style={{
                      color: "#64748b",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                    }}
                  >
                    Thành tiền:{" "}
                  </span>
                  <span
                    style={{
                      color: "#f97316",
                      fontWeight: "900",
                      fontSize: "1.5rem",
                      marginLeft: "5px",
                    }}
                  >
                    {order.total?.toLocaleString()}đ
                  </span>
                </div>
                {order.status === "PENDING" && (
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="add-btn"
                    style={{
                      padding: "12px 30px",
                      borderRadius: "12px",
                      fontSize: "0.95rem",
                      fontWeight: "800",
                      boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.3)",
                    }}
                  >
                    💳 Thanh toán ngay
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <PaymentModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default OrderList;
