import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # 获取当前文件的目录
DB_PATH = os.path.join(BASE_DIR, "../data/questions.db")  # 拼接数据库路径

def get_db_connection():
    """建立数据库连接"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # 让返回结果支持字典访问
    return conn

def get_random_questions(limit=10):
    """随机获取指定数量的题目"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, question_content, option_A, option_B, option_C, option_D, correct_answer, is_wrong
        FROM questions
        ORDER BY RANDOM() LIMIT ?
    """, (limit,))
    
    questions = cursor.fetchall()
    conn.close()

    # 处理数据格式
    formatted_questions = []
    for q in questions:
        formatted_questions.append({
            "id": q["id"],
            "question_content": q["question_content"],
            "options": {
                "A": q["option_A"],
                "B": q["option_B"],
                "C": q["option_C"],
                "D": q["option_D"]
            },
            "correct_answer": q["correct_answer"],
            "is_wrong": q["is_wrong"]
        })
    
    return formatted_questions

def check_answer(question_id, user_answer):
    """检查答案是否正确"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT correct_answer FROM questions WHERE id = ?", (question_id,))
    result = cursor.fetchone()
    conn.close()
    
    if result:
        correct_answer = str(result["correct_answer"]).strip().upper()
        user_answer = str(user_answer).strip().upper()
        is_correct = correct_answer == user_answer

        # 如果答错了，就标记为错题
        if not is_correct:
            mark_wrong_answer(question_id)

        return {"is_correct": is_correct}

    return {"error": "Question not found"}


def mark_wrong_answer(question_id):
    """将某个题目标记为错题"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("UPDATE questions SET is_wrong = 1 WHERE id = ?", (question_id,))
    
    conn.commit()
    conn.close()
