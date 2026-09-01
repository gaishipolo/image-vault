import client from './client';

// 用户登录
export async function login(username, password) {
  const res = await client.post('/api/auth/login', { username, password });
  return res.data;
}

// 验证 token
export async function verifyToken() {
  const res = await client.get('/api/auth/verify');
  return res.data;
}
