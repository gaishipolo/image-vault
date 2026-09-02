/**
 * 图片解密缓存
 * 使用 LRU 策略缓存已解密的图片 data URL
 */

const MAX_CACHE_SIZE = 50;
const cache = new Map(); // imageId -> { dataUrl, timestamp }

/**
 * 获取缓存的图片
 * @param {number} imageId
 * @returns {string|null} dataUrl 或 null
 */
export function getCachedImage(imageId) {
  const entry = cache.get(imageId);
  if (entry) {
    // 移到最后（LRU）
    cache.delete(imageId);
    cache.set(imageId, { ...entry, timestamp: Date.now() });
    return entry.dataUrl;
  }
  return null;
}

/**
 * 缓存解密后的图片
 * @param {number} imageId
 * @param {string} dataUrl
 */
export function setCachedImage(imageId, dataUrl) {
  // 如果已存在，先删除
  if (cache.has(imageId)) {
    cache.delete(imageId);
  }

  // 超出容量时淘汰最旧的
  while (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }

  cache.set(imageId, { dataUrl, timestamp: Date.now() });
}

/**
 * 删除指定图片的缓存
 * @param {number} imageId
 */
export function removeCachedImage(imageId) {
  cache.delete(imageId);
}

/**
 * 清空所有缓存（登出时调用）
 */
export function clearImageCache() {
  cache.clear();
}

/**
 * 获取缓存状态
 * @returns {{ size: number, maxSize: number }}
 */
export function getCacheStats() {
  return {
    size: cache.size,
    maxSize: MAX_CACHE_SIZE,
  };
}
