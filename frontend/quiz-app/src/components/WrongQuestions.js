import React, { useState, useEffect } from "react";
import { Container, Typography, Card, CardContent } from "@mui/material";
import API_BASE_URL from "../config";

const WrongQuestions = () => {
    const [wrongQuestions, setWrongQuestions] = useState([]);
    const userId = localStorage.getItem("user_id"); // ✅ 读取 `user_id`

    useEffect(() => {
        if (!userId) {
            console.error("❌ 用户未登录，无法获取错题");
            return;
        }

        fetch(`${API_BASE_URL}/wrong_questions/?user_id=${userId}`)
            .then(res => res.json())
            .then(data => {
                console.log("📌 错题本数据:", data);
                setWrongQuestions(data.questions);
            })
            .catch(err => console.error("❌ 获取错题失败:", err));
    }, [userId]);

    return (
        <Container maxWidth="sm" style={{ backgroundColor: "#2C2C2C", minHeight: "100vh", textAlign: "center", padding: "20px", overflowY: "auto" }}>
            <Typography variant="h5" style={{ color: "white", fontWeight: "bold", marginBottom: "20px" }}>
                📖 错题本
            </Typography>
    
            {wrongQuestions.length === 0 ? (
                <Typography variant="h6" style={{ color: "white" }}>暂无错题</Typography>
            ) : (
                wrongQuestions.map(q => (
                    <Card key={q.id} variant="outlined" style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#444", color: "white" }}>
                        <CardContent>
                            <Typography variant="h6">{q.question_content}</Typography>
                            <Typography variant="body1">A: {q.options.A}</Typography>
                            <Typography variant="body1">B: {q.options.B}</Typography>
                            <Typography variant="body1">C: {q.options.C}</Typography>
                            <Typography variant="body1">D: {q.options.D}</Typography>
                            <Typography variant="body1" style={{ fontWeight: "bold", color: "#FFD700", marginTop: "10px" }}>
                                ✅ 正确答案: {q.correct_answer}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default WrongQuestions;
