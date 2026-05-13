import React from "react";
import "./Toast.css";

const Toast = ({ message, type = "success", onClose }) => {
  return (
    <div className={`toast-container ${type}`}>
      <div className="toast-content">
        <div className="toast-icon">
          {type === "success" ? "✓" : "!"}
        </div>
        <div className="toast-message">
          <span className="toast-title">
            {type === "success" ? "Thành công!" : "Thông báo"}
          </span>
          <p>{message}</p>
        </div>
        <button className="toast-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
