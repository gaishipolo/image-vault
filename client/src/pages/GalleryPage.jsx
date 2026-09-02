import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCrypto } from '../context/CryptoContext';
import { getImages, deleteImage, getImage } from '../api/images';
import { decryptImage } from '../utils/crypto';
import { toast } from '../components/Toast';
import Layout from '../components/Layout';
import ImageCard from '../components/ImageCard';

export default function GalleryPage() {
  const { isAuthenticated } = useAuth();
  const { keyReady, aesKey } = useCrypto();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [jumpToPage, setJumpToPage] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [viewerImage, setViewerImage] = useState(null);
  const [viewerLoading, setViewerLoading] = useState(false);
  const viewerClosedRef = useRef(false);

  const fetchImages = useCallback(async (searchTerm) => {
    setLoading(true);
    setError('');
    try {
      const response = await getImages({ page, limit: pageSize, search: searchTerm || undefined });
      const items = response.data?.items || response.items || [];
      setImages(items);
      setTotalPages(response.data?.pagination?.pages || response.pagination?.pages || 1);
    } catch (err) {
      setError('加载图片列表失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    if (isAuthenticated && keyReady) {
      fetchImages(search);
    }
  }, [isAuthenticated, keyReady, fetchImages, page]);

  const handleDelete = async (id) => {
    try {
      await deleteImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      toast('删除失败：' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleBatchDelete = async () => {
    if (selected.size === 0) return;
    if (!window.confirm(`确定删除选中的 ${selected.size} 张图片？`)) return;

    const ids = Array.from(selected);
    const BATCH_SIZE = 5;
    let deleted = 0;
    let failed = 0;

    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const batch = ids.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(batch.map(id => deleteImage(id)));
      deleted += results.filter(r => r.status === 'fulfilled').length;
      failed += results.filter(r => r.status === 'rejected').length;
    }

    if (failed > 0) {
      toast(`${deleted} 张删除成功，${failed} 张删除失败`, 'warning');
    } else if (deleted > 0) {
      toast(`${deleted} 张图片已删除`, 'success');
    }

    fetchImages(search);
    setSelected(new Set());
  };

  const handleSelect = (image) => {
    const id = image.id || image;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selected.size === images.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(images.map((img) => img.id)));
    }
  };

  const handleViewImage = async (image) => {
    viewerClosedRef.current = false;
    setViewerLoading(true);
    setViewerImage({ ...image, decryptedSrc: null });

    try {
      const detail = await getImage(image.id);
      const imageData = detail.data || detail;
      const decrypted = decryptImage(imageData.encrypted_data, imageData.iv, aesKey);

      if (!decrypted || decrypted.length === 0) {
        throw new Error('解密结果为空');
      }

      if (!viewerClosedRef.current) {
        setViewerImage((prev) => ({ ...prev, decryptedSrc: decrypted }));
      }
    } catch (err) {
      if (!viewerClosedRef.current) {
        setViewerImage((prev) => ({
          ...prev,
          decryptedSrc: null,
          decryptError: '解密失败: ' + err.message
        }));
      }
    } finally {
      if (!viewerClosedRef.current) {
        setViewerLoading(false);
      }
    }
  };

  const closeViewer = () => {
    viewerClosedRef.current = true;
    setViewerImage(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchImages(search);
  };

  const handleJumpToPage = (e) => {
    e.preventDefault();
    const num = parseInt(jumpToPage, 10);
    if (num >= 1 && num <= totalPages) {
      setPage(num);
      setJumpToPage('');
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
  };

  return (
    <Layout>
      <div className="gallery">
        {/* Toolbar */}
        <div className="gallery-toolbar">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              className="input search-input"
              type="text"
              placeholder="搜索文件名、描述、标签..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" type="submit">
              搜索
            </button>
          </form>

          <div className="toolbar-actions">
            {selected.size > 0 && (
              <div className="batch-actions">
                <span className="batch-count">已选 {selected.size} 项</span>
                <button className="btn btn-ghost btn-sm" onClick={handleSelectAll}>
                  {selected.size === images.length ? '取消全选' : '全选'}
                </button>
                <button className="btn btn-danger btn-sm" onClick={handleBatchDelete}>
                  批量删除
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="gallery-status">
            <div className="spinner" />
            <p>加载中...</p>
          </div>
        ) : error ? (
          <div className="gallery-status gallery-error">
            <p>{error}</p>
            <button className="btn btn-primary btn-sm" onClick={() => fetchImages(search)}>
              重试
            </button>
          </div>
        ) : images.length === 0 ? (
          <div className="gallery-status">
            <span className="empty-icon">&#128444;</span>
            <p>暂无图片</p>
            <p className="text-muted text-sm">上传你的第一张加密图片吧</p>
          </div>
        ) : (
          <div className="image-grid">
            {images.map((img) => (
              <ImageCard
                key={img.id}
                image={img}
                onSelect={handleViewImage}
                onDelete={handleDelete}
                isSelected={selected.has(img.id)}
                onToggleSelect={handleSelect}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="pagination-bar">
          <div className="page-size-selector">
            <span className="page-label">每页</span>
            <select
              className="page-select"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="page-label">条</span>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-ghost btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                上一页
              </button>
              <span className="page-info">
                {page} / {totalPages}
              </span>
              <button
                className="btn btn-ghost btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                下一页
              </button>
            </div>
          )}

          <form className="jump-form" onSubmit={handleJumpToPage}>
            <span className="page-label">跳转</span>
            <input
              className="input jump-input"
              type="number"
              min="1"
              max={totalPages}
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              placeholder="页码"
            />
            <button className="btn btn-ghost btn-sm" type="submit">
              GO
            </button>
          </form>
        </div>

        {/* Simple viewer overlay */}
        {viewerImage && (
          <div className="viewer-overlay" onClick={closeViewer}>
            <div className="viewer-card" onClick={(e) => e.stopPropagation()}>
              <div className="viewer-header">
                <h3>{viewerImage.original_filename}</h3>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={closeViewer}
                >
                  &#10005; 关闭
                </button>
              </div>
              <div className="viewer-body">
                {viewerLoading && (
                  <div className="gallery-status">
                    <div className="spinner" />
                    <p>正在解密...</p>
                  </div>
                )}
                {viewerImage.decryptedSrc && (
                  <img
                    src={viewerImage.decryptedSrc}
                    alt={viewerImage.original_filename}
                    className="viewer-img"
                  />
                )}
                {viewerImage.decryptError && (
                  <p style={{ color: 'var(--color-danger)' }}>
                    {viewerImage.decryptError}
                  </p>
                )}
              </div>
              {viewerImage.description && (
                <p className="viewer-desc">{viewerImage.description}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .gallery { display: flex; flex-direction: column; gap: 20px; }
        .gallery-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .search-form { display: flex; gap: 8px; flex: 1; max-width: 400px; }
        .search-input { flex: 1; }
        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .batch-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .batch-count { font-size: 0.85rem; color: var(--color-primary); font-weight: 600; }
        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        .gallery-status {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 20px;
          color: var(--color-text-secondary);
        }
        .gallery-error { color: var(--color-danger); }
        .empty-icon { font-size: 4rem; opacity: 0.3; }
        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding: 16px 0;
        }
        .pagination {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .page-info { font-size: 0.9rem; color: var(--color-text-secondary); }
        .page-size-selector {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .page-label {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }
        .page-select {
          padding: 4px 8px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: var(--color-surface);
          color: var(--color-text);
          font-size: 0.85rem;
          cursor: pointer;
        }
        .jump-form {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .jump-input {
          width: 60px;
          padding: 4px 8px;
          text-align: center;
        }
        /* Viewer overlay */
        .viewer-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease;
        }
        .viewer-card {
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow: auto;
        }
        .viewer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--color-border);
        }
        .viewer-header h3 {
          font-size: 1rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .viewer-body {
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }
        .viewer-img {
          max-width: 100%;
          max-height: 65vh;
          object-fit: contain;
          border-radius: var(--radius-sm);
        }
        .viewer-desc {
          padding: 0 20px 16px;
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }
        @media (max-width: 640px) {
          .image-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
          .search-form { max-width: 100%; }
        }
      `}</style>
    </Layout>
  );
}
