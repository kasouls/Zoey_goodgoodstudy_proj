import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Card, CardContent } from "@mui/material";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Results = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const totalQuestions = parseInt(query.get("total")) || 10;
  const correctAnswers = parseInt(query.get("correct")) || 0;
  const wrongAnswers = totalQuestions - correctAnswers;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

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
        fontFamily: "'Museo Sans Rounded', sans-serif",
      }}
    >
      <Typography 
        variant="h4"
        style={{ color: "white", fontWeight: "bold", marginBottom: "20px" }}
      >
        🎉 你完成了答题！
      </Typography>

      <Card 
        style={{
          padding: "20px",
          borderRadius: "16px",
          backgroundColor: "#444",
          color: "white",
          marginBottom: "20px",
        }}
      >
        <CardContent>
          <Typography variant="h5" style={{ marginBottom: "10px" }}>
            你的得分：{score}%
          </Typography>
          <Typography variant="h6">✅ 正确答案：{correctAnswers}</Typography>
          <Typography variant="h6" style={{ marginBottom: "10px" }}>❌ 错误答案：{wrongAnswers}</Typography>
        </CardContent>
      </Card>

      <Button 
        variant="contained"
        fullWidth
        onClick={() => navigate("/review")}
        sx={{
          backgroundColor: "#FFA500",
          color: "black",
          fontSize: "18px",
          fontWeight: "bold",
          borderRadius: "50px",
          padding: "15px",
          fontFamily: "'Museo Sans Rounded', sans-serif",
          marginBottom: "20px",
          "&:hover": { backgroundColor: "#FF8C00" },
        }}
      >
        📖 复习错题
      </Button>

      <Button 
        variant="contained"
        fullWidth
        onClick={() => navigate("/")}
        sx={{
          backgroundColor: "#FFD700",
          color: "black",
          fontSize: "18px",
          fontWeight: "bold",
          borderRadius: "50px",
          padding: "15px",
          fontFamily: "'Museo Sans Rounded', sans-serif",
          "&:hover": { backgroundColor: "#FFC107" },
        }}
      >
        🔄 返回主页
      </Button>
    </Container>
  );
};

export default Results;
