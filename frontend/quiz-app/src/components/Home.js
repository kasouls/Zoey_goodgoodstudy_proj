import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [mainTitle, setMainTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [showMainCursor, setShowMainCursor] = useState(true);
  const [showSubCursor, setShowSubCursor] = useState(false); // ✅ 副标题光标独立控制

  const mainText = ["Certi", "Master"];
  const subText = "是时候去收割一波证书了！";

  useEffect(() => {
    setTimeout(() => {
      let i = 0;
      let currentText = "";

      const typeMain = setInterval(() => {
        if (i < mainText[0].length) {
          currentText += mainText[0][i];
          setMainTitle(<span className="certi-text">{currentText}</span>);
        } else if (i < mainText[0].length + mainText[1].length) {
          currentText += mainText[1][i - mainText[0].length];
          setMainTitle(
            <>
              <span className="certi-text">{mainText[0]}</span>
              <span className="master-text">{currentText.slice(mainText[0].length)}</span>
            </>
          );
        } else {
          clearInterval(typeMain);
          setTimeout(() => {
            setShowMainCursor(false); // ✅ 主标题光标完全关闭
            setTimeout(() => {
              setShowSubCursor(true); // ✅ 只开启副标题的绿色光标
              typeSubtitle();
            }, 1500);
          }, 500);
        }
        i++;
      }, 180);
    }, 2500);

    const typeSubtitle = () => {
      let j = 0;
      let currentText = "";

      const typeSub = setInterval(() => {
        if (j < subText.length) {
          currentText += subText[j];
          setSubTitle(<span className="subtitle-text">{currentText}</span>);
          j++;
        } else {
          clearInterval(typeSub);
          setTimeout(() => {
            setShowSubCursor(false); // ✅ 副标题打完后，光标消失
          }, 2000);
        }
      }, 50);
    };
  }, []);

  return (
    <div className="home-container">
      <div className="title-container">
        <h1 className="typing big-title">
          {mainTitle}
          {showMainCursor && !showSubCursor && <span className="cursor">|</span>} {/* ✅ 只显示主标题光标 */}
        </h1>
        <h2 className="typing subtitle subtitle-up">
          {subTitle}
          {showSubCursor && <span className="green-cursor">|</span>} {/* ✅ 只显示副标题光标 */}
        </h2>
      </div>

      <div className="menu wider-menu">
        <div className="menu-option" onClick={() => navigate("/custom-mode")}> > 🎯 自定义模式 </div>
        <div className="menu-option" onClick={() => navigate("/real-mode")}> > 🏆 拟真模式 </div>
        <div className="menu-option" onClick={() => navigate("/review")}> > 📖 复习模式 </div>
        <div className="menu-option" onClick={() => navigate("/wrong-questions")}> > ❌ 错题本 </div>
      </div>

      <div className="footer move-down">
        v1.14 Created by <span className="code-text">Yang</span> <br />
        <span className="error-text">BUT</span> <br />
        The final interpretation of this activity belongs to <span className="zoey-text">Zoey</span>
      </div>

    </div>
  );
};

export default Home;
