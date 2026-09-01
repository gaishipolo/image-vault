import axios from 'axios';

// 生产环境使用相对路径，开发环境使用完整地址
const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器：自动添加 JWT token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：处理 401 错误（自动登出）
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // token 过期或无效，清除本地存储
      localStorage.removeItem('jwt_token');
      sessionStorage.removeItem('aes_key');
      // 如果不在登录页，则跳转到登录页
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
