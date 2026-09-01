# Image Vault 待办事项清单（第三次审查）

> 基于最新代码状态审查生成（2026-09-01）。
> 第二次审查的 9 项问题已全部修复。本次聚焦新发现和残留细节。

---

## ✅ 第二次审查遗留问题（已全部修复）

| # | 问题 | 状态 |
|---|------|------|
| A | 缩略图 IV 未上传 | ✅ `thumbnail_iv` 已加入 Image 模型和上传逻辑 |
| B | 缩略图字段未持久化 | ✅ `encrypted_thumbnail` + `thumbnail_iv` 已添加到 ORM 和 SQL |
| C | useImages 响应解析错误 | ✅ 已修正为 `response.data?.items` |
| D | Worker 文件未被使用 | ✅ `decryptWithWorker` 已添加到 `crypto.js`（但 ImageViewer 未使用，见 #4） |
| E | 文件名未校验 | ✅ 长度、路径分隔符、危险字符校验已添加 |
| F | verifyToken 重复请求 | ✅ `cancelled` flag + `[logout]` 依赖已添加 |
| G | 解密缺少取消机制 | ✅ ImageViewer 已添加 `cancelled` flag |
| H | ProtectedRoute 未使用 | ✅ 已在 `App.jsx` 路由中使用 |
| I | 前后端 MIME 类型不一致 | ✅ SVG 已从前端 `ACCEPTED_TYPES` 移除 |

---

## 🟡 建议级

### [ ] 1. GalleryPage 解密未使用 Web Worker

**文件**: `client/src/pages/GalleryPage.jsx:114`

```javascript
// 当前代码 — 主线程解密
const decrypted = decryptImage(imageData.encrypted_data, imageData.iv, aesKey);
```

**修改原因**: `crypto.js` 中已实现了 `decryptWithWorker`，但 `GalleryPage` 的 `handleViewImage` 仍直接调用 `decryptImage`（主线程）。大图片解密时页面会卡顿。同样，`ImageViewer.jsx:81` 也未使用 Worker。

**修改方案**: 将 `decryptImage` 替换为 `decryptWithWorker`：

```javascript
import { decryptWithWorker } from '../utils/crypto';

// handleViewImage 中
const keyHex = aesKey.toString(CryptoJS.enc.Hex);
const decrypted = await decryptWithWorker(imageData.encrypted_data, imageData.iv, keyHex);
```

注意：`aesKey` 是 CryptoJS WordArray，传给 Worker 前需转为 Hex 字符串。Worker 返回的也是 Hex 字符串，需确认与当前 `decryptImage` 返回的 Utf8 字符串一致。

---

### [x] 2. 搜索只在提交时触发

**文件**: `client/src/pages/GalleryPage.jsx:143-154`

```jsx
<input
  className="input search-input"
  type="text"
  placeholder="搜索文件名、描述、标签..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
```

**修改原因**: `search` state 变化会触发 `fetchImages` 的 `useCallback` 重新创建（因为 `search` 在依赖数组中），进而触发 `useEffect` 重新执行。用户每输入一个字符都会发起一次 API 请求。对于打字较快的用户，可能在 1 秒内发出 5-10 个请求，造成：
- 不必要的网络流量和服务端负载
- 快速连续输入时结果闪烁（旧请求返回覆盖新结果）
- 搜索框的"搜索"按钮形同虚设（因为已经自动搜索了）

**修改方案**: 移除 `fetchImages` 对 `search` 的依赖，只在提交时搜索：

```jsx
// fetchDependencies 中移除 search
const fetchImages = useCallback(async () => {
  // ...
}, [page]);  // 只依赖 page

// form onSubmit 时才搜索
const handleSearch = (e) => {
  e.preventDefault();
  setPage(1);
  fetchImages();  // fetchImages 内部读取 search 的最新值
};
```

或者使用 debounce hook：

```javascript
const debouncedSearch = useDebounce(search, 300);
// 将 debouncedSearch 加入 fetchImages 依赖
```

---

### [x] 3. Toast ID 重复已修复

**文件**: `client/src/components/Toast.jsx:9`

```javascript
const id = Date.now();
```

**修改原因**: `Date.now()` 返回毫秒级时间戳。如果同一毫秒内触发多个 Toast（如批量删除失败时同时报多个错误），ID 会重复，导致 `setToasts` 的去重逻辑（`filter(t => t.id !== id)`）错误地删除多个 Toast。

**修改方案**: 使用递增计数器或 `crypto.randomUUID()`：

```javascript
let toastCounter = 0;

const addToast = useCallback((message, type = 'info', duration = 3000) => {
  const id = ++toastCounter;
  // ...
}, []);
```

---

### [x] 4. useImages 的 removeImages 已改为分批

**文件**: `client/src/hooks/useImages.js:87-91`

```javascript
// 当前代码 — 仍然并行发起所有请求
const removeImages = useCallback(
  async (imageIds) => {
    await Promise.all(imageIds.map((id) => deleteImage(id)));
    // ...
  },
  [fetchImages]
);
```

**修改原因**: `GalleryPage` 的 `handleBatchDelete` 已改为 `BATCH_SIZE = 5` 分批执行，但 `useImages` hook 中的 `removeImages` 仍然使用 `Promise.all` 并行发起所有请求。如果有其他页面使用此 hook 进行批量删除，仍然会遇到并发问题。

**修改方案**: 与 `GalleryPage` 保持一致，改为分批：

```javascript
const removeImages = useCallback(
  async (imageIds) => {
    const BATCH_SIZE = 5;
    for (let i = 0; i < imageIds.length; i += BATCH_SIZE) {
      const batch = imageIds.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map((id) => deleteImage(id)));
    }
    await fetchImages();
    return true;
  },
  [fetchImages]
);
```

---

### [x] 5. Layout 中未使用的导入已移除

**文件**: `client/src/components/Layout.jsx:1,9`

```javascript
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
//                                         ^^^^^^^^^^^ 未使用

const location = useLocation();  // ← 未使用
```

**修改原因**: `useLocation` 被导入并调用，但 `location` 变量从未在组件中引用。这是代码残留，可能是之前用于高亮当前导航项的遗留代码。

**修改方案**: 移除未使用的导入和变量：

```javascript
import { NavLink, useNavigate } from 'react-router-dom';
// 删除 const location = useLocation();
```

---

### [x] 6. generateThumbnail 已添加错误处理

**文件**: `client/src/utils/crypto.js:31-57`

```javascript
export function generateThumbnail(file, maxWidth = 200) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => { /* ... */ resolve(canvas.toDataURL(...)); };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
```

**修改原因**: Promise 只有 `resolve` 没有 `reject`。如果以下情况发生，Promise 会永远 pending：
- `FileReader.onerror` 触发（文件读取失败）
- `img.onerror` 触发（图片格式损坏）
- `canvas.toDataURL` 返回空数据

永远 pending 的 Promise 会导致 `await generateThumbnail(file)` 永远不返回，上传流程卡死。

**修改方案**:

```javascript
export function generateThumbnail(file, maxWidth = 200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('图片加载失败'));
      img.onload = () => {
        // ... canvas drawing ...
        resolve(canvas.toDataURL('image/jpeg', 0.5));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
```

---

### [x] 7. Flask MAX_CONTENT_LENGTH 已添加

**文件**: `server/config.py`

**修改原因**: 代码中 `_MAX_FILE_SIZE = 50 * 1024 * 1024`（50MB），但 Flask 的 `MAX_CONTENT_LENGTH` 未在 config 中设置。Flask 默认不限制请求体大小。在代码校验之前，Flask 会先将整个请求体读入内存。攻击者可以发送一个声明 `file_size: 1024` 但实际 500MB 的请求，Flask 会尝试全部读入内存后才被 Python 代码拒绝。

**修改方案**: 在 `config.py` 中设置：

```python
MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB，与 _MAX_FILE_SIZE 一致
```

Flask 会在请求体超过此限制时自动返回 413 错误，无需进入 Python 代码逻辑。

---

## 完成统计

| 等级 | 总数 | 已完成 |
|------|------|--------|
| 🟡 建议 | 7 | 6 / 7 |
| **待办合计** | **7** | **6 / 7** |

> 本次审查未发现阻塞级问题。代码整体质量良好，剩余 7 项均为建议级优化。
