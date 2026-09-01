import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCrypto } from '../context/CryptoContext';

function getStrength(passphrase) {
  if (!passphrase) return { level: 0, label: '', color: '' };
  let score = 0;
  if (passphrase.length >= 8) score++;
  if (passphrase.length >= 12) score++;
  if (/[A-Z]/.test(passphrase)) score++;
  if (/[0-9]/.test(passphrase)) score++;
  if (/[^A-Za-z0-9]/.test(passphrase)) score++;

  if (score <= 1) return { level: 1, label: '弱', color: '#ef4444' };
  if (score <= 3) return { level: 2, label: '中等', color: '#f59e0b' };
  return { level: 3, label: '强', color: '#22c55e' };
}

export default function KeySetupPage() {
  const { isAuthenticated } = useAuth();
  const { keyReady, unlockKey } = useCrypto();
  const navigate = useNavigate();

  const [passphrase, setPassphrase] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (keyReady) {
    return <Navigate to="/gallery" replace />;
  }

  const strength = getStrength(passphrase);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!passphrase) {
      setError('请输入加密口令');
      return;
    }
    if (passphrase.length < 6) {
      setError('口令长度至少 6 个字符');
      return;
    }
    if (passphrase !== confirm) {
      setError('两次输入的口令不一致');
      return;
    }

    setLoading(true);
    // Key derivation is synchronous but may feel slow on weak devices
    setTimeout(() => {
      try {
        unlockKey(passphrase);
        navigate('/gallery');
      } catch {
        setError('密钥生成失败，请重试');
      } finally {
        setLoading(false);
      }
    }, 50);
  };

  return (
    <div className="key-page">
      <div className="key-card animate-fade-in">
        <div className="key-header">
          <span className="key-icon">&#128273;</span>
          <h1 className="key-title">设置加密口令</h1>
          <p className="key-desc">
            请设置加密口令，用于派生 AES-256 密钥保护您的图片数据。
            <br />
            <strong style={{ color: '#ef4444' }}>⚠ 忘记口令将无法恢复已加密的图片，请妥善保管！</strong>
            <br />
            口令仅保存在本地浏览器中，不会发送到服务器。
          </p>
        </div>

        <form className="key-form" onSubmit={handleSubmit}>
          {error && <div className="key-error">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="passphrase">
              加密口令
            </label>
            <input
              id="passphrase"
              className="input"
              type="password"
              placeholder="请输入加密口令（至少 6 个字符）"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              autoFocus
            />
            {/* Strength indicator */}
            {passphrase && (
              <div className="strength-bar-wrapper">
                <div className="strength-bar">
                  {[1, 2, 3].map((lvl) => (
                    <div
                      key={lvl}
                      className="strength-segment"
                      style={{
                        background:
                          strength.level >= lvl ? strength.color : '#e2e8f0'
                      }}
                    />
                  ))}
                </div>
                <span
                  className="strength-label"
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm">
              确认口令
            </label>
            <input
              id="confirm"
              className="input"
              type="password"
              placeholder="请再次输入口令"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
                正在生成密钥...
              </>
            ) : (
              '解锁并进入'
            )}
          </button>
        </form>
      </div>

      <style>{`
        .key-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(135deg, #ede9fe 0%, #f8fafc 50%, #e0e7ff 100%);
        }
        .key-card {
          width: 100%;
          max-width: 440px;
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 40px 32px;
        }
        .key-header { text-align: center; margin-bottom: 28px; }
        .key-icon { font-size: 3rem; display: block; margin-bottom: 8px; }
        .key-title { font-size: 1.5rem; font-weight: 700; color: var(--color-text); }
        .key-desc {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          margin-top: 8px;
          line-height: 1.6;
        }
        .key-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-label { font-size: 0.85rem; font-weight: 600; color: var(--color-text); }
        .key-error {
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: var(--radius-sm);
          color: var(--color-danger);
          font-size: 0.85rem;
          text-align: center;
        }
        .strength-bar-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }
        .strength-bar {
          flex: 1;
          display: flex;
          gap: 4px;
        }
        .strength-segment {
          flex: 1;
          height: 4px;
          border-radius: 2px;
          transition: background 0.3s ease;
        }
        .strength-label {
          font-size: 0.75rem;
          font-weight: 600;
          flex-shrink: 0;
        }
        @media (max-width: 480px) {
          .key-card { padding: 32px 20px; }
        }
      `}</style>
    </div>
  );
}
