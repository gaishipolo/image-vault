import CryptoJS from 'crypto-js';

const SALT = 'your-app-level-salt-change-in-production'; // 32+ 字符随机字符串
const ITERATIONS = 100000;

// 从口令派生密钥（PBKDF2）
export function deriveKey(passphrase) {
  return CryptoJS.PBKDF2(passphrase, SALT, {
    keySize: 256 / 32,
    iterations: ITERATIONS,
    hasher: CryptoJS.algo.SHA256
  });
}

// 计算密钥哈希（用于后端过滤）
export function getKeyHash(key) {
  return CryptoJS.SHA256(key.toString()).toString(CryptoJS.enc.Hex);
}

// 存储/获取密钥到 sessionStorage
export function storeKey(key) {
  sessionStorage.setItem('aes_key', key.toString(CryptoJS.enc.Hex));
}

export function getStoredKey() {
  const hex = sessionStorage.getItem('aes_key');
  if (!hex) return null;
  return CryptoJS.enc.Hex.parse(hex);
}

export function clearKey() {
  sessionStorage.removeItem('aes_key');
}

// 生成缩略图
export function generateThumbnail(file, maxWidth = 200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('图片加载失败'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.5));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// WebP 无损压缩
function compressToWebPLossless(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('WebP 压缩失败'));
        }
      }, 'image/webp', 1.0);
    };

    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = URL.createObjectURL(file);
  });
}

// 读取 Blob 为 base64 data URL
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('读取失败'));
    reader.readAsDataURL(blob);
  });
}

// 智能压缩：根据原图格式选择策略
export async function smartCompress(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  // PNG/BMP/TIFF → WebP 无损压缩（体积减小 25-80%）
  if (['png', 'bmp', 'tiff', 'tif'].includes(ext)) {
    const compressed = await compressToWebPLossless(file);
    return {
      data: await blobToBase64(compressed),
      mime_type: 'image/webp',
      original_size: file.size,
      compressed_size: compressed.size,
      ratio: ((1 - compressed.size / file.size) * 100).toFixed(1)
    };
  }

  // JPEG/WebP/GIF → 保持原样（已是压缩格式）
  return {
    data: await blobToBase64(file),
    mime_type: file.type || 'image/jpeg',
    original_size: file.size,
    compressed_size: file.size,
    ratio: 0
  };
}

// 加密图片（AES-256-CBC）
export function encryptImage(base64Data, key) {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(base64Data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return {
    ciphertext: encrypted.toString(),
    iv: iv.toString(CryptoJS.enc.Hex)
  };
}

// 解密图片
export function decryptImage(base64Ciphertext, ivHex, key) {
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const ciphertext = CryptoJS.enc.Base64.parse(base64Ciphertext);
  const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });
  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// Web Worker 解密（非主线程）
export function decryptWithWorker(encryptedData, ivHex, keyHex) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./decrypt.worker.js', import.meta.url));
    const id = Date.now();

    worker.postMessage({ encryptedData, ivHex, keyHex, id });

    worker.onmessage = (e) => {
      if (e.data.success) {
        resolve(e.data.data);
      } else {
        reject(new Error(e.data.error));
      }
      worker.terminate();
    };

    worker.onerror = (err) => {
      reject(new Error('Worker error: ' + err.message));
      worker.terminate();
    };

    // 超时处理
    setTimeout(() => {
      worker.terminate();
      reject(new Error('Decryption timeout'));
    }, 30000);
  });
}
