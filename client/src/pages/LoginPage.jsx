import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/key-setup" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      navigate('/key-setup');
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.message ||
        '登录失败，请检查用户名和密码';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-fade-in">
        <div className="login-header">
          <span className="login-logo">&#128274;</span>
          <h1 className="login-title">SecureVault</h1>
          <p className="login-subtitle">图片管理系统</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="username">
              用户名
            </label>
            <input
              id="username"
              className={`input ${error ? 'input-error' : ''}`}
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              密码
            </label>
            <input
              id="password"
              className={`input ${error ? 'input-error' : ''}`}
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            className="btn btn-primary btn-lg w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                登录中...
              </>
            ) : (
              '登录'
            )}
          </button>
        </form>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 50%, #ede9fe 100%);
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 40px 32px;
        }
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .login-logo { font-size: 3rem; display: block; margin-bottom: 8px; }
        .login-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--color-text);
        }
        .login-subtitle {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          margin-top: 4px;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text);
        }
        .login-error {
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: var(--radius-sm);
          color: var(--color-danger);
          font-size: 0.85rem;
          text-align: center;
        }
        @media (max-width: 480px) {
          .login-card { padding: 32px 20px; }
        }
      `}</style>
    </div>
  );
}
