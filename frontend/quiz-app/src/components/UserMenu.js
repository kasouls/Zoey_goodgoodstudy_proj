import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserMenu.css";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "未知用户"; // ✅ 现在会正确显示用户邮箱

  // ✅ 处理登出
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="user-menu">
      <div className="user-info" onClick={() => setIsOpen(!isOpen)}>
        📧 {userEmail}
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-item" onClick={handleLogout}>🚪 退出登录</div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
