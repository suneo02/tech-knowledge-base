# 文件状态轮询 Redux 统一管理

## 任务概览

| 项目     | 内容                                                                                                                                                                                                                                                                                                                                                                  |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 任务来源 | 代码重构优化                                                                                                                                                                                                                                                                                                                                                          |
| 负责人   | TBD                                                                                                                                                                                                                                                                                                                                                                   |
| 上线目标 | 统一管理文件状态轮询，消除重复逻辑和数据冗余                                                                                                                                                                                                                                                                                                                          |
| 当前版本 | v1                                                                                                                                                                                                                                                                                                                                                                    |
| 状态     | 🚧 设计中                                                                                                                                                                                                                                                                                                                                                             |
| 关联文档 | [设计方案](/apps/report-ai/docs/specs/file-status-polling-redux/spec-design-v1.md)                                                                                                                                                                                                                                                                                    |
| 关联代码 | `/apps/report-ai/src/hooks/useFileStatusPolling.ts`<br>`/apps/report-ai/src/hooks/RPOutline/useOutlineFilePolling.ts`<br>`/apps/report-ai/src/hooks/useFileList.ts`<br>`/apps/report-ai/src/pages/ReportDetail/RightPanel/index.tsx`<br>`/apps/report-ai/src/store/reportContentStore/reducers/reportFilesReducers.ts`<br>`/apps/report-ai/src/context/RPOutline.tsx` |

## 背景

当前系统中存在多处文件状态轮询逻辑和文件数据管理：

### 轮询逻辑分散

1. **大纲页面**（`ChatOutline`）：`useOutlineFilePolling` + Context 管理
2. **文件管理页面**（`FileManagement`）：`useFileList` 内部集成轮询 + Hook 本地状态
3. **报告详情页面**（`ReportDetail/RightPanel`）：`useFileStatusPolling` + `reportContentStore` Redux
4. **首页**（`Home`）：`ChatSenderReport` 组件处理文件上传，文件数据在组件内部管理

### 文件数据管理分散

- **大纲页面**：`RPOutlineContext.rawMessages` + `rpOutline.files`（可能不同步）
- **文件管理页面**：`useFileList` Hook 本地状态
- **报告详情页面**：`reportContentStore.reportFiles`
- **首页**：`ChatSenderReport` 组件内部状态

### 现存问题

#### 轮询逻辑问题

- **重复逻辑**：每个页面都需要独立管理轮询逻辑，代码重复
- **数据冗余**：同一文件在不同页面可能被重复轮询，造成不必要的 API 请求
- **状态不一致**：不同页面的文件状态可能不同步
- **清理困难**：页面切换时需要手动清理轮询状态，容易遗漏

#### 文件数据问题

- **数据源分散**：文件数据分散在 Context、Hook 本地状态、Redux 等多处
- **状态不一致**：同一文件在不同地方可能有不同的状态
- **难以共享**：页面间无法共享文件数据，需要重复请求
- **内存浪费**：相同文件数据在多处存储，造成内存浪费

## 目标

将文件状态轮询逻辑和文件数据管理迁移到 Redux 统一管理，实现：

### 轮询统一管理

1. **统一轮询**：所有页面共享同一个轮询机制
2. **去重优化**：相同文件只轮询一次
3. **自动清理**：页面卸载时自动清理订阅，避免内存泄漏
4. **状态同步**：所有页面实时获取最新文件状态

### 文件数据统一管理

1. **单一数据源**：所有文件数据统一存储在 Redux 中
2. **按场景分类**：区分大纲文件、报告文件、文件管理列表等不同场景
3. **状态一致性**：同一文件在所有页面保持状态一致
4. **数据共享**：页面间可以共享文件数据，减少重复请求

## 文档结构

- [spec-design-v1.md](/apps/report-ai/docs/specs/file-status-polling-redux/spec-design-v1.md) - 方案设计
- [spec-implementation-v1.md](/apps/report-ai/docs/specs/file-status-polling-redux/spec-implementation-v1.md) - 实施拆解

## 更新记录

| 日期       | 修改人 | 更新内容   |
| ---------- | ------ | ---------- |
| 2024-11-19 | AI     | 初始化文档 |
