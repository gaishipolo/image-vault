import { useState, useCallback } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { getImage } from '../api/images';
import { decryptImage } from '../utils/crypto';

/**
 * 图片解密 Hook
 * 用于获取并解密单张图片
 */
export function useImageDecrypt() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { aesKey } = useCrypto();

  /**
   * 解密图片
   * @param {number} imageId - 图片 ID
   * @returns {Promise<string|null>} - 解密后的 data URL，失败返回 null
   */
  const decrypt = useCallback(
    async (imageId) => {
      if (!aesKey) {
        setError('未设置加密口令');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getImage(imageId);
        const imageData = response.data || response;
        const { encrypted_data, iv, mime_type } = imageData;

        const base64Data = decryptImage(encrypted_data, iv, aesKey);
        const dataUrl = `data:${mime_type};base64,${base64Data}`;

        return dataUrl;
      } catch (err) {
        console.error('解密图片失败:', err);
        setError('图片解密失败，请检查加密口令是否正确');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [aesKey]
  );

  /**
   * 批量解密图片
   * @param {number[]} imageIds - 图片 ID 数组
   * @returns {Promise<Map<number, string>>} - imageId -> dataUrl 的映射
   */
  const decryptBatch = useCallback(
    async (imageIds) => {
      if (!aesKey) {
        setError('未设置加密口令');
        return new Map();
      }

      setLoading(true);
      setError(null);

      const results = new Map();

      try {
        await Promise.all(
          imageIds.map(async (id) => {
            try {
              const response = await getImage(id);
              const imageData = response.data || response;
              const { encrypted_data, iv, mime_type } = imageData;

              const base64Data = decryptImage(encrypted_data, iv, aesKey);
              const dataUrl = `data:${mime_type};base64,${base64Data}`;

              results.set(id, dataUrl);
            } catch (err) {
              console.error(`解密图片 ${id} 失败:`, err);
            }
          })
        );
      } catch (err) {
        console.error('批量解密失败:', err);
        setError('批量解密失败');
      } finally {
        setLoading(false);
      }

      return results;
    },
    [aesKey]
  );

  /**
   * 清除错误状态
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    decrypt,
    decryptBatch,
    loading,
    error,
    clearError,
  };
}

export default useImageDecrypt;
