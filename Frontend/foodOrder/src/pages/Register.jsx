import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import "./Auth.css";
import { registerApi } from "../api/food.api";

const Register = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu không khớp. Vui lòng nhập lại.");
      return;
    }

    try {
      setLoading(true);

      // Using the centralized API service
      await registerApi({
        username: form.username,
        password: form.password,
      });

      showNotification("Đăng ký thành công! Hãy đăng nhập để bắt đầu.", "success");
      navigate("/");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Gia nhập gia đình <br /> Food KH3T</h2>
          <p>Tạo tài khoản để bắt đầu đặt món ngay</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Chọn tên đăng nhập của bạn"
              value={form.username}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Đang tạo tài khoản..." : "Đăng Ký"}
          </button>
        </form>

        <div className="auth-footer">
          Đã có tài khoản?{" "}
          <Link to="/">Đăng nhập tại đây</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
