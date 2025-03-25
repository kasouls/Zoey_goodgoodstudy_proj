from flask import Flask, request, jsonify
import sqlite3
import hashlib
import os
import dotenv

dotenv.load_dotenv()

app = Flask(__name__)

USERS_DB_PATH = "../data/users.db"

def hash_password(password):
    """使用 SHA256 对密码进行加密"""
    return hashlib.sha256(password.encode()).hexdigest()

@app.route("/api/register", methods=["POST"])
def register_user():
    """ 用户注册 API """
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "邮箱和密码不能为空"}), 400

    try:
        conn = sqlite3.connect(USERS_DB_PATH)
        cursor = conn.cursor()
        
        # 检查邮箱是否已注册
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            return jsonify({"success": False, "message": "该邮箱已被注册"}), 400

        # 存入数据库（密码使用哈希加密）
        hashed_password = hash_password(password)
        cursor.execute("INSERT INTO users (email, password_hash) VALUES (?, ?)", (email, hashed_password))
        conn.commit()
        conn.close()

        print(f"✅ 用户 {email} 注册成功！")
        return jsonify({"success": True, "message": "注册成功"})

    except Exception as e:
        print("❌ 注册失败:", str(e))
        return jsonify({"success": False, "message": "注册失败"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
