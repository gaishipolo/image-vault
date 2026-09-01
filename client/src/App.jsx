import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CryptoProvider } from './context/CryptoContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/global.css';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const KeySetupPage = lazy(() => import('./pages/KeySetupPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));

// ========== App 根组件 ==========

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/key-setup" element={
        <ProtectedRoute><KeySetupPage /></ProtectedRoute>
      } />
      <Route path="/gallery" element={
        <ProtectedRoute requireKey><GalleryPage /></ProtectedRoute>
      } />
      <Route path="/upload" element={
        <ProtectedRoute requireKey><UploadPage /></ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <CryptoProvider>
              <Suspense fallback={<div className="page-loading"><div className="spinner" /></div>}>
                <AppRoutes />
              </Suspense>
            </CryptoProvider>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}
