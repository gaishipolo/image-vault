import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCrypto } from '../context/CryptoContext';

export default function ProtectedRoute({ children, requireKey = false }) {
  const { isAuthenticated } = useAuth();
  const { keyReady } = useCrypto();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireKey && !keyReady) {
    return <Navigate to="/key-setup" replace />;
  }

  return children;
}
