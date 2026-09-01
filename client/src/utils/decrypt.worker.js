// Web Worker for image decryption
// Moves CPU-intensive decryption off the main thread

importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js');

self.onmessage = function(e) {
  const { encryptedData, ivHex, keyHex, id } = e.data;

  try {
    const key = CryptoJS.enc.Hex.parse(keyHex);
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const ciphertext = CryptoJS.enc.Base64.parse(encryptedData);
    const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const result = decrypted.toString(CryptoJS.enc.Utf8);
    self.postMessage({ id, success: true, data: result });
  } catch (error) {
    self.postMessage({ id, success: false, error: error.message });
  }
};
