# 加密架构设计

## 核心安全原则
1. **前端加密**：图片在离开浏览器前已加密，后端只存储密文
2. **密钥不传输**：原始 AES 密钥永不以明文形式传输或存储
3. **密码派生密钥**：主密钥从管理员密码派生，不直接存储
4. **唯一加密**：每张图片使用独立的 AES 密钥

## 密钥管理架构

### 密钥层次
```
管理员密码
    │
    ▼ (PBKDF2 + Salt)
主密钥 (Master Key)
    │
    ▼ (AES 加密)
每张图片的 AES 密钥
    │
    ▼ (AES-GCM 加密)
加密的图片数据
```

### 密钥派生流程

**初始化阶段（管理员设置密码时）：**
1. 生成随机 salt（32字节）
2. 使用 PBKDF2 从密码派生主密钥
   - 算法：PBKDF2-HMAC-SHA256
   - 迭代次数：100,000
   - 输出长度：256位（32字节）
3. 将 salt 存储在数据库 admin 表中

**图片加密流程（上传时）：**
1. 生成随机 AES-256 密钥（32字节）
2. 生成随机 IV（12字节，用于 AES-GCM）
3. 使用 AES-GCM 加密图片数据
4. 使用主密钥 AES-GCM 加密 AES 密钥
5. 将以下数据发送到后端：
   - 加密的图片数据
   - 加密的 AES 密钥
   - IV

**图片解密流程（查看时）：**
1. 从后端获取加密数据
2. 从管理员密码派生主密钥
3. 使用主密钥解密 AES 密钥
4. 使用 AES 密钥 + IV 解密图片数据
5. 在前端显示解密后的图片

## 前端加密实现

### CryptoJS 配置
```javascript
// 加密配置
const encryptionConfig = {
  keySize: 256 / 32,      // 256位密钥
  ivSize: 128 / 32,       // 128位IV
  mode: CryptoJS.mode.GCM, // GCM模式
  padding: CryptoJS.pad.NoPadding // GCM不需要填充
};
```

### 关键函数
1. `deriveMasterKey(password, salt)` - 从密码派生主密钥
2. `generateImageKey()` - 生成随机图片密钥
3. `encryptImage(imageData, imageKey, iv)` - 加密图片
4. `encryptKey(imageKey, masterKey)` - 加密图片密钥
5. `decryptKey(encryptedKey, masterKey)` - 解密图片密钥
6. `decryptImage(encryptedData, imageKey, iv)` - 解密图片

## 安全考虑

### 传输安全
- 使用 HTTPS 加密所有 API 通信
- JWT token 设置合理的过期时间
- 敏感操作需要重新验证密码

### 存储安全
- 管理员密码使用 bcrypt 哈希存储
- 加密 salt 与密码哈希分开存储
- 数据库定期备份，备份也需加密

### 会话安全
- JWT token 存储在 httpOnly cookie 或 localStorage
- 登出时清除本地存储的密钥
- 自动锁定：闲置超过一定时间需重新输入密码

### 密码变更
当管理员更改密码时：
1. 使用旧密码派生旧主密钥
2. 使用新密码派生新主密钥
3. 遍历所有图片，用旧主密钥解密 AES 密钥，用新主密钥重新加密
4. 更新数据库中的加密密钥和 salt

## 性能优化

### 大文件处理
- 使用 Web Workers 进行加密/解密，避免阻塞主线程
- 分块加密：将大图片分成多个块分别加密
- 流式处理：支持进度回调

### 缓存策略
- 解密后的图片可临时缓存在内存中
- 使用 IndexedDB 存储解密的缩略图（可选）
- 缓存需设置过期时间，定期清理

## 浏览器兼容性
- CryptoJS 支持所有现代浏览器
- Web Workers 用于后台加密
- ArrayBuffer 用于处理二进制数据
