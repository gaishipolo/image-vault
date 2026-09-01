import client from './client';

// 获取图片列表
export async function getImages(params = {}) {
  const res = await client.get('/api/images', { params });
  return res.data;
}

// 获取单张图片详情
export async function getImage(imageId) {
  const res = await client.get(`/api/images/${imageId}`);
  return res.data;
}

// 上传加密图片
export async function uploadImage(imageData) {
  const res = await client.post('/api/images/upload', imageData, {
    timeout: 60000 // 上传超时设长一些
  });
  return res.data;
}

// 删除图片
export async function deleteImage(imageId) {
  const res = await client.delete(`/api/images/${imageId}`);
  return res.data;
}

// 获取图片元数据
export async function getImageMeta(imageId) {
  const res = await client.get(`/api/images/${imageId}/meta`);
  return res.data;
}
