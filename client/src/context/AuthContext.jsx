import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// 生产环境使用相对路径，开发环境使用完整地址
const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('jwt_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const verifyToken = useCallback(async (tokenToVerify) => {
    try {
      const res = await axios.get(`${API_BASE}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${tokenToVerify}` }
      });
      if (res.data.success) {
        setIsAuthenticated(true);
        setUser(res.data.data || null);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  }, [logout]);

  const login = useCallback(async (username, password) => {
    const res = await axios.post(`${API_BASE}/api/auth/login`, {
      username,
      password
    });
    if (res.data.success) {
      const { access_token } = res.data.data;
      localStorage.setItem('jwt_token', access_token);
      setToken(access_token);
      setIsAuthenticated(true);
      return res.data;
    } else {
      throw new Error(res.data.error?.message || '登录失败');
    }
  }, []);

  // 组件挂载时验证 token
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    verifyToken(token).then(() => {
      if (cancelled) return;
    });

    return () => { cancelled = true; };
  }, [token, verifyToken]);

  const value = {
    token,
    isAuthenticated,
    user,
    login,
    logout,
    verifyToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
