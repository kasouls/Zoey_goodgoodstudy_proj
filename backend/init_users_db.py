import sqlite3
import os

# 定义数据库路径
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = "../data/users.db"

# 确保 data 目录存在
os.makedirs("data", exist_ok=True)

# 连接 SQLite 数据库
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# 创建 `users` 表（存储用户信息）
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

# 创建 `wrong_questions` 表（记录用户答错的题目）
cursor.execute("""
CREATE TABLE IF NOT EXISTS wrong_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(question_id) REFERENCES questions(id)
);
""")

conn.commit()
conn.close()

print("✅ `users.db` 数据库创建完成！")
