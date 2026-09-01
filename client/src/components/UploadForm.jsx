import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_TYPES = {
  'image/jpeg': [],
  'image/png': [],
  'image/gif': [],
  'image/webp': [],
  'image/bmp': []
};

export default function UploadForm({ onFilesSelected, disabled }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const urlsRef = useRef([]);

  useEffect(() => {
    return () => {
      // 组件卸载时释放所有预览 URL
      urlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setError('');

      if (rejectedFiles.length > 0) {
        const reasons = rejectedFiles.map((f) => {
          const errs = f.errors.map((e) => e.message).join(', ');
          return `${f.file.name}: ${errs}`;
        });
        setError(reasons.join('\n'));
        return;
      }

      const newFiles = acceptedFiles.map((file) => {
        const preview = URL.createObjectURL(file);
        urlsRef.current.push(preview);
        return {
          file,
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          preview,
          description: '',
          tags: ''
        };
      });

      setFiles((prev) => {
        const updated = [...prev, ...newFiles];
        onFilesSelected(updated);
        return updated;
      });
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
    disabled
  });

  const removeFile = (id) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      const updated = prev.filter((f) => f.id !== id);
      onFilesSelected(updated);
      return updated;
    });
  };

  const updateFileMeta = (id, field, value) => {
    setFiles((prev) => {
      const updated = prev.map((f) =>
        f.id === id ? { ...f, [field]: value } : f
      );
      onFilesSelected(updated);
      return updated;
    });
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="upload-form">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${disabled ? 'dropzone-disabled' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <span className="dropzone-icon">&#128228;</span>
          {isDragActive ? (
            <p className="dropzone-text">松开鼠标，文件将被添加...</p>
          ) : (
            <>
              <p className="dropzone-text">
                拖拽图片到此处，或点击选择文件
              </p>
              <p className="dropzone-hint">
                支持 JPG / PNG / GIF / WebP / BMP，最大 50MB
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="upload-error">
          <pre>{error}</pre>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="file-list">
          <h4 className="file-list-title">已选择 {files.length} 个文件</h4>
          {files.map((item) => (
            <div key={item.id} className="file-item">
              <img
                src={item.preview}
                alt={item.file.name}
                className="file-preview"
              />
              <div className="file-details">
                <p className="file-name">{item.file.name}</p>
                <p className="file-size">{formatSize(item.file.size)}</p>
                <input
                  className="input file-meta-input"
                  placeholder="添加描述（可选）"
                  value={item.description}
                  onChange={(e) =>
                    updateFileMeta(item.id, 'description', e.target.value)
                  }
                  disabled={disabled}
                />
                <input
                  className="input file-meta-input"
                  placeholder="标签，用逗号分隔（可选）"
                  value={item.tags}
                  onChange={(e) =>
                    updateFileMeta(item.id, 'tags', e.target.value)
                  }
                  disabled={disabled}
                />
              </div>
              <button
                className="file-remove"
                onClick={() => removeFile(item.id)}
                disabled={disabled}
                title="移除"
              >
                &#10005;
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .upload-form { display: flex; flex-direction: column; gap: 20px; }
        .dropzone {
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-lg);
          padding: 48px 24px;
          text-align: center;
          cursor: pointer;
          transition: border-color var(--transition), background var(--transition);
        }
        .dropzone:hover { border-color: var(--color-primary); background: var(--color-primary-light); }
        .dropzone-active { border-color: var(--color-primary); background: var(--color-primary-light); }
        .dropzone-disabled { opacity: 0.5; cursor: not-allowed; }
        .dropzone-content { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .dropzone-icon { font-size: 3rem; opacity: 0.5; }
        .dropzone-text { font-size: 1rem; color: var(--color-text); font-weight: 500; }
        .dropzone-hint { font-size: 0.8rem; color: var(--color-text-muted); }
        .upload-error {
          padding: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: var(--radius-sm);
          color: var(--color-danger);
          font-size: 0.85rem;
        }
        .upload-error pre { white-space: pre-wrap; margin: 0; }
        .file-list { display: flex; flex-direction: column; gap: 12px; }
        .file-list-title { font-size: 0.95rem; color: var(--color-text); }
        .file-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
        }
        .file-preview {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          flex-shrink: 0;
        }
        .file-details { flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .file-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .file-size { font-size: 0.75rem; color: var(--color-text-muted); }
        .file-meta-input { padding: 6px 10px; font-size: 0.8rem; }
        .file-remove {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
          font-size: 0.85rem;
          transition: background var(--transition), color var(--transition);
        }
        .file-remove:hover { background: #fef2f2; color: var(--color-danger); }
      `}</style>
    </div>
  );
}
