const API_BASE_URL = "http://127.0.0.1:8000"; // 本地测试时使用
// const API_BASE_URL = "http://34.80.187.157:8000"; // 部署到 GCP 时使用

/** ✅ 发送验证码 */
export const sendVerificationCode = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/send_verification_code/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            throw new Error("验证码发送失败");
        }

        return await response.json();
    } catch (error) {
        console.error("❌ sendVerificationCode 失败:", error);
        throw error;
    }
};

/** ✅ 验证验证码 */
export const verifyCode = async (email, code) => {
    try {
        const response = await fetch(`${API_BASE_URL}/verify_code/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, code })
        });

        if (!response.ok) {
            throw new Error("验证码错误或已过期");
        }

        return await response.json();
    } catch (error) {
        console.error("❌ verifyCode 失败:", error);
        throw error;
    }
};

/** ✅ 注册用户 */
export const registerUser = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error("注册失败，用户可能已存在");
        }

        return await response.json();
    } catch (error) {
        console.error("❌ registerUser 失败:", error);
        throw error;
    }
};

/** ✅ 用户登录 */
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error("登录失败，请检查邮箱或密码");
        }

        return await response.json();
    } catch (error) {
        console.error("❌ loginUser 失败:", error);
        throw error;
    }
};
