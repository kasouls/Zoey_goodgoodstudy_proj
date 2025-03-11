import sqlite3
import os
import json

# 获取数据库路径
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "../data/questions.db")

# 连接数据库
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# 读取 questions.txt
TXT_FILE_PATH = os.path.join(BASE_DIR, "questions.txt")

try:
    with open(TXT_FILE_PATH, "r", encoding="utf-8") as file:
        new_questions = json.load(file)  # 解析 JSON
except json.JSONDecodeError as e:
    print(f"❌ JSON 解析失败: {e}")
    conn.close()
    exit(1)
except Exception as e:
    print(f"❌ 读取文件失败: {e}")
    conn.close()
    exit(1)

# 插入数据
for q in new_questions:
    cursor.execute("""
        INSERT INTO questions (question_content, option_A, option_B, option_C, option_D, correct_answer, is_wrong)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (q["题目内容"], q["选项"]["A"], q["选项"]["B"], q["选项"]["C"], q["选项"]["D"], q["答案"], 0))  # 默认 is_wrong 为 False

conn.commit()
conn.close()

print(f"✅ 成功导入 {len(new_questions)} 道题目，所有题目初始为非错题！")
