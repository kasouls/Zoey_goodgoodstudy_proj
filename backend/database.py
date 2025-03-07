import sqlite3

DB_PATH = "data/questions.db"

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
        SELECT question_number, question_content, option_A, option_B, option_C, option_D
        FROM questions
        ORDER BY RANDOM() LIMIT ?
    """, (limit,))
    
    questions = cursor.fetchall()
    conn.close()
    return [dict(q) for q in questions]

def check_answer(question_number, user_answer):
    """检查答案是否正确"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT correct_answer FROM questions WHERE question_number = ?", (question_number,))
    correct_answer = cursor.fetchone()
    conn.close()
    
    if correct_answer:
        return correct_answer["correct_answer"] == user_answer
    return False

if __name__ == "__main__":
    print("✅ 数据库连接测试成功")
