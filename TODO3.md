# Image Vault 待办事项清单（第四次审查）

> 基于最新代码状态审查生成（2026-09-01）。
> 第三次审查 6/7 已修复（#1 Web Worker 跳过）。本次为最终扫描。

---

## ✅ 第三次审查遗留问题（已全部修复）

| # | 问题 | 状态 |
|---|------|------|
| 1 | GalleryPage/ImageViewer 解密未使用 Worker | ⏭️ 已跳过 |
| 2 | 搜索缺少防抖 | ✅ `fetchImages` 改为接收 `searchTerm` 参数，仅依赖 `[page]` |
| 3 | Toast ID 可能重复 | ✅ 改为递增计数器 `++toastCounter` |
| 4 | useImages 的 removeImages 未分批 | ✅ 改为 `BATCH_SIZE = 5` |
| 5 | Layout 未使用的导入 | ✅ `useLocation` 已移除 |
| 6 | generateThumbnail 缺少 reject | ✅ `reader.onerror` 和 `img.onerror` 已添加 |
| 7 | 缺少 MAX_CONTENT_LENGTH | ✅ 已添加 `50 * 1024 * 1024` |

---

## 💭 优化级（可选改进）

### [x] 1. ImageCard 标签 key 仍使用数组索引 ✅

**文件**: `client/src/components/ImageCard.jsx:89`

```jsx
{image.tags.split(',').map((tag, i) => (
  <span key={i} className="badge">
    {tag.trim()}
  </span>
))}
```

**修改原因**: 使用数组索引作为 React key 是一个常见的反模式。虽然标签是纯展示组件、没有内部 state，实际影响很小，但如果标签内容变化（如编辑标签后重新渲染），React 无法正确复用 DOM 节点，可能导致不必要的重绘。

**修改方案**:

```jsx
{image.tags.split(',').map((tag) => (
  <span key={tag.trim()} className="badge">
    {tag.trim()}
  </span>
))}
```

---

### [x] 2. GalleryPage 简易查看器缺少清理机制 ✅

**文件**: `client/src/pages/GalleryPage.jsx:107-130`

```javascript
const handleViewImage = async (image) => {
  setViewerLoading(true);
  setViewerImage({ ...image, decryptedSrc: null });

  try {
    // ... 解密 ...
    setViewerImage((prev) => ({ ...prev, decryptedSrc: decrypted }));
  } catch (err) {
    setViewerImage((prev) => ({ ...prev, decryptError: ... }));
  } finally {
    setViewerLoading(false);
  }
};
```

**修改原因**: 用户点击图片打开查看器 → 发起解密请求 → 在解密完成前点击"关闭"→ `setViewerImage(null)` → 解密完成 → `setViewerImage` 用 updater 函数设置已关闭的 viewer。

虽然不会崩溃（`prev` 为 `null` 时 updater 会创建一个新对象，但因为 `viewerImage` 条件渲染为 `null` 所以不会显示），但会产生不必要的 state 更新和潜在的内存引用。

**修改方案**: 使用 `useRef` 追踪查看器是否已关闭：

```javascript
const viewerClosedRef = useRef(false);

const handleViewImage = async (image) => {
  viewerClosedRef.current = false;
  setViewerImage({ ...image, decryptedSrc: null });
  // ...
  if (!viewerClosedRef.current) {
    setViewerImage((prev) => ({ ...prev, decryptedSrc: decrypted }));
  }
};

const closeViewer = () => {
  viewerClosedRef.current = true;
  setViewerImage(null);
};
```

---

### [x] 3. 后端搜索未转义 LIKE 通配符 ✅

**文件**: `server/routes/images.py:124`

```python
like_pattern = f"%{search}%"
```

**修改原因**: SQL 的 `LIKE` 操作符中，`%` 和 `_` 是通配符。如果用户搜索 `%` 或 `_`，它们会被当作通配符处理而不是字面字符。例如搜索 `100%` 会匹配 `100abc`。

实际影响较小（普通用户不太会搜索这些字符），但属于输入处理的不严谨。

**修改方案**:

```python
escaped_search = search.replace('\\', '\\\\').replace('%', '\\%').replace('_', '\\_')
like_pattern = f"%{escaped_search}%"
query = query.filter(
    db.or_(
        Image.original_filename.ilike(like_pattern),
        Image.description.ilike(like_pattern),
        Image.tags.ilike(like_pattern),
    )
)
```

---

## 完成统计

| 等级 | 总数 | 已完成 |
|------|------|--------|
| 💭 优化 | 3 | 3 / 3 |
| **待办合计** | **3** | **3 / 3** |

> 经过四轮审查，项目已无阻塞级和建议级问题。剩余 3 项均为可选的代码质量优化。
