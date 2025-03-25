import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import CustomMode from "./components/CustomMode";
import WrongQuestions from "./components/WrongQuestions";
import Login from "./components/Login"; // ✅ 添加登录页面

function App() {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    return (
        <Router>
            <Routes>
                {/* ✅ 直接访问 /home 时，检查是否已认证 */}
                <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                
                {/* ✅ 登录页面 */}
                <Route path="/login" element={<Login />} />

                {/* ✅ 默认首页，自动重定向到 /home */}
                <Route path="/" element={<Navigate to="/home" />} />

                {/* ✅ 其他页面，必须认证后才能访问 */}
                <Route path="/quiz" element={isAuthenticated ? <Quiz /> : <Navigate to="/login" />} />
                <Route path="/results" element={isAuthenticated ? <Results /> : <Navigate to="/login" />} />
                <Route path="/custom-mode" element={isAuthenticated ? <CustomMode /> : <Navigate to="/login" />} />
                <Route path="/wrong-questions" element={isAuthenticated ? <WrongQuestions /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
