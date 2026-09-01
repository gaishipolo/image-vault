import { useState, useEffect, useCallback, useRef } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { getImage } from '../api/images';
import { decryptImage } from '../utils/crypto';
import './ImageViewer.css';

/**
 * 图片查看器组件
 * 功能：放大/缩小、旋转、翻转、全屏、幻灯片模式、触摸手势
 */
export default function ImageViewer({ images, currentIndex, onClose }) {
  const [index, setIndex] = useState(currentIndex);
  const [thumbPage, setThumbPage] = useState(0);
  const THUMBS_PER_PAGE = 10;
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [slideshow, setSlideshow] = useState(false);
  const [decryptedSrc, setDecryptedSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { aesKey } = useCrypto();

  const currentImage = images[index];

  // Touch gesture refs
  const touchStartRef = useRef({ x: 0, y: 0 });
  const touchEndRef = useRef({ x: 0, y: 0 });

  // Touch event handlers
  const handleTouchStart = useCallback((e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchEndRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  }, []);

  const handleTouchEnd = useCallback(() => {
    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;
    const minSwipeDistance = 50;

    // Horizontal swipe distance greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right - previous image
        setIndex((i) => (i - 1 + images.length) % images.length);
      } else {
        // Swipe left - next image
        setIndex((i) => (i + 1) % images.length);
      }
    }

    // Reset
    touchEndRef.current = { x: 0, y: 0 };
  }, [images.length]);

  // 解密当前图片
  useEffect(() => {
    if (!currentImage || !aesKey) return;

    let cancelled = false;

    const loadAndDecrypt = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getImage(currentImage.id);
        const imageData = response.data || response;
        const { encrypted_data, iv, mime_type } = imageData;

        const base64Data = decryptImage(encrypted_data, iv, aesKey);

        if (!cancelled) {
          setDecryptedSrc(`data:${mime_type};base64,${base64Data}`);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('解密图片失败:', err);
          setError('图片解密失败，请检查加密口令是否正确');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAndDecrypt();

    return () => { cancelled = true; };
  }, [index, currentImage, aesKey]);

  // 幻灯片定时器
  useEffect(() => {
    if (!slideshow) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slideshow, images.length]);

  // 重置变换参数（切换图片时）
  useEffect(() => {
    setScale(1);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    // 同步缩略图分页，确保当前图片可见
    setThumbPage(Math.floor(index / THUMBS_PER_PAGE));
  }, [index]);

  // 键盘快捷键
  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setIndex((i) => (i - 1 + images.length) % images.length);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setIndex((i) => (i + 1) % images.length);
          break;
        case '+':
        case '=':
          e.preventDefault();
          setScale((s) => Math.min(s + 0.25, 5));
          break;
        case '-':
          e.preventDefault();
          setScale((s) => Math.max(s - 0.25, 0.25));
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setRotation((r) => (r + 90) % 360);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          setSlideshow((s) => !s);
          break;
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;
        default:
          break;
      }
    },
    [images.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 全屏切换
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  };

  // 关闭查看器
  const handleClose = () => {
    setSlideshow(false);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onClose();
  };

  // 上一张/下一张
  const goToPrev = () => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setIndex((i) => (i + 1) % images.length);
  };

  // 计算图片变换样式
  const transform = `scale(${scale}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`;

  if (!currentImage) return null;

  return (
    <div
      className="viewer-overlay"
      onClick={handleClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 工具栏 */}
      <div className="viewer-toolbar" onClick={(e) => e.stopPropagation()}>
        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => setScale((s) => Math.min(s + 0.25, 5))}
            title="放大 (+)"
          >
            🔍+
          </button>
          <button
            className="toolbar-btn"
            onClick={() => setScale((s) => Math.max(s - 0.25, 0.25))}
            title="缩小 (-)"
          >
            🔍-
          </button>
          <button
            className="toolbar-btn"
            onClick={() => setScale(1)}
            title="重置缩放"
          >
            ↺
          </button>
        </div>

        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            title="旋转 (R)"
          >
            🔄
          </button>
          <button
            className="toolbar-btn"
            onClick={() => setFlipH((h) => !h)}
            title="水平翻转"
          >
            ↔
          </button>
          <button
            className="toolbar-btn"
            onClick={() => setFlipV((v) => !v)}
            title="垂直翻转"
          >
            ↕
          </button>
        </div>

        <div className="toolbar-group">
          <button
            className={`toolbar-btn ${slideshow ? 'active' : ''}`}
            onClick={() => setSlideshow((s) => !s)}
            title="幻灯片 (S)"
          >
            {slideshow ? '⏸' : '▶'}
          </button>
          <button
            className="toolbar-btn"
            onClick={toggleFullscreen}
            title="全屏 (F)"
          >
            ⛶
          </button>
        </div>

        <div className="toolbar-info">
          <span className="image-counter">
            {index + 1} / {images.length}
          </span>
          <span className="image-name">{currentImage.original_filename}</span>
          <span className="scale-info">{Math.round(scale * 100)}%</span>
        </div>

        <button
          className="toolbar-btn close-btn"
          onClick={handleClose}
          title="关闭 (ESC)"
        >
          ✕
        </button>
      </div>

      {/* 导航按钮 */}
      <button
        className="nav-btn nav-prev"
        onClick={(e) => {
          e.stopPropagation();
          goToPrev();
        }}
        title="上一张 (←)"
      >
        ‹
      </button>

      <button
        className="nav-btn nav-next"
        onClick={(e) => {
          e.stopPropagation();
          goToNext();
        }}
        title="下一张 (→)"
      >
        ›
      </button>

      {/* 图片容器 */}
      <div className="viewer-content" onClick={(e) => e.stopPropagation()}>
        {loading && (
          <div className="viewer-loading">
            <div className="spinner"></div>
            <p>正在解密图片...</p>
          </div>
        )}

        {error && (
          <div className="viewer-error">
            <p>❌ {error}</p>
          </div>
        )}

        {decryptedSrc && !loading && (
          <img
            src={decryptedSrc}
            alt={currentImage.original_filename}
            className="viewer-image"
            style={{ transform }}
            draggable={false}
          />
        )}
      </div>

      {/* 缩略图栏 */}
      <div className="viewer-thumbnails" onClick={(e) => e.stopPropagation()}>
        {thumbPage > 0 && (
          <button className="thumb-nav" onClick={() => setThumbPage(p => p - 1)}>&lsaquo;</button>
        )}
        {images.slice(thumbPage * THUMBS_PER_PAGE, (thumbPage + 1) * THUMBS_PER_PAGE).map((img, i) => {
          const actualIndex = thumbPage * THUMBS_PER_PAGE + i;
          return (
            <div
              key={img.id}
              className={`thumbnail-item ${actualIndex === index ? 'active' : ''}`}
              onClick={() => setIndex(actualIndex)}
            >
              <span className="thumbnail-index">{actualIndex + 1}</span>
            </div>
          );
        })}
        {(thumbPage + 1) * THUMBS_PER_PAGE < images.length && (
          <button className="thumb-nav" onClick={() => setThumbPage(p => p + 1)}>&rsaquo;</button>
        )}
      </div>
    </div>
  );
}
