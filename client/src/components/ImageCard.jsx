import { useState, useEffect } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { decryptImage } from '../utils/crypto';

export default function ImageCard({ image, onSelect, onDelete, isSelected, onToggleSelect }) {
  const { aesKey } = useCrypto();
  const [thumbnailSrc, setThumbnailSrc] = useState(null);

  useEffect(() => {
    if (image.encrypted_thumbnail && image.thumbnail_iv && aesKey) {
      try {
        const decrypted = decryptImage(image.encrypted_thumbnail, image.thumbnail_iv, aesKey);
        setThumbnailSrc(decrypted);
      } catch {
        setThumbnailSrc(null);
      }
    }
  }, [image.encrypted_thumbnail, image.thumbnail_iv, aesKey]);

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`确定删除 "${image.original_filename}" 吗？`)) {
      onDelete(image.id);
    }
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    if (onToggleSelect) {
      onToggleSelect(image);
    }
  };

  return (
    <div
      className={`image-card ${isSelected ? 'image-card-selected' : ''}`}
      onClick={() => onSelect(image)}
    >
      {/* Checkbox for batch select */}
      <div className="card-checkbox">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Encrypted placeholder / thumbnail */}
      <div className="card-thumb">
        {thumbnailSrc ? (
          <img src={thumbnailSrc} alt="" className="thumb-image" />
        ) : (
          <div className="thumb-placeholder">
            <span className="thumb-icon">&#128274;</span>
            <span className="thumb-label">已加密</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="card-info">
        <p className="card-filename" title={image.original_filename}>
          {image.original_filename}
        </p>
        <div className="card-meta">
          <span>{formatSize(image.file_size)}</span>
          <span>{formatDate(image.created_at)}</span>
        </div>
        {image.tags && (
          <div className="card-tags">
            {image.tags.split(',').map((tag) => (
              <span key={tag.trim()} className="badge">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Delete button */}
      <button className="card-delete" onClick={handleDelete} title="删除">
        &#10005;
      </button>

      <style>{`
        .image-card {
          position: relative;
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: border-color var(--transition), box-shadow var(--transition),
            transform 0.15s ease;
        }
        .image-card:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .image-card-selected {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px var(--color-primary-light);
        }
        .card-checkbox {
          position: absolute;
          top: 8px;
          left: 8px;
          z-index: 2;
        }
        .card-checkbox input {
          width: 18px;
          height: 18px;
          accent-color: var(--color-primary);
          cursor: pointer;
        }
        .card-thumb {
          aspect-ratio: 4 / 3;
          background: linear-gradient(135deg, #e0e7ff 0%, #f1f5f9 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .thumb-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .thumb-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: var(--color-text-muted);
        }
        .thumb-icon { font-size: 2.5rem; opacity: 0.6; }
        .thumb-label { font-size: 0.75rem; font-weight: 500; }
        .card-info {
          padding: 12px;
        }
        .card-filename {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 4px;
        }
        .card-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 8px;
        }
        .card-delete {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 2;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.85);
          color: #fff;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity var(--transition);
        }
        .image-card:hover .card-delete {
          opacity: 1;
        }
        .card-delete:hover {
          background: var(--color-danger);
        }
      `}</style>
    </div>
  );
}
