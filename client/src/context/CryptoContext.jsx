import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { deriveKey, getKeyHash, storeKey, getStoredKey, clearKey } from '../utils/crypto';

const CryptoContext = createContext(null);

export function CryptoProvider({ children }) {
  const [aesKey, setAesKey] = useState(() => getStoredKey());
  const [keyHash, setKeyHash] = useState(() => {
    const key = getStoredKey();
    return key ? getKeyHash(key) : null;
  });
  const [keyReady, setKeyReady] = useState(() => !!getStoredKey());

  // 组件挂载时尝试从 sessionStorage 恢复密钥
  useEffect(() => {
    const stored = getStoredKey();
    if (stored) {
      setAesKey(stored);
      setKeyHash(getKeyHash(stored));
      setKeyReady(true);
    }
  }, []);

  const unlockKey = useCallback((passphrase) => {
    const key = deriveKey(passphrase);
    storeKey(key);
    setAesKey(key);
    setKeyHash(getKeyHash(key));
    setKeyReady(true);
    return key;
  }, []);

  const lockKey = useCallback(() => {
    clearKey();
    setAesKey(null);
    setKeyHash(null);
    setKeyReady(false);
  }, []);

  const value = {
    aesKey,
    keyHash,
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
