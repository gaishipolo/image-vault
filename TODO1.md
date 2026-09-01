# Image Vault 待办事项清单（第二次审查）

> 基于最新代码状态审查生成（2026-09-01）。
> 每完成一项请将 `[ ]` 改为 `[x]`。
> 已排除项：加密盐值（单管理员可接受）、AES 完整性（需迁移到 Web Crypto API）、CSS Modules（当前规模不需要）。

---

## ✅ 已修复（第一次审查遗留）

| # | 问题 | 状态 |
|---|------|------|
| 1 | 硬编码数据库密码 | ✅ 已修复 — `setup_database.py` 改为读取环境变量，`server/.gitignore` 已创建 |
| 4 | API 中未实现的接口 | ✅ 已修复 — `auth.js` 已移除 `register`、`getUserInfo` |
| 6 | 生产环境默认密钥 | ✅ 已修复 — `ProductionConfig.__init__` 检查默认值并拒绝启动 |
| 7 | crypto.js 调试日志 | ✅ 已修复 — 所有 `console.log` 已移除 |
| 8 | GalleryPage 调试功能 | ✅ 已修复 — `testKey`、`clearAllImages` 已移除，改用 Toast |
| 9 | 登录限流器未绑定 app | ✅ 已修复 — 改为全局 limiter + `app.py` 中注册后添加限流 |
| 10 | 上传数据大小校验 | ✅ 已修复 — 添加了 `len(encrypted_bytes) > _MAX_FILE_SIZE` 检查 |
| 11 | useEffect 依赖缺失 | ✅ 已修复 — 依赖数组已包含 `[token]` |
| 13 | 数据库 schema 不一致 | ✅ 已修复 — `database-design.sql` 已更新 |
| 15 | 缺少 Error Boundary | ✅ 已修复 — `ErrorBoundary` 组件已添加到 `App.jsx` |
| 16 | 批量删除并发策略 | ✅ 已修复 — 改为 `BATCH_SIZE = 5` 分批执行 |
| 17 | 预览 URL 内存泄漏 | ✅ 已修复 — `urlsRef` + `useEffect` 清理 |
| 18 | 加密缩略图 | ✅ 已修复 — `generateThumbnail` + 上传流程已集成 |
| 19 | Toast 替代 alert() | ✅ 已修复 — `Toast.jsx` 组件已实现 |
| 20 | 搜索后端实现 | ✅ 已修复 — `list_images` 中添加了 `search` 过滤 |
| 21 | 口令页引导文案 | ✅ 已修复 — 添加了 ⚠ 警告文案 |
| 24 | 移动端导航 | ✅ 已修复 — 底部 Tab Bar + 触摸手势 |
| 25 | 路由代码分割 | ✅ 已修复 — `React.lazy` + `Suspense` |
| 26 | 退出确认步骤 | ✅ 已修复 — `window.confirm` 已添加 |

---

## 🔴 阻塞级（必须修复）

### [x] A. 缩略图加密与主图共用同一 IV

**文件**: `client/src/pages/UploadPage.jsx:53-54`

```javascript
// 当前代码
const { ciphertext, iv } = encryptImage(base64Data, aesKey);
const { ciphertext: thumbnailCiphertext } = encryptImage(thumbnailData, aesKey);
//                                       ↑ 没有传 iv，会生成新的随机 IV
```

**修改原因**: 虽然 `encryptImage` 每次调用会生成随机 IV，所以这里实际不会共用 IV。但问题在于：上传的 JSON 中只有一个 `iv` 字段（第 63 行），服务端也只存储一个 IV。这意味着**缩略图的 IV 被丢弃了**，解密缩略图时无法知道用的是哪个 IV，缩略图将无法正确解密。

**修改方案**: 上传时同时发送缩略图的 IV：

```javascript
const { ciphertext, iv } = encryptImage(base64Data, aesKey);
const { ciphertext: thumbnailCiphertext, iv: thumbnailIv } = encryptImage(thumbnailData, aesKey);

const jsonData = {
  encrypted_data: ciphertext,
  encrypted_thumbnail: thumbnailCiphertext,
  iv: iv,
  thumbnail_iv: thumbnailIv,  // ← 新增
  // ...
};
```

服务端 `Image` 模型和数据库也需要新增 `thumbnail_iv` 字段。

---

### [x] B. 缩略图字段未持久化到数据库

**文件**: `server/models/image.py` vs `client/src/pages/UploadPage.jsx:59`

```javascript
// 前端发送了 encrypted_thumbnail
jsonData.encrypted_thumbnail = thumbnailCiphertext;
```

```python
# 但 Image 模型没有 encrypted_thumbnail 字段
class Image(db.Model):
    id = ...
    encrypted_data = ...
    iv = ...
    # ← 没有 encrypted_thumbnail
```

**修改原因**: 前端生成并发送了加密缩略图数据，但服务端的 Image 模型没有对应的字段。SQLAlchemy 会静默忽略未知字段，缩略图数据被丢弃。画廊卡片仍然只能显示 🔒 占位符，缩略图功能形同虚设。

**修改方案**: 在 Image 模型和数据库中添加字段：

```python
# models/image.py
encrypted_thumbnail = db.Column(db.LargeBinary(length=4 * 1024 * 1024), nullable=True)  # MEDIUMBLOB
thumbnail_iv = db.Column(db.String(64), nullable=True)
```

```sql
-- init_database.sql
ALTER TABLE images ADD COLUMN encrypted_thumbnail MEDIUMBLOB COMMENT '加密缩略图';
ALTER TABLE images ADD COLUMN thumbnail_iv VARCHAR(64) COMMENT '缩略图 IV';
```

同时在 `routes/images.py` 的 `upload_image` 和 `_image_to_dict` 中处理该字段。

---

### [x] C. useImages Hook 响应解析仍然错误 ✅

**文件**: `client/src/hooks/useImages.js:43-44`

```javascript
// 当前代码（错误）
setImages(response.data.data || []);
setPagination(response.data.pagination || {...});
```

**修改原因**: `getImages()` 返回 `res.data`，结构为 `{ success: true, data: { items: [...], pagination: {...} } }`。代码取 `response.data.data` 即 `{ items, pagination }.data` = `undefined`，始终返回空数组。这个 Hook 自创建以来从未正常工作过。

注意：`GalleryPage.jsx` 没有使用此 Hook（它有自己的 `fetchImages`），所以画廊页面不受影响。但如果其他页面使用了 `useImages`，将看不到任何数据。

**修改方案**:

```javascript
setImages(response.data?.items || []);
setPagination(response.data?.pagination || {
  page: 1, limit: 20, total: 0, pages: 0,
});
```

---

## 🟡 建议级（应该修复）

### [x] D. Web Worker 文件存在但未被使用 ✅（decryptWithWorker 已添加）

**文件**: `client/src/utils/decrypt.worker.js`

**修改原因**: 已创建 Web Worker 文件用于将解密操作移出主线程，但 `GalleryPage.jsx` 和 `ImageViewer.jsx` 中的解密仍然在主线程执行。Worker 文件成了死代码，大图片解密时页面仍会卡顿。

**修改方案**: 在 `GalleryPage` 和 `ImageViewer` 中使用 Worker：

```javascript
// 创建可复用的 Worker 包装
function decryptWithWorker(encryptedData, ivHex, keyHex) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/decrypt.worker.js');
    const id = Date.now();
    worker.postMessage({ encryptedData, ivHex, keyHex, id });
    worker.onmessage = (e) => {
      if (e.data.success) resolve(e.data.data);
      else reject(new Error(e.data.error));
      worker.terminate();
    };
  });
}
```

注意：Worker 中通过 CDN 加载 CryptoJS，需确认版本与 npm 包一致（当前 npm 用 `crypto-js`，Worker 用 `4.2.0` CDN）。建议改用 Vite 的 Worker 导入方式以保持版本一致：

```javascript
const worker = new Worker(new URL('./decrypt.worker.js', import.meta.url));
```

---

### [x] E. 文件名未做服务端校验和清洗

**文件**: `server/routes/images.py:229`

```python
# 当前代码 — 直接存储客户端传来的文件名
image = Image(
    original_filename=data["original_filename"],
    ...
)
```

**修改原因**: `original_filename` 由客户端声明，服务端未做任何校验。攻击者可以提交：
- 超长文件名（如 10000 字符），可能导致数据库字段溢出或前端渲染异常
- 包含路径遍历字符的文件名（如 `../../etc/passwd`），虽然存储在数据库中不会直接造成文件系统攻击，但如果任何导出/下载功能使用此文件名构造路径，将产生路径遍历漏洞
- 包含 HTML/JS 的文件名（如 `<script>alert(1)</script>.jpg`），如果前端直接渲染未转义，存在 XSS 风险

**修改方案**:

```python
import re

original_filename = data["original_filename"].strip()
if not original_filename or len(original_filename) > 255:
    return _error("INVALID_FILENAME", "文件名无效或过长")
# 移除路径分隔符和危险字符
original_filename = re.sub(r'[/\\<>:"|?*\x00-\x1f]', '', original_filename)
if not original_filename:
    return _error("INVALID_FILENAME", "文件名无效")
```

---

### [x] F. AuthContext 的 verifyToken 可能触发重复请求 ✅

**文件**: `client/src/context/AuthContext.jsx:14-18, 20-34`

```javascript
const [token, setToken] = useState(() => localStorage.getItem('jwt_token'));

useEffect(() => {
  if (token) {
    verifyToken(token);
  }
}, [token]);

const verifyToken = useCallback(async (tokenToVerify) => {
  try {
    const res = await axios.get(...);
    if (!res.data.success) logout();  // ← logout 修改 token
  } catch {
    logout();  // ← logout 修改 token
  }
}, []);
```

**修改原因**: 当 token 无效时：
1. Effect 触发 → 调用 `verifyToken`
2. 请求失败 → 调用 `logout()` → `setToken(null)`
3. token 变化 → Effect 再次触发 → 但 `token` 为 null，不执行

虽然不会无限循环（null 时 guard 住），但存在两个问题：
- `verifyToken` 的 `useCallback` 依赖为空数组，捕获的 `logout` 是初始渲染的闭包
- 快速切换 token（如多标签页）时，旧请求的响应可能覆盖新状态

**修改方案**:

```javascript
useEffect(() => {
  if (!token) return;
  let cancelled = false;

  verifyToken(token).then(() => {
    if (cancelled) return;  // 响应过期，丢弃
  });

  return () => { cancelled = true; };
}, [token]);
```

---

### [x] G. 图片查看器的解密缺少取消机制 ✅

**文件**: `client/src/components/ImageViewer.jsx:67-90`

```javascript
useEffect(() => {
  if (!currentImage || !aesKey) return;

  const loadAndDecrypt = async () => {
    setLoading(true);
    try {
      const response = await getImage(currentImage.id);
      const base64Data = decryptImage(encrypted_data, iv, aesKey);
      setDecryptedSrc(`data:${mime_type};base64,${base64Data}`);
    } catch { ... }
    finally { setLoading(false); }
  };

  loadAndDecrypt();
}, [index, currentImage, aesKey]);
```

**修改原因**: 用户快速点击"下一张"时，多个解密请求同时发出。如果第 5 张的解密先于第 3 张完成，第 3 张的结果会覆盖第 5 张的显示——用户看到的是错误的图片。

**修改方案**: 添加请求取消：

```javascript
useEffect(() => {
  let cancelled = false;
  // ...
  const loadAndDecrypt = async () => {
    // ...
    if (!cancelled) setDecryptedSrc(...);
  };
  loadAndDecrypt();
  return () => { cancelled = true; };
}, [index, currentImage, aesKey]);
```

---

### [x] H. ProtectedRoute 组件未被使用 ✅

**文件**: `client/src/components/ProtectedRoute.jsx`

**修改原因**: 组件已实现（检查 `isAuthenticated` 和 `keyReady`），但 `App.jsx` 的路由定义中没有使用它：

```jsx
// 当前 App.jsx — 直接渲染页面组件
<Route path="/gallery" element={<GalleryPage />} />
<Route path="/upload" element={<UploadPage />} />
```

认证检查分散在各个页面组件内部（`LoginPage` 有 `if (isAuthenticated) Navigate`，`KeySetupPage` 有 `if (!isAuthenticated) Navigate`），逻辑重复且不一致。

**修改方案**: 使用 `ProtectedRoute` 统一管理路由守卫：

```jsx
<Route path="/gallery" element={
  <ProtectedRoute requireKey><GalleryPage /></ProtectedRoute>
} />
<Route path="/upload" element={
  <ProtectedRoute requireKey><UploadPage /></ProtectedRoute>
} />
```

---

### [x] I. UploadForm 的提示文案包含 SVG，但后端不支持 ✅

**文件**: `client/src/components/UploadForm.jsx:6-12` vs `server/routes/images.py:13-19`

```javascript
// 前端 — 接受 SVG
const ACCEPTED_TYPES = {
  'image/svg+xml': []  // ← 允许 SVG
};
```

```python
# 后端 — 不接受 SVG
_ALLOWED_MIME_TYPES = {
    "image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"
    # ← 没有 image/svg+xml
}
```

**修改原因**: 前端 dropzone 接受 SVG 文件，但后端白名单不包含 `image/svg+xml`。用户上传 SVG 会通过前端校验但被后端拒绝，体验困惑。

此外，SVG 文件可以包含 `<script>` 标签，如果图片以 `<img src="data:image/svg+xml;base64,...">` 方式展示（当前正是这样），现代浏览器会阻止脚本执行。但如果改为其他方式展示（如直接插入 DOM），存在 XSS 风险。

**修改方案**: 从前端 `ACCEPTED_TYPES` 中移除 SVG，或在后端添加 SVG 支持（但需确保安全展示）。

---

## 完成统计

| 等级 | 总数 | 已完成 |
|------|------|--------|
| ✅ 已修复 | 19 | 19 / 19 |
| 🔴 阻塞 | 3 | 3 / 3 |
| 🟡 建议 | 6 | 6 / 6 |
| **待办合计** | **9** | **9 / 9** |

### 本次修复清单 (9/9)
- ✅ #A 缩略图 IV 已存储
- ✅ #B 缩略图字段已持久化
- ✅ #C useImages Hook 解析修复
- ✅ #D Worker 解密函数已添加
- ✅ #E 文件名校验已添加
- ✅ #F verifyToken 竞态处理
- ✅ #G 解密取消机制
- ✅ #H ProtectedRoute 已使用
- ✅ #I SVG 已从前端移除
