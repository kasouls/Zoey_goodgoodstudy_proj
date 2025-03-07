import sqlite3
import json
import os

DB_PATH = "data/questions.db"
JSON_PATH = "data/questions.json"

# 创建数据库并定义表结构
def setup_database():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_number INTEGER UNIQUE,
        question_content TEXT,
        option_A TEXT,
        option_B TEXT,
        option_C TEXT,
        option_D TEXT,
        correct_answer TEXT
    )
    """)
    
    conn.commit()
    conn.close()
    print("✅ 数据库已初始化")

# 读取 JSON 并存入数据库
def import_questions():
    if not os.path.exists(JSON_PATH):
        print("⚠️ JSON 文件不存在，请检查路径")
        return
    
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        questions = json.load(f)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    for q in questions:
        cursor.execute("""
        INSERT OR REPLACE INTO questions (question_number, question_content, option_A, option_B, option_C, option_D, correct_answer)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            q["question_number"],
            q["question_content"],
            q["options"]["A"],
            q["options"]["B"],
            q["options"]["C"],
            q["options"]["D"],
            q["correct_answer"]
        ))
    
    conn.commit()
    conn.close()
    print("✅ 题目已成功导入数据库")

# 运行主程序
def main():
    os.makedirs("data", exist_ok=True)
    setup_database()
    import_questions()

if __name__ == "__main__":
    main()
