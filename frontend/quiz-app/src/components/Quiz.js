import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import API_BASE_URL from "../config";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Quiz = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const numQuestions = parseInt(query.get("num")) || 10;
  const mode = query.get("mode") || "chill";
  const timeLimit = parseInt(query.get("time")) || 30;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [correctCount, setCorrectCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const user_id = localStorage.getItem("user_id"); // ✅ 获取当前用户ID

  // ✅ 加载题目
  useEffect(() => {
    fetch(`${API_BASE_URL}/questions?limit=${numQuestions}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("🔍 API 返回数据:", data);

        if (Array.isArray(data.questions) && data.questions.length > 0) {
          const formattedQuestions = data.questions.map(q => ({
            ...q,
            options: {
              A: q.option_A,
              B: q.option_B,
              C: q.option_C,
              D: q.option_D
            }
          }));

          setQuestions(formattedQuestions);
        } else {
          console.error("❌ API 没有返回有效数据:", data);
          setQuestions([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("🚨 加载题目失败:", err);
        setQuestions([]);
        setLoading(false);
      });
  }, [numQuestions]);

  useEffect(() => {
    if (mode === "timed" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, timeLeft]);

  useEffect(() => {
    if (mode === "timed" && timeLeft === 0) {
      nextQuestion();
    }
  }, [mode, timeLeft]);

  const handleAnswer = (answerKey) => {
    setSelectedAnswer(answerKey);
  };

  const nextQuestion = () => {
    if (!selectedAnswer || !questions[currentIndex]) return;
    
    const currentQuestion = questions[currentIndex];

    const user_id = localStorage.getItem("user_id");  // ✅ 获取用户 ID
    if (!user_id) {
      console.error("❌ 用户 ID 为空，未登录？");
      return;
}

    console.log("📡 发送到 API 的数据:", {
      user_id: user_id,  // ✅ 先确保 `user_id` 不为空
      question_id: currentQuestion.id,
      user_answer: selectedAnswer
    });

    fetch(`${API_BASE_URL}/check_answer/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        user_id: user_id,  // ✅ 确保 `user_id` 传递
        question_id: currentQuestion.id,
        user_answer: selectedAnswer 
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🔍 API 返回:", data);
        console.log("✅ 题目:", currentQuestion.question_content);
        console.log("💡 用户选择:", selectedAnswer);
        console.log("🎯 正确答案:", currentQuestion.correct_answer);
        console.log("🔥 是否答对:", data.is_correct);

        const correct = Boolean(data.is_correct);
        setIsCorrect(correct);
        setCorrectAnswer(currentQuestion.correct_answer);
        setShowFeedback(true);

        if (correct) {
          setCorrectCount((prev) => prev + 1);
        }

        setTimeout(() => {
          if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
            setCorrectAnswer(null);
            setShowFeedback(false);
            if (mode === "timed") setTimeLeft(timeLimit * 60);
          } else {
            console.log("🚀 题目完成！跳转到结果页");
            navigate(`/results?total=${questions.length}&correct=${correctCount}`);
          }
        }, 1000);
      })
      .catch(err => console.error("🚨 检查答案请求失败:", err));
  };

  if (loading) return <Typography>加载中...</Typography>;

  if (questions.length === 0) return (
    <Container maxWidth="sm" style={{ textAlign: "center", padding: "20px", color: "white" }}>
      <Typography variant="h5" color="error" fontWeight="bold">
        ❌ 题目加载失败或数据错误！
      </Typography>
    </Container>
  );

  return (
    <Container maxWidth="sm" style={{ backgroundColor: "#2C2C2C", minHeight: "100vh", textAlign: "center", padding: "20px" }}>
      <Typography variant="h5" style={{ color: "white", fontWeight: "bold", marginBottom: "10px" }}>
        题目 {currentIndex + 1} / {questions.length}
      </Typography>

      <Card variant="outlined" style={{ padding: "20px", backgroundColor: "#444", color: "white", marginBottom: "20px" }}>
        <CardContent>
          <Typography 
            variant="h6"
            sx={{
              lineHeight: 1.3,
              fontSize: "18px",
              color: "white",
              marginBottom: "8px",
            }}
          >
            {questions[currentIndex].question_content}
          </Typography>
        </CardContent>
      </Card>

      {Object.entries(questions[currentIndex]?.options || {}).map(([key, option]) => (
        <motion.div 
          key={key}
          animate={showFeedback && selectedAnswer === key ? 
            (isCorrect ? { scale: [1, 1.1, 1] } : { x: [-5, 5, -5, 5, 0] }) 
            : {}}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleAnswer(key)}
            sx={{
              marginTop: "8px",
              fontSize: "16px",
              backgroundColor:
                showFeedback
                  ? key === correctAnswer
                    ? "#4CAF50"
                    : key === selectedAnswer
                    ? "#FF4C4C"
                    : "#666"
                  : selectedAnswer === key
                  ? "#FFA500"
                  : "#666",
              "&:hover": { backgroundColor: "#FF8C00" },
              color: "white",
              padding: "12px",
              borderRadius: "12px",
            }}
          >
            <Typography sx={{ lineHeight: 1.2, fontSize: "14px", fontWeight: "bold" }}>
              {option}
            </Typography>
          </Button>
        </motion.div>
      ))}

      {selectedAnswer && (
        <Button variant="contained" color="secondary" onClick={nextQuestion} sx={{ marginTop: "20px" }}>
          下一题
        </Button>
      )}
    </Container>
  );
};

export default Quiz;
