from fastapi import FastAPI, HTTPException
from backend.database import get_random_questions, check_answer

app = FastAPI()

@app.get("/questions")
def fetch_questions(limit: int = 10):
    """获取随机题目"""
    questions = get_random_questions(limit)
    return {"questions": questions}

@app.post("/check_answer")
def verify_answer(question_number: int, user_answer: str):
    """校验用户答案是否正确"""
    is_correct = check_answer(question_number, user_answer)
    return {"question_number": question_number, "is_correct": is_correct}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
