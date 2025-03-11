import sqlite3
import os

# 获取数据库路径
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "../data/questions.db")

# 连接数据库
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# 清空旧数据
cursor.execute("DROP TABLE IF EXISTS questions")

# 重新创建表（不再包含 question_number，新增 is_wrong）
cursor.execute("""
    CREATE TABLE questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_content TEXT NOT NULL,
        option_A TEXT NOT NULL,
        option_B TEXT NOT NULL,
        option_C TEXT NOT NULL,
        option_D TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        is_wrong BOOLEAN DEFAULT 0  -- 记录是否为错题
    )
""")

conn.commit()
conn.close()

print("✅ 数据库已重置，删除题号，新增错题标记列！")
