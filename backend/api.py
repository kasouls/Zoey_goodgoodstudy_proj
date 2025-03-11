from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .database import get_random_questions, check_answer, get_db_connection

app = FastAPI()

class AnswerRequest(BaseModel):
    question_id: int  # ✅ 确保 API 端点只接受 `question_id`
    user_answer: str

# 允许 CORS 访问，支持多个前端地址
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # 允许 React 前端访问
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有请求方法（GET, POST, etc.）
    allow_headers=["*"],  # 允许所有请求头
)

# 测试 API 运行
@app.get("/")
async def home():
    return {"message": "API is running!"}

# 获取随机题目
@app.get("/questions")
async def fetch_questions(limit: int = 10):
    """获取随机题目"""
    questions = get_random_questions(limit)
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found")
    return {"questions": questions}


# 验证用户答案
@app.post("/check_answer")
def verify_answer(answer: AnswerRequest):
    """校验用户答案是否正确，并存入错题本"""
    conn = sqlite3.connect("data/questions.db")
    cursor = conn.cursor()

    cursor.execute("SELECT correct_answer FROM questions WHERE id = ?", (answer.question_id,))
    result = cursor.fetchone()

    if not result:
        conn.close()
        return {"error": "Question not found"}

    correct_answer = result[0]
    is_correct = (correct_answer == answer.user_answer)

    if not is_correct:
        # ✅ 更新 `questions` 表的 `is_wrong`
        cursor.execute("UPDATE questions SET is_wrong = 1 WHERE id = ?", (answer.question_id,))
        conn.commit()

        # ✅ 把错题存入 `wrong_questions`
        cursor.execute("""
            INSERT OR IGNORE INTO wrong_questions (question_id)
            VALUES (?)
        """, (answer.question_id,))
        conn.commit()

    conn.close()
    return {"question_id": answer.question_id, "is_correct": is_correct}
    
@app.get("/wrong_questions")
def get_wrong_questions():
    """获取所有错题"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT q.id, q.question_content, q.option_A, q.option_B, q.option_C, q.option_D, q.correct_answer 
        FROM questions q
        JOIN wrong_questions w ON q.id = w.question_id
    """)

    wrong_questions = cursor.fetchall()
    conn.close()

    return {"wrong_questions": [dict(q) for q in wrong_questions]}


@app.post("/clear_wrong")
def clear_wrong_question(question_id: int):
    """清除某个错题（复习后移除）"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("UPDATE questions SET is_wrong = 0 WHERE id = ?", (question_id,))
    
    conn.commit()
    conn.close()

    return {"message": "错题已移除"}


# 运行 FastAPI 服务器
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
