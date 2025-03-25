import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { sendVerificationCode, verifyCode, registerUser, loginUser } from "../services/authService";
import useTypingEffect from "../hooks/useTypingEffect";
import "./Home.css";
import API_BASE_URL from "../config";

const Login = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isTitleFinished, setIsTitleFinished] = useState(false);
  const [startSubtitle, setStartSubtitle] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // ✅ 让验证码输入框获取焦点
  const verificationInputRef = useRef(null);

  useEffect(() => {
    document.addEventListener("touchstart", () => setShowForm(true));
    document.addEventListener("keydown", () => setShowForm(true));
    return () => {
      document.removeEventListener("touchstart", () => setShowForm(true));
      document.removeEventListener("keydown", () => setShowForm(true));
    };
  }, []);

  /** ✅ 处理主标题动画 */
  const { displayedText: mainTitle, showCursor: showMainCursor } = useTypingEffect({
    text: "ChoMi",
    onComplete: () => {
      setIsTitleFinished(true);
      setTimeout(() => setStartSubtitle(true), 1000);
    },
    speed: 250,
    startTyping: true,
  });

  /** ✅ 处理副标题动画 */
  const { displayedText: subTitle, showCursor: showSubCursor } = useTypingEffect({
    text: startSubtitle ? (isRegistering ? "注册你的账号" : "让我们开始你的认证之旅吧！") : "",
    deleting: false,
    speed: 120,
    deleteSpeed: 40,
    startTyping: startSubtitle,
  });

  /** ✅ 发送验证码（带倒计时 & 输入框自动聚焦） */
  const handleSendCode = async () => {
    setError(null);
    if (countdown > 0) return; // 防止短时间多次请求

    try {
      await sendVerificationCode(email);
      setCodeSent(true);
      setCountdown(60); // 设置倒计时 60 秒
      alert("📩 验证码已发送，请检查邮箱！");

      // ✅ 启动倒计时
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimeout(() => verificationInputRef.current?.focus(), 500); // ✅ 让验证码输入框自动获取焦点
    } catch (error) {
      setError(error.message || "验证码发送失败");
    }
  };

  /** ✅ 处理注册 */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("❌ 两次输入的密码不匹配！");
      return;
    }
    if (password.length < 6) {
      setError("🔑 密码必须至少 6 位！");
      return;
    }

    try {
      await verifyCode(email, verificationCode);
      await registerUser(email, password);

      alert("🎉 注册成功！请登录");
      setIsRegistering(false);
      resetForm();
    } catch (error) {
      setError(error.message || "❌ 注册失败，请检查验证码或稍后重试");
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
        navigate("/home"); // ✅ 认证成功后自动跳转
    }
}, []);

  /** ✅ 处理登录 */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
        const response = await fetch(`${API_BASE_URL}/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("🔍 登录 API 返回:", data); // ✅ 确保 API 返回了 user_id

        if (response.ok) {
            alert("🚀 登录成功！");
            localStorage.setItem("isAuthenticated", "true");  // ✅ 存储登录状态
            localStorage.setItem("userEmail", email);  // ✅ 存储用户邮箱
            localStorage.setItem("user_id", data.user_id);  // ✅ 正确存储 user_id
            window.location.href = "/home";  // ✅ 跳转到主页
        } else {
            throw new Error(data.detail || "❌ 登录失败，请检查邮箱或密码");
        }
    } catch (error) {
        setError(error.message);
    }
};

  /** ✅ 清空表单 */
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setVerificationCode("");
    setCodeSent(false);
  };

  return (
    <div className="home-container">
      <h1 className="typing big-title">
        <span className="certi-text">{mainTitle.slice(0, 3)}</span>
        <span className="master-text">{mainTitle.slice(3)}</span>
        {showMainCursor && <span className="cursor-blink">|</span>}
      </h1>
      {startSubtitle && (
        <h2 className="typing subtitle subtitle-up">
          {subTitle || ""}
          {showSubCursor && <span className="cursor-blink">|</span>}
        </h2>
      )}

      <form className={`menu wider-menu login-form ${showForm ? "show" : ""}`} onSubmit={isRegistering ? handleRegister : handleLogin}
      noValidate>
        <input type="email" placeholder="📧 请输入邮箱" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-short" />
        
        {isRegistering && (
          <div className="code-section">
            <input
              type="text"
              placeholder="🔢 输入验证码"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              className="input-short"
              ref={verificationInputRef} // ✅ 让验证码输入框自动获取焦点
            />
            <button type="button" onClick={handleSendCode} className="menu-option register" disabled={countdown > 0}>
              {countdown > 0 ? `请等待 ${countdown}s` : "📩 获取验证码"}
            </button>
          </div>
        )}

        <input type="password" placeholder="🔑 请输入密码" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-short" />

        {isRegistering && (
          <input type="password" placeholder="🔑 请确认密码" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="input-short" />
        )}

        {error && <p className="error-text">{error}</p>}

        <div className="button-group">
          {isRegistering ? (
            <>
              <button type="button" className="menu-option register" onClick={() => setIsRegistering(false)}>🔙 返回</button>
              <button type="submit" className="menu-option login-button">✨ 注册</button>
            </>
          ) : (
            <>
              <button type="submit" className="menu-option login-button">🚀 登录</button>
              <button type="button" className="menu-option register" onClick={() => setIsRegistering(true)}>✨ 注册</button>
            </>
          )}
        </div>
      </form>

      <div className="footer fixed-footer">
        v1.52 Created by <span className="code-text">Yang</span> <br />
        The final interpretation of this activity belongs to <span className="zoey-text">Zoey</span>
      </div>
    </div>
  );
};

export default Login;
