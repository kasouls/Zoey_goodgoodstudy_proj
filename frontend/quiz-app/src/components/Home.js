import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTypingEffect from "../hooks/useTypingEffect";
import UserMenu from "./UserMenu"; 
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  // ✅ 处理未登录状态，重定向到 /login
  useEffect(() => {
    if (!localStorage.getItem("isAuthenticated")) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // ✅ 统一动画
  const { displayedText: mainTitle, showCursor: showMainCursor } = useTypingEffect({
    text: "ChoMi",
    speed: 250,
    startTyping: true
  });

  const { displayedText: subTitle, showCursor: showSubCursor } = useTypingEffect({
    text: "是时候去收割一波证书了！",
    speed: 120,
    deleteSpeed: 40,
    startTyping: true
  });

  return (
    <div className="home-container">
      {/* ✅ 左上角用户信息菜单 */}
      <UserMenu />

      {/* ✅ 修复标题颜色 */}
      <h1 className="typing big-title">
        <span className="certi-text">{mainTitle.slice(0, 3)}</span>
        <span className="master-text">{mainTitle.slice(3)}</span>
        {showMainCursor && <span className="cursor-blink">|</span>}
      </h1>
      <h2 className="typing subtitle subtitle-up">
        {subTitle}
        {showSubCursor && <span className="cursor-blink">|</span>}
      </h2>

      {/* ✅ 选项菜单 */}
      <div className="menu wider-menu">
        <div className="menu-option hacker-button" onClick={() => navigate("/custom-mode")}> 🎯 自定义模式 </div>
        <div className="menu-option hacker-button disabled"> 🏆 拟真模式(施工中) </div>
        <div className="menu-option hacker-button" onClick={() => navigate("/challenge-mode")}> 📖 复习模式 </div>
        <div className="menu-option hacker-button" onClick={() => navigate("/wrong-questions")}> ❌ 错题本 </div>
      </div>

      {/* ✅ 底部信息 */}
      <div className="footer fixed-footer">
        v1.35 Created by <span className="code-text">Yang</span> <br />
        The final interpretation of this activity belongs to <span className="zoey-text">Zoey</span>
      </div>
    </div>
  );
};

export default Home;
