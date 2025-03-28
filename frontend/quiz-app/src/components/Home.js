import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTypingEffect from "../hooks/useTypingEffect";
import UserMenu from "./UserMenu"; 
import ImmersiveTransition from "./ImmersiveTransition";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [isImmersive, setIsImmersive] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [pendingRoute, setPendingRoute] = useState(null); // ⬅️ 记录跳转目的地

  // ✅ 自动跳转未登录用户
  useEffect(() => {
    if (!localStorage.getItem("isAuthenticated")) {
      navigate("/login");
    }
  }, [navigate]);

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

  // ✅ 触发动画 + 设置待跳转路由
  const handleTransitionTo = (path) => {
    setShowContent(false);
    setIsImmersive(true);
    setPendingRoute(path); // ⬅️ 设置跳转路径
  };

  // ✅ 动画完成时跳转
  const handleTransitionFinish = () => {
    setIsImmersive(false);
    if (pendingRoute) {
      navigate(pendingRoute);
      setPendingRoute(null);
    }
  };

  return (
    <>
      {/* ✅ 动画层：一定要放外面，避免被隐藏 */}
      {isImmersive && (
        <ImmersiveTransition onFinish={handleTransitionFinish} />
      )}
  
      {/* ✅ 页面容器 */}
      <div className={`home-container ${showContent ? "fade-in" : "hidden"}`}>
        <UserMenu />
  
        <h1 className="typing big-title">
          <span className="certi-text">{mainTitle.slice(0, 3)}</span>
          <span className="master-text">{mainTitle.slice(3)}</span>
          {showMainCursor && <span className="cursor-blink">|</span>}
        </h1>
        <h2 className="typing subtitle subtitle-up">
          {subTitle}
          {showSubCursor && <span className="cursor-blink">|</span>}
        </h2>
  
        <div className="menu wider-menu">
          <div className="menu-option immersive-button" onClick={() => handleTransitionTo("/custom-mode")}>
            🎯 自定义模式
          </div>
          <div className="menu-option hacker-button disabled">
            🏆 拟真模式(施工中)
          </div>
          <div className="menu-option hacker-button" onClick={() => navigate("/challenge-mode")}>
            📖 复习模式(施工中)
          </div>
          <div className="menu-option hacker-button" onClick={() => navigate("/wrong-questions")}>
            ❌ 错题本
          </div>
          
        </div>
  
        <div className="footer fixed-footer">
          v1.35 Created by <span className="code-text">Yang</span> <br />
          The final interpretation of this activity belongs to <span className="zoey-text">Zoey</span>
        </div>
      </div>
    </>
  );
  
};

export default Home;
