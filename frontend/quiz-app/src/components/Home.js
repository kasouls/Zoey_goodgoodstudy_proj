import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container 
      maxWidth="sm"
      style={{
        backgroundColor: "#2C2C2C", // 灰黑色背景
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <Typography 
        variant="h3" 
        style={{
          color: "white",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: "bold",
          marginBottom: "30px"
        }}
      >
        🚀 选择答题模式
      </Typography>

      <Box width="100%" display="flex" flexDirection="column" gap={2}>
        {/* 自定义模式 */}
        <Button 
          variant="contained" 
          fullWidth 
          onClick={() => navigate("/custom-mode")}
          sx={{
            backgroundColor: "#FFD700", // 金色按钮
            color: "black",
            fontSize: "20px",
            fontWeight: "bold",
            borderRadius: "50px",
            padding: "15px",
            fontFamily: "'Poppins', sans-serif",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#FFC107" }, // 悬停颜色
            "&:focus": { outline: "none", boxShadow: "none" },
          }}
        >
          🎯 自定义模式
        </Button>

        {/* 拟真模式 */}
        <Button 
          variant="contained" 
          fullWidth 
          onClick={() => navigate("/real-mode")}
          sx={{
            backgroundColor: "#FF6347", // 略带橙色的红色按钮
            color: "black",
            fontSize: "20px",
            fontWeight: "bold",
            borderRadius: "50px",
            padding: "15px",
            fontFamily: "'Poppins', sans-serif",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#FF7F50" }, // 悬停颜色
            "&:focus": { outline: "none", boxShadow: "none" },
          }}
        >
          🏆 拟真模式
        </Button>

        {/* 复习模式 */}
        <Button 
          variant="contained" 
          fullWidth 
          onClick={() => navigate("/review")}
          sx={{
            backgroundColor: "#4CAF50", // 绿色按钮
            color: "black",
            fontSize: "20px",
            fontWeight: "bold",
            borderRadius: "50px",
            padding: "15px",
            fontFamily: "'Poppins', sans-serif",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#66BB6A" }, // 悬停颜色
            "&:focus": { outline: "none", boxShadow: "none" },
          }}
        >
          📖 复习模式
        </Button>

        {/* 错题本模式 */}
        <Button 
          variant="contained" 
          fullWidth 
          onClick={() => navigate("/wrong-questions")}
          sx={{
            backgroundColor: "#D2691E", // 深橙色按钮
            color: "black",
            fontSize: "20px",
            fontWeight: "bold",
            borderRadius: "50px",
            padding: "15px",
            fontFamily: "'Poppins', sans-serif",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#A0522D" }, // 悬停颜色
            "&:focus": { outline: "none", boxShadow: "none" },
          }}
        >
          ❌ 错题本
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
