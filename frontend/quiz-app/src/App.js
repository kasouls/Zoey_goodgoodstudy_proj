import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import CustomMode from "./components/CustomMode";
import WrongQuestions from "./components/WrongQuestions"; // ✅ 确保导入错题本

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/results" element={<Results />} />
                <Route path="/custom-mode" element={<CustomMode />} />
                <Route path="/wrong-questions" element={<WrongQuestions />} /> {/* ✅ 复习模式 */}
            </Routes>
        </Router>
    );
}

export default App;
