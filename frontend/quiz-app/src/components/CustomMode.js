import React, { useState, useEffect } from "react";
import { Container, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CustomMode = () => {
  const navigate = useNavigate();
  const [numQuestions, setNumQuestions] = useState(10);
  const [maxQuestions, setMaxQuestions] = useState(50);
  const [mode, setMode] = useState("chill");
  const [timeLimit, setTimeLimit] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/total_questions") // ✅ 获取题目总数
      .then((res) => res.json())
      .then((data) => {
        if (data.total > 0) {
          setMaxQuestions(data.total); // ✅ 确保 maxQuestions 正确
          setNumQuestions(Math.min(10, data.total)); // ✅ 默认题数不能超过 maxQuestions
        }
      })
      .catch((err) => console.error("获取题目数量失败:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleNumQuestionsChange = (e) => {
    const value = Math.max(1, Math.min(maxQuestions, Number(e.target.value))); // ✅ 限制范围
    setNumQuestions(value);
  };

  const startQuiz = () => {
    if (numQuestions <= 0 || numQuestions > maxQuestions) {
      alert(`题目数量必须在 1 ~ ${maxQuestions} 之间！`);
      return;
    }
    navigate(`/quiz?num=${numQuestions}&mode=${mode}&time=${timeLimit}`);
  };

  return (
    <Container 
      maxWidth="sm"
      style={{
        backgroundColor: "#2C2C2C",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <Typography 
        variant="h4"
        style={{
          color: "white",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        🎯 自定义模式
      </Typography>

      {loading ? (
        <Typography color="gray">加载中...</Typography>
      ) : (
        <>
          {/* 题目数量输入框 */}
          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <InputLabel
              shrink
              sx={{
                color: "white",
                fontWeight: "bold",
                backgroundColor: "#2C2C2C",
                padding: "0 5px",
                borderRadius: "5px",
              }}
            >
              题目数量（共 {maxQuestions} 题）
            </InputLabel>
            <TextField
              type="number"
              value={numQuestions}
              onChange={handleNumQuestionsChange}
              fullWidth
              variant="outlined"
              sx={{
                backgroundColor: "#2C2C2C",
                borderRadius: "12px",
                input: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  border: "2px solid #B0B0B0",
                  borderRadius: "12px",
                },
                "& .MuiOutlinedInput-root:hover": {
                  borderColor: "#FFD700",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#B0B0B0",
                },
              }}
            />
          </FormControl>

          {/* 选择答题模式 */}
          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <InputLabel
              shrink
              sx={{
                color: "white",
                fontWeight: "bold",
                backgroundColor: "#2C2C2C",
                padding: "0 5px",
                borderRadius: "5px",
              }}
            >
              选择模式
            </InputLabel>
            <Select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              fullWidth
              sx={{
                backgroundColor: "#2C2C2C",
                color: "white",
                borderRadius: "12px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#B0B0B0",
                  borderRadius: "12px",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FFD700",
                },
              }}
            >
              <MenuItem value="chill">😌 Chill 模式（无时间限制）</MenuItem>
              <MenuItem value="timed">⏳ 限时模式</MenuItem>
            </Select>
          </FormControl>

          {/* 限时模式下的时间选择 */}
          {mode === "timed" && (
            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
              <InputLabel
                shrink
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor: "#2C2C2C",
                  padding: "0 5px",
                  borderRadius: "5px",
                }}
              >
                考试时间（分钟）
              </InputLabel>
              <TextField
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                fullWidth
                variant="outlined"
                sx={{
                  backgroundColor: "#2C2C2C",
                  borderRadius: "12px",
                  input: { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    border: "2px solid #B0B0B0",
                    borderRadius: "12px",
                  },
                  "& .MuiOutlinedInput-root:hover": {
                    borderColor: "#FFD700",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#B0B0B0",
                  },
                }}
              />
            </FormControl>
          )}

          {/* 开始答题按钮 */}
          <Button 
            variant="contained"
            fullWidth
            onClick={startQuiz}
            sx={{
              backgroundColor: "#FFD700",
              color: "black",
              fontSize: "20px",
              fontWeight: "bold",
              borderRadius: "50px",
              padding: "15px",
              fontFamily: "'Nunito', sans-serif",
              marginTop: "30px",
              "&:hover": { backgroundColor: "#FFC107" },
              "&:focus": { outline: "none", boxShadow: "none" },
            }}
          >
            🚀 开始答题
          </Button>
        </>
      )}
    </Container>
  );
};

export default CustomMode;
