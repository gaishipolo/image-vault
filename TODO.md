# Image Vault 待办事项清单（第一次审查）

> 基于代码审查生成，按优先级排序。每完成一项请将 `[ ]` 改为 `[x]`。

---

## 🔴 阻塞级（必须修复）

### [x] 1. 移除硬编码的数据库密码

**文件**: `server/setup_database.py:20`

**修改原因**: root 数据库密码直接写死在 Python 源码中，任何有代码访问权限的人都能看到密码。

**修改方案**: 改为从环境变量读取，创建 `server/.gitignore` 排除 `.env`。

---

### [ ] 2. 移除前端硬编码的加密盐值

**文件**: `client/src/utils/crypto.js:3`

**修改原因**: PBKDF2 盐值硬编码在前端源码中，打包后可被提取。

**修改方案**: 盐值由服务器登录后下发，或为每个用户存储独立盐值。

> 注：单管理员系统，盐值硬编码可接受，暂不处理。

---

### [x] 3. 修复 useImages Hook 的响应数据解析错误

**文件**: `client/src/hooks/useImages.js:43-49`

**修改原因**: `response.data.data` 路径错误，应为 `response.data.items`，始终返回空数组。

**修改方案**: 改为 `response.data?.items || []`。

---

### [x] 4. 清理前端 API 中未实现的接口调用

**文件**: `client/src/api/auth.js:10-14, 22-25`

**修改原因**: `register`、`getUserInfo` 在服务端无对应路由，调用会 404。

**修改方案**: 删除未使用的函数。

---

### [ ] 5. 为 AES 加密添加完整性校验

**文件**: `client/src/utils/crypto.js:31-42`

**修改原因**: AES-CBC 不提供完整性保护，存在比特翻转攻击风险。

**修改方案**: 改用 AES-GCM 或添加 HMAC。

> 注：CryptoJS 不支持 GCM，需迁移到 Web Crypto API，暂不处理。

---

## 🟡 建议级（应该修复）

### [x] 6. 移除或条件化生产环境的默认密钥

**文件**: `server/config.py:15, 29`

**修改原因**: 默认弱密钥可被用来伪造 JWT token。

**修改方案**: `ProductionConfig.__init__` 检查默认值并拒绝启动。

---

### [x] 7. 移除 crypto.js 中的调试日志

**文件**: `client/src/utils/crypto.js:46-76`

**修改原因**: `console.log` 输出密钥片段、IV 等敏感信息。

**修改方案**: 删除所有调试日志。

---

### [x] 8. 移除 GalleryPage 中的调试功能和敏感日志

**文件**: `client/src/pages/GalleryPage.jsx:103-166`

**修改原因**: `testKey`、`clearAllImages` 不应暴露给用户。

**修改方案**: 删除调试功能，改用 Toast 通知。

---

### [x] 9. 修复登录限流器未绑定到 Flask app 的问题

**文件**: `server/routes/auth.py:17-21`

**修改原因**: 独立 Limiter 实例未绑定 app，多进程时限流失效。

**修改方案**: 改为使用全局 limiter。

---

### [x] 10. 添加上传数据大小的实际校验

**文件**: `server/routes/images.py:200-207`

**修改原因**: `file_size` 由客户端声明，未校验实际解码后大小。

**修改方案**: 添加 `len(encrypted_bytes) > _MAX_FILE_SIZE` 检查。

---

### [x] 11. 修复 AuthContext 的 useEffect 依赖缺失

**文件**: `client/src/context/AuthContext.jsx:14-18`

**修改原因**: 依赖数组为空但使用了 `token` 变量。

**修改方案**: 添加 `[token]` 依赖。

---

### [ ] 12. 为标签列表使用稳定的 key

**文件**: `client/src/components/ImageCard.jsx:65-68`

**修改原因**: 使用数组索引作为 React key，列表变化时可能导致渲染问题。

**修改方案**: 使用 `tag.trim()` 作为 key。

---

### [x] 13. 同步数据库设计文档与实际 schema

**文件**: `database-design.sql` vs `server/init_database.sql`

**修改原因**: 设计文档与实际实现存在多处不一致。

**修改方案**: 更新 `database-design.sql` 使其反映实际 ORM 模型。

---

## 💭 优化级（可选改进）

### [ ] 14. 统一样式管理方式

**涉及文件**: 7 个组件使用内联 `<style>`

**修改原因**: 项目中存在三种 CSS 管理方式，风格不一致。

**修改方案**: 统一使用 CSS 模块。

> 注：当前项目规模不需要 CSS Modules，暂不处理。

---

### [x] 15. 添加 React Error Boundary

**涉及文件**: `client/src/App.jsx`

**修改原因**: 无错误边界，异常会导致白屏。

**修改方案**: 添加 `ErrorBoundary` 组件。

---

### [x] 16. 优化批量删除的并发策略

**文件**: `client/src/pages/GalleryPage.jsx:59-73`

**修改原因**: 同时发起所有删除请求，可能触发限流。

**修改方案**: 改为 `BATCH_SIZE = 5` 分批执行。

---

### [x] 17. 修复文件预览 URL 的内存泄漏

**文件**: `client/src/components/UploadForm.jsx:33`

**修改原因**: `createObjectURL` 未在组件卸载时释放。

**修改方案**: 使用 `urlsRef` + `useEffect` 清理。

---

## 🎨 前端设计改进

### [x] 18. 实现加密缩略图，解决画廊"缩略图黑洞"

**文件**: `client/src/components/ImageCard.jsx:47-51`

**修改原因**: 所有卡片显示相同 🔒 占位符，无法辨认内容。

**修改方案**: 上传时生成加密缩略图。

---

### [x] 19. 用 Toast 通知替代所有 alert() 调用

**涉及文件**: GalleryPage 等多处 `alert()` 调用

**修改原因**: `alert()` 阻塞页面，成功操作无反馈。

**修改方案**: 实现 Toast 组件。

---

### [x] 20. 补全画廊搜索功能的后端实现

**文件**: `server/routes/images.py:86-131`

**修改原因**: 前端有搜索框，后端未处理 `search` 参数。

**修改方案**: 在 `list_images` 中添加搜索过滤。

---

### [x] 21. 优化口令设置页面的引导文案

**文件**: `client/src/pages/KeySetupPage.jsx:78-82`

**修改原因**: 用户不理解口令用途和忘记口令的后果。

**修改方案**: 添加 ⚠ 警告文案。

---

### [x] 22. 优化图片查看器的缩略图栏

**文件**: `client/src/components/ImageViewer.jsx:290-299`

**修改原因**: 只显示数字序号，无实际意义。

**修改方案**: 改为分页数字器。

---

### [ ] 23. 改进解密流程，避免阻塞主线程

**文件**: `client/src/pages/GalleryPage.jsx:96-136`

**修改原因**: 大图片解密会阻塞 UI。

**修改方案**: 使用 Web Worker。

> 注：Worker 文件已创建但尚未集成，见 TODO1.md #D。

---

### [x] 24. 完善移动端导航和触控体验

**文件**: `client/src/components/Layout.jsx`, `ImageViewer.jsx`

**修改原因**: 移动端导航和触控体验不完善。

**修改方案**: 添加底部 Tab Bar + 触摸手势。

---

### [x] 25. 添加路由级代码分割和页面过渡

**文件**: `client/src/App.jsx`

**修改原因**: 所有页面首屏一次性加载。

**修改方案**: `React.lazy` + `Suspense`。

---

### [x] 26. 退出登录添加确认步骤

**文件**: `client/src/components/Layout.jsx:11-14`

**修改原因**: 误点退出需重新输口令。

**修改方案**: 添加 `window.confirm`。

---

### [ ] 27. 统一样式管理方式（CSS Modules 迁移）

**修改方案**: 按优先级逐步迁移到 `.module.css`。

> 注：当前项目规模不需要 CSS Modules，暂不处理。

---

## 完成统计

| 等级 | 总数 | 已完成 |
|------|------|--------|
| 🔴 阻塞 | 5 | 3 / 5 |
| 🟡 建议 | 8 | 6 / 8 |
| 💭 优化 | 4 | 2 / 4 |
| 🎨 前端设计 | 10 | 8 / 10 |
| **合计** | **27** | **19 / 27** |
