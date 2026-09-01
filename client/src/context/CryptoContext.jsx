import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { deriveKey, storeKey, getStoredKey, clearKey } from '../utils/crypto';

const CryptoContext = createContext(null);

export function CryptoProvider({ children }) {
  const [aesKey, setAesKey] = useState(() => getStoredKey());
  const [keyReady, setKeyReady] = useState(() => !!getStoredKey());

  // 组件挂载时尝试从 sessionStorage 恢复密钥
  useEffect(() => {
    const stored = getStoredKey();
    if (stored) {
      setAesKey(stored);
      setKeyReady(true);
    }
  }, []);

  const unlockKey = useCallback((passphrase) => {
    const key = deriveKey(passphrase);
    storeKey(key);
    setAesKey(key);
    setKeyReady(true);
    return key;
  }, []);

  const lockKey = useCallback(() => {
    clearKey();
    setAesKey(null);
    setKeyReady(false);
  }, []);

  const value = {
    aesKey,
    keyReady,
    unlockKey,
    lockKey
  };

  return (
    <CryptoContext.Provider value={value}>
      {children}
    </CryptoContext.Provider>
  );
}

export function useCrypto() {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
}

export default CryptoContext;
