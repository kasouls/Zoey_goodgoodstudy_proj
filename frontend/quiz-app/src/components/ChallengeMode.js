import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import "./ChallengeMode.css";

const ChallengeMode = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [clickedBtn, setClickedBtn] = useState(null);
  const [direction, setDirection] = useState(0);
  const [isDropping, setIsDropping] = useState(false);

  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const getRandomCorner = () => {
    const corners = ["top left", "top right", "bottom left", "bottom right"];
    return corners[Math.floor(Math.random() * 4)];
  };

  const cardVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
    exit: (dir) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 },
    }),
    drop: {
      transformOrigin: getRandomCorner(),
      rotate: [0, 5, -8, 15, -10, 90],
      y: [0, 15, 0, 50, 200],
      opacity: [1, 1, 1, 0.5, 0],
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  };

  const asciiArt = (letter) => {
    const arts = {
      A: `
  ▄▄▄  
 █   █ 
 █▄ █ 
 █   █ 
 █   █ `,
      B: `
 ███▄  
█   █ 
 ███▀  
█   █ 
 ███▀  `,
      C: `
   ▄███  
 █      
 █      
 █      
  ▀███ `,
      D: `
   ███▄   
   █     █  
   █      █ 
   █     █  
  ███▀  `,
    };
    return arts[letter] || letter;
  };

  useEffect(() => {
    if (!userId) return;
    fetch(`${API_BASE_URL}/flashcard_challenge/?user_id=${userId}&limit=8`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(null));
      });
  }, [userId]);

  const current = questions[currentIndex];

  const applyAnswerAndContinue = (status) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = status;
    setAnswers(updatedAnswers);
    setIsFlipped(false);
    setDirection(1);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleFeedback = (status) => {
    setClickedBtn(status);
    if (status === "unknown") {
      setIsDropping(true);
      setTimeout(() => {
        applyAnswerAndContinue(status);
        setIsDropping(false);
        setClickedBtn(null);
      }, 1000);
    } else {
      setTimeout(() => setClickedBtn(null), 300);
      applyAnswerAndContinue(status);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setDirection(-1);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  if (!current) {
    return (
      <Container sx={{ color: "white", textAlign: "center", mt: 5 }}>
        <Typography variant="h5">📭 没有错题了！</Typography>
      </Container>
    );
  }

  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <Container maxWidth="sm" sx={{ mt: 5, color: "white", textAlign: "center", position: "relative" }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        ⚡ 错题挑战：第 {currentIndex + 1} / {questions.length} 题
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 5,
          backgroundColor: "#444",
          "& .MuiLinearProgress-bar": {
            background: "linear-gradient(90deg, #00f0ff, #00ff94)",
          },
          mb: 3,
        }}
      />

      <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        ref={cardRef}
        key={current.id}
        custom={direction}
        variants={cardVariants}
        initial="enter"
        animate={isDropping ? "drop" : {
          x: 0,
          scale: 1,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 500,
            damping: 25,
          }
        }}
        exit="exit"
        className={`card-container ${isDropping ? "dropping" : ""}`}
        onClick={() => {
          if (!isDropping) {
            setIsFlipped(!isFlipped);
            setTimeout(() => {
              cardRef.current?.scrollTo({ top: 0, behavior: "smooth" });
            }, 100);
          }
        }}
      >
          <div className={`card ${isFlipped ? "flipped" : ""}`}>
            <div className="front card-face">
              <Typography variant="h6" sx={{ fontSize: "17px", lineHeight: 1.8, mb: 2 }}>
                {current.question_content}
              </Typography>
              {["A", "B", "C", "D"].map((key) => (
                <Box
                  key={key}
                  sx={{
                    backgroundColor: "#222",
                    borderRadius: "12px",
                    padding: "8px 12px",
                    my: 1,
                    textAlign: "left",
                    color: "#00eaff",
                    fontWeight: "bold",
                  }}
                >
                  {key}: {current.options?.[key] ?? "（无内容）"}
                </Box>
              ))}
              <Typography variant="caption" sx={{ mt: 2, display: "block", color: "#888" }}>
                点击卡片查看答案
              </Typography>
            </div>

            <div className="back card-face" style={{ textAlign: "center" }}>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                ✅ 正确答案是：
              </Typography>
              <pre style={{
                fontFamily: "monospace",
                fontSize: "28px",
                color: "#00ffe7",
                textShadow: "0 0 10px #00ffe7",
                lineHeight: 1.2,
                margin: "0 auto"
              }}>
                {asciiArt(current.correct_answer)}
              </pre>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className={`flash-btn known ${clickedBtn === "known" ? "clicked" : ""}`}
          onClick={() => handleFeedback("known")}
        >
          ✅ 我会了
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className={`flash-btn unknown ${clickedBtn === "unknown" ? "clicked" : ""}`}
          onClick={() => handleFeedback("unknown")}
        >
          🤔 还不会
        </motion.button>
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button onClick={handlePrev} variant="outlined" color="warning">
          ⬅️ 上一题
        </Button>
      </Box>

      <Dialog open={isFinished}>
        <DialogTitle>🎉 挑战完成！</DialogTitle>
        <DialogContent>
          <Typography variant="body1">总题数：{questions.length}</Typography>
          <Typography variant="body1" color="success.main">
            掌握了：{answers.filter((a) => a === "known").length} 题
          </Typography>
          <Typography variant="body1" color="warning.main">
            还需努力：{answers.filter((a) => a === "unknown").length} 题
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/")}>🏠 返回首页</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ChallengeMode;
