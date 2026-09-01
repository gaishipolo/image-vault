import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCrypto } from '../context/CryptoContext';
import { uploadImage } from '../api/images';
import { encryptImage, generateThumbnail } from '../utils/crypto';
import Layout from '../components/Layout';
import UploadForm from '../components/UploadForm';

export default function UploadPage() {
  const { isAuthenticated } = useAuth();
  const { keyReady, aesKey } = useCrypto();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState([]);

  const handleFilesSelected = useCallback((selectedFiles) => {
    setFiles(selectedFiles);
    setResults([]);
  }, []);

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress({ current: 0, total: files.length });
    setResults([]);

    const uploadResults = [];

    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      setProgress({ current: i + 1, total: files.length });

      try {
        // 1. Read file as base64 and generate thumbnail
        const base64Data = await readFileAsBase64(item.file);
        const thumbnailData = await generateThumbnail(item.file);

        // 2. Encrypt the image data and thumbnail
        const { ciphertext, iv } = encryptImage(base64Data, aesKey);
        const { ciphertext: thumbnailCiphertext, iv: thumbnailIv } = encryptImage(thumbnailData, aesKey);

        // 3. Build JSON data
        const jsonData = {
          encrypted_data: ciphertext,
          encrypted_thumbnail: thumbnailCiphertext,
          iv: iv,
          thumbnail_iv: thumbnailIv,
          original_filename: item.file.name,
          mime_type: item.file.type,
          file_size: item.file.size
        };
        if (item.description) {
          jsonData.description = item.description;
        }
        if (item.tags) {
          jsonData.tags = item.tags;
        }

        // 4. Upload
        await uploadImage(jsonData);

        uploadResults.push({
          name: item.file.name,
          success: true
        });
      } catch (err) {
        uploadResults.push({
          name: item.file.name,
          success: false,
          error: err.response?.data?.message || err.message
        });
      }
    }

    setResults(uploadResults);
    setUploading(false);

    // Clear files after upload
    const allSuccess = uploadResults.every((r) => r.success);
    if (allSuccess) {
      setFiles([]);
    }
  };

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  return (
    <Layout>
      <div className="upload-page">
        <div className="upload-header">
          <h2>上传加密图片</h2>
          <p className="text-muted">
            图片将在浏览器端加密后上传，服务器仅存储密文
          </p>
        </div>

        <div className="upload-body">
          <UploadForm
            onFilesSelected={handleFilesSelected}
            disabled={uploading}
          />

          {/* Upload button */}
          {files.length > 0 && (
            <div className="upload-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <span className="spinner" />
                    加密上传中 ({progress.current}/{progress.total})
                  </>
                ) : (
                  `加密并上传 ${files.length} 个文件`
                )}
              </button>
            </div>
          )}

          {/* Progress bar */}
          {uploading && (
            <div className="progress-wrapper">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(progress.current / progress.total) * 100}%`
                  }}
                />
              </div>
              <p className="progress-text">
                正在处理第 {progress.current} / {progress.total} 个文件...
              </p>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && !uploading && (
            <div className="upload-results animate-fade-in">
              <h4>
                上传完成：成功 {successCount}
                {failCount > 0 && `，失败 ${failCount}`}
              </h4>
              <div className="result-list">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className={`result-item ${r.success ? 'result-success' : 'result-fail'}`}
                  >
                    <span className="result-icon">
                      {r.success ? '&#10003;' : '&#10005;'}
                    </span>
                    <span className="result-name">{r.name}</span>
                    {!r.success && (
                      <span className="result-error">{r.error}</span>
                    )}
                  </div>
                ))}
              </div>
              {successCount > 0 && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/gallery')}
                >
                  查看画廊
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .upload-page {
          max-width: 720px;
          margin: 0 auto;
        }
        .upload-header {
          margin-bottom: 24px;
        }
        .upload-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
        }
        .upload-header p {
          margin-top: 4px;
          font-size: 0.9rem;
        }
        .upload-body {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .upload-actions {
          display: flex;
          justify-content: center;
        }
        .progress-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .progress-bar {
          height: 8px;
          background: var(--color-border);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--color-primary);
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .progress-text {
          text-align: center;
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }
        .upload-results {
          padding: 20px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .upload-results h4 {
          font-size: 1rem;
          margin-bottom: 12px;
        }
        .result-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }
        .result-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
        }
        .result-success {
          background: #f0fdf4;
          color: #16a34a;
        }
        .result-fail {
          background: #fef2f2;
          color: var(--color-danger);
        }
        .result-icon { font-weight: 700; }
        .result-name { font-weight: 500; }
        .result-error {
          margin-left: auto;
          font-size: 0.75rem;
          opacity: 0.8;
        }
      `}</style>
    </Layout>
  );
}
