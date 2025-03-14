import React, { useState, useEffect } from "react";
import { Container, Typography, Card, CardContent } from "@mui/material";
import API_BASE_URL from "../config";

const WrongQuestions = () => {
    const [wrongQuestions, setWrongQuestions] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/wrong_questions`)
            .then(res => res.json())
            .then(data => {
                console.log("📌 错题本数据:", data);
                setWrongQuestions(data.wrong_questions);
            })
            .catch(err => console.error("❌ 获取错题失败:", err));
    }, []);

    return (
        <Container maxWidth="sm" style={{ backgroundColor: "#2C2C2C", minHeight: "100vh", textAlign: "center", padding: "20px" }}>
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
                            <Typography variant="body1">A: {q.option_A}</Typography>
                            <Typography variant="body1">B: {q.option_B}</Typography>
                            <Typography variant="body1">C: {q.option_C}</Typography>
                            <Typography variant="body1">D: {q.option_D}</Typography>
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
