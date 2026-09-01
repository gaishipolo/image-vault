import { useState, useCallback, useEffect } from 'react';
import { getImages, deleteImage } from '../api/images';

/**
 * 图片列表 Hook
 * 用于获取和管理图片列表
 */
export function useImages(options = {}) {
  const {
    page: initialPage = 1,
    limit: initialLimit = 20,
    sort: initialSort = 'created_at',
    order: initialOrder = 'desc',
    autoFetch = true,
  } = options;

  const [images, setImages] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 获取图片列表
   */
  const fetchImages = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await getImages({
          page: params.page || pagination.page,
          limit: params.limit || pagination.limit,
          sort: params.sort || initialSort,
          order: params.order || initialOrder,
        });

        // 修复：正确解析响应结构
        const items = response.data?.items || response.items || [];
        const paginationData = response.data?.pagination || response.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
        };

        setImages(items);
        setPagination(paginationData);
      } catch (err) {
        console.error('获取图片列表失败:', err);
        setError('获取图片列表失败');
        setImages([]);
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.limit, initialSort, initialOrder]
  );

  /**
   * 删除图片
   */
  const removeImage = useCallback(
    async (imageId) => {
      try {
        await deleteImage(imageId);
        // 重新获取列表
        await fetchImages();
        return true;
      } catch (err) {
        console.error('删除图片失败:', err);
        setError('删除图片失败');
        return false;
      }
    },
    [fetchImages]
  );

  /**
   * 批量删除图片
   */
  const removeImages = useCallback(
    async (imageIds) => {
      try {
        const BATCH_SIZE = 5;
        for (let i = 0; i < imageIds.length; i += BATCH_SIZE) {
          const batch = imageIds.slice(i, i + BATCH_SIZE);
          await Promise.all(batch.map((id) => deleteImage(id)));
        }
        // 重新获取列表
        await fetchImages();
        return true;
      } catch (err) {
        console.error('批量删除图片失败:', err);
        setError('批量删除图片失败');
        return false;
      }
    },
    [fetchImages]
  );

  /**
   * 切换页码
   */
  const goToPage = useCallback(
    (newPage) => {
      setPagination((prev) => ({ ...prev, page: newPage }));
      fetchImages({ page: newPage });
    },
    [fetchImages]
  );

  /**
   * 切换每页数量
   */
  const setLimit = useCallback(
    (newLimit) => {
      setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
      fetchImages({ limit: newLimit, page: 1 });
    },
    [fetchImages]
  );

  /**
   * 清除错误
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 自动获取
  useEffect(() => {
    if (autoFetch) {
      fetchImages();
    }
  }, [autoFetch, fetchImages]);

  return {
    images,
    pagination,
    loading,
    error,
    fetchImages,
    removeImage,
    removeImages,
    goToPage,
    setLimit,
    clearError,
  };
}

export default useImages;
