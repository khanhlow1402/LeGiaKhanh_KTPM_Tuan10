import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/home" className="logo">
          Food HKT
        </Link>
        <div className="nav-links">
          <Link to="/home" className="nav-link">
            Thực đơn
          </Link>
          <Link to="/orders" className="nav-link">
            Đơn hàng của tôi
          </Link>
          {token ? (
            <button
              onClick={handleLogout}
              className="nav-link"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Đăng xuất
            </button>
          ) : (
            <Link to="/" className="nav-link">
              Đăng nhập
            </Link>
          )}
          <Link to="/cart" className="cart-icon-btn">
            🛒{" "}
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
