import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCrypto } from '../context/CryptoContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { lockKey } = useCrypto();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!window.confirm('确定退出登录？\n退出后需要重新输入加密口令。')) return;
    lockKey();
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* Top navigation bar */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <span className="brand-icon">&#128274;</span>
            <span className="brand-text">SecureVault</span>
          </div>

          <nav className="navbar-nav">
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              <span className="nav-icon">&#128444;</span>
              画廊
            </NavLink>
            <NavLink
              to="/upload"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              <span className="nav-icon">&#11014;</span>
              上传
            </NavLink>
          </nav>

          <div className="navbar-right">
            {user && <span className="user-name">{user.username}</span>}
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              退出登录
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="main-content">{children}</main>

      {/* Mobile bottom tab bar */}
      <nav className="mobile-tabbar">
        <NavLink
          to="/gallery"
          className={({ isActive }) =>
            `tab-item ${isActive ? 'tab-active' : ''}`
          }
        >
          <span className="tab-icon">&#128444;</span>
          <span className="tab-label">画廊</span>
        </NavLink>
        <NavLink
          to="/upload"
          className={({ isActive }) =>
            `tab-item ${isActive ? 'tab-active' : ''}`
          }
        >
          <span className="tab-icon">&#11014;</span>
          <span className="tab-label">上传</span>
        </NavLink>
        <button className="tab-item" onClick={handleLogout}>
          <span className="tab-icon">&#128682;</span>
          <span className="tab-label">退出</span>
        </button>
      </nav>

      <style>{`
        .layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
        }
        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--color-text);
        }
        .brand-icon { font-size: 1.3rem; }
        .navbar-nav {
          display: flex;
          gap: 4px;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: background var(--transition), color var(--transition);
        }
        .nav-link:hover {
          background: var(--color-surface-hover);
          color: var(--color-text);
          text-decoration: none;
        }
        .nav-link-active {
          background: var(--color-primary-light);
          color: var(--color-primary);
        }
        .nav-icon { font-size: 1rem; }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-name {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }
        .main-content {
          flex: 1;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          padding: 24px;
          padding-bottom: 80px; /* space for bottom tab bar */
        }

        /* Mobile bottom tab bar */
        .mobile-tabbar {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: var(--color-surface);
          border-top: 1px solid var(--color-border);
          box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
          padding: 8px 0;
          padding-bottom: max(8px, env(safe-area-inset-bottom));
        }
        .tab-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 4px;
          background: none;
          border: none;
          color: var(--color-text-secondary);
          font-size: 0.7rem;
          cursor: pointer;
          transition: color 0.2s;
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
        }
        .tab-item:active {
          background: var(--color-surface-hover);
        }
        .tab-active {
          color: var(--color-primary);
        }
        .tab-icon {
          font-size: 1.4rem;
          line-height: 1;
        }
        .tab-label {
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .navbar-inner { padding: 0 12px; }
          .user-name { display: none; }
          .brand-text { display: none; }
          .nav-link span:not(.nav-icon) { display: none; }
          .main-content {
            padding: 16px;
            padding-bottom: 80px; /* space for mobile bottom tab bar */
          }
          .mobile-tabbar {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
}
