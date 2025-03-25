from fastapi import FastAPI, HTTPException, APIRouter, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import redis
import os
import random
import smtplib
import sqlite3
from passlib.context import CryptContext
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from email.header import Header
import locale
import sys

# ----------------------------------------------
locale.setlocale(locale.LC_ALL, "en_US.UTF-8")

if sys.getdefaultencoding() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

# ----------------------------------------------

# 加载环境变量
load_dotenv()

app = FastAPI()

# 📌 数据库路径
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USER_DB_PATH = os.path.join(BASE_DIR, "data/users.db")
QUESTION_DB_PATH = os.path.join(BASE_DIR, "data/questions.db")

# 🛠️ CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔐 密码加密
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 📧 Redis 连接（存验证码）
redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

# 🔹 获取 `users.db` 连接
def get_user_db_connection():
    try:
        conn = sqlite3.connect(USER_DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"用户数据库连接失败: {str(e)}")

# 🔹 获取 `questions.db` 连接
def get_question_db_connection():
    try:
        conn = sqlite3.connect(QUESTION_DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"题库数据库连接失败: {str(e)}")

# 🎯 生成 6 位验证码
def generate_verification_code():
    return str(random.randint(100000, 999999))

# 📧 发送验证码邮件
def send_email(to_email: str, code: str):
    subject = "哎朋友，你的验证码来啦！"
    body = f"验证码:{code}\n5分钟后就用不了啦."

    msg = MIMEMultipart()
    msg["Subject"] = Header(subject, "utf-8").encode()
    msg["From"] = os.getenv("EMAIL_USER")
    msg["To"] = to_email

    msg.attach(MIMEText(body, "plain", "utf-8"))

    try:
        server = smtplib.SMTP(os.getenv("SMTP_HOST"), int(os.getenv("SMTP_PORT")), local_hostname="")
        server.starttls()
        server.login(os.getenv("SMTP_USERNAME"), os.getenv("SMTP_PASSWORD"))
        server.sendmail(os.getenv("EMAIL_USER"), to_email, msg.as_string().encode("utf-8"))
        server.quit()
        return True
    except Exception as e:
        return False

# 📌 发送验证码 API
class EmailRequest(BaseModel):
    email: str    

@app.post("/send_verification_code/")
def send_verification_code(request: EmailRequest):
    email = request.email
    code = generate_verification_code()

    redis_client.setex(f"verify_code:{email}", 300, code)
    if send_email(email, code):
        return {"message": "验证码已发送"}
    else:
        raise HTTPException(status_code=500, detail="验证码发送失败")

# 📌 验证验证码 API
class VerifyCodeRequest(BaseModel):
    email: str
    code: str

@app.post("/verify_code/")
def verify_code(request: VerifyCodeRequest):
    email = request.email
    code = request.code

    stored_code = redis_client.get(f"verify_code:{email}")

    if stored_code is None or stored_code != code:
        raise HTTPException(status_code=400, detail="验证码错误或已过期")

    redis_client.delete(f"verify_code:{email}")
    return {"message": "验证成功"}

# 📌 **注册 API**
class RegisterRequest(BaseModel):
    email: str
    password: str

@app.post("/register/")
def register_user(request: RegisterRequest):
    conn = get_user_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (request.email,))
    existing_user = cursor.fetchone()
    if existing_user:
        conn.close()
        raise HTTPException(status_code=400, detail="用户已存在")

    hashed_password = pwd_context.hash(request.password)
    cursor.execute("INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, datetime('now'))", 
                   (request.email, hashed_password))
    
    conn.commit()
    conn.close()
    return {"message": "注册成功"}

# 📌 **登录 API**
class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/login/")
def login_user(request: LoginRequest):
    conn = get_user_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, password_hash FROM users WHERE email = ?", (request.email,))
    user = cursor.fetchone()

    if not user:
        conn.close()
        raise HTTPException(status_code=400, detail="用户不存在")

    if not pwd_context.verify(request.password, user["password_hash"]):
        conn.close()
        raise HTTPException(status_code=401, detail="密码错误")

    conn.close()
    return {"message": "登录成功", "user_id": user["id"]}

# 📌 **检查答案 API（存错题）**
class CheckAnswerRequest(BaseModel):
    user_id: int
    question_id: int
    user_answer: str

@app.post("/check_answer/")
def check_answer(request: CheckAnswerRequest):
    print("📥 接收到数据:", request.dict())
    conn = get_question_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT correct_answer FROM questions WHERE id = ?", (request.question_id,))
    question = cursor.fetchone()
    
    if not question:
        conn.close()
        raise HTTPException(status_code=404, detail="题目不存在")

    correct_answer = question["correct_answer"]
    is_correct = request.user_answer == correct_answer

    conn.close()

    if not is_correct:
        user_conn = get_user_db_connection()
        user_cursor = user_conn.cursor()

        user_cursor.execute(
            "SELECT 1 FROM wrong_questions WHERE user_id = ? AND question_id = ?", 
            (request.user_id, request.question_id)
        )
        if not user_cursor.fetchone():
            user_cursor.execute(
                "INSERT INTO wrong_questions (user_id, question_id) VALUES (?, ?)", 
                (request.user_id, request.question_id)
            )
            user_conn.commit()

        user_conn.close()

    return {"is_correct": is_correct, "correct_answer": correct_answer}


@app.get("/total_questions")
def get_total_questions():
    """返回题库中的总题目数量"""
    conn = get_question_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM questions")
    total = cursor.fetchone()[0]

    conn.close()
    return {"total": total}



# 📌 获取随机题目
@app.get("/questions/")
def fetch_questions(limit: int = 10):
    conn = get_question_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM questions ORDER BY RANDOM() LIMIT ?", (limit,))
    questions = cursor.fetchall()
    conn.close()

    return {"questions": [dict(q) for q in questions]}

# 📌 获取用户错题（从 `users.db` 获取错题 ID，再去 `questions.db` 拿题目）
@app.get("/wrong_questions/")
def get_user_wrong_questions(user_id: int):
    conn = get_user_db_connection()
    cursor = conn.cursor()

    # 🔹 1. 先获取当前 `user_id` 对应的错题 ID
    cursor.execute("SELECT question_id FROM wrong_questions WHERE user_id = ?", (user_id,))
    question_ids = [row[0] for row in cursor.fetchall()]

    conn.close()

    if not question_ids:
        return {"questions": []}  # ✅ 没有错题，返回空数组

    # 🔹 2. 去 `questions.db` 获取完整题目数据
    conn = get_question_db_connection()
    cursor = conn.cursor()

    placeholders = ",".join(["?"] * len(question_ids))
    cursor.execute(f"SELECT * FROM questions WHERE id IN ({placeholders})", question_ids)
    questions = cursor.fetchall()

    conn.close()

    return {
        "questions": [
            {
                "id": q["id"],
                "question_content": q["question_content"],
                "options": {
                    "A": q["option_A"],
                    "B": q["option_B"],
                    "C": q["option_C"],
                    "D": q["option_D"]
                },
                "correct_answer": q["correct_answer"]
            }
            for q in questions
        ]
    }
    
@app.get("/flashcard_challenge/")
def get_flashcard_questions(user_id: int = Query(...), limit: int = 10):
    try:
        # 1. 从用户错题库中查出 question_id
        user_conn = get_user_db_connection()
        user_cursor = user_conn.cursor()
        user_cursor.execute(
            "SELECT question_id FROM wrong_questions WHERE user_id = ?", (user_id,)
        )
        question_ids = [row["question_id"] for row in user_cursor.fetchall()]
        user_conn.close()

        if not question_ids:
            return JSONResponse(content={"questions": []})

        # 2. 去题库里查详情（随机抽取）
        question_conn = get_question_db_connection()
        question_cursor = question_conn.cursor()
        placeholders = ",".join(["?"] * len(question_ids[:limit]))
        question_cursor.execute(
            f"""
            SELECT id, question_content, option_A, option_B, option_C, option_D, correct_answer
            FROM questions
            WHERE id IN ({placeholders})
            ORDER BY RANDOM()
            """,
            question_ids[:limit]
        )
        rows = question_cursor.fetchall()
        question_conn.close()

        # 3. 组装返回数据
        return JSONResponse(content={
            "questions": [
                {
                    "id": row["id"],
                    "question_content": row["question_content"],
                    "options": {
                        "A": row["option_A"],
                        "B": row["option_B"],
                        "C": row["option_C"],
                        "D": row["option_D"]
                    },
                    "correct_answer": row["correct_answer"]
                }
                for row in rows
            ]
        })

    except Exception as e:
        print("❌ 闪卡错题挑战加载失败:", e)
        return JSONResponse(content={"questions": []}, status_code=500)

# 📌 运行 FastAPI 服务器
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
