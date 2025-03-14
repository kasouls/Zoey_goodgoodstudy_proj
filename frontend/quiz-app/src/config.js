const API_BASE_URL = 
process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000"  // ✅ 本地开发
    : "https://goodstudy-zoey.online/api";  // ✅ 生产环境 
export default API_BASE_URL;
