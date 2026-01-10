# PDF 预览 Trace 数据导航 - 实施计划 v1

> 回链：[任务概览](./README.md)  
> 设计参考：[设计文档](./spec-design-v1.md)

## 任务拆解

### Task 1: 类型定义更新

**负责人**：待分配  
**预计工时**：0.5h  
**交付物**：

- 更新 `FilePreviewRendererProps` 接口
- 更新 `PDFPreviewWrapperProps` 接口
- 新增 `QuickJumperProps` 接口
- 新增 `ChapterJumpItem` 类型

**关联文件**：

- `apps/report-ai/src/components/Reference/FilePreviewRenderer/types.ts`

**验收标准**：

- [ ] 类型定义完整且无 TypeScript 错误
- [ ] 接口文档注释清晰

---

### Task 2: QuickJumper 组件实现

**负责人**：待分配  
**预计工时**：2h  
**交付物**：

- `QuickJumper` 组件实现
- 组件样式文件
- 组件单元测试（可选）

**关联文件**：

- `apps/report-ai/src/components/Reference/FilePreviewRenderer/QuickJumper.tsx`（新建）
- `apps/report-ai/src/components/Reference/FilePreviewRenderer/QuickJumper.module.less`（新建）

**实现要点**：

- 使用 Tabs 风格渲染章节标签
- 支持横向滚动（章节较多时）
- 激活标签高亮显示
- 点击触发 `onChapterClick` 回调

**验收标准**：

- [ ] 组件渲染正常，样式符合设计
- [ ] 点击章节触发回调，参数正确
- [ ] 激活状态切换正常

---

### Task 3: PDFPreviewWrapper 增强

**负责人**：待分配  
**预计工时**：3h  
**交付物**：

- 增强 `PDFPreviewWrapper` 组件
- 添加模式判断逻辑
- 集成 `QuickJumper` 组件

**关联文件**：

- `apps/report-ai/src/components/Reference/FilePreviewRenderer/PDFPreviewWrapper.tsx`

**实现要点**：

- 接收 `file` 和 `chapterMap` props
- 计算 `chapterJumpData`
- 判断是否显示 `QuickJumper`
- 处理章节点击事件
- 管理 `activeChapterIndex` 状态

**验收标准**：

- [ ] 多 trace 模式显示 QuickJumper
- [ ] 单 trace 模式直接跳转
- [ ] 章节点击后 PDF 正确跳转
- [ ] 边界情况处理正确

---

### Task 4: FilePreviewRenderer 数据传递

**负责人**：待分配  
**预计工时**：1h  
**交付物**：

- 更新 `FilePreviewRenderer` 组件
- 传递 `file` 和 `chapterMap` 给子组件

**关联文件**：

- `apps/report-ai/src/components/Reference/FilePreviewRenderer/FilePreviewRenderer.tsx`
- `apps/report-ai/src/components/Reference/FilePreviewRenderer/types.ts`

**实现要点**：

- 修改 `file` prop 类型为 `RPFileUnified`
- 添加 `chapterMap` prop
- 传递数据给 `PDFPreviewWrapper`

**验收标准**：

- [ ] 类型定义正确
- [ ] 数据传递完整
- [ ] 不影响其他文件类型预览

---

### Task 5: ReferencePreviewContent 数据传递

**负责人**：待分配  
**预计工时**：1h  
**交付物**：

- 更新 `ReferencePreviewContent` 组件
- 传递 `chapterMap` 给 `FilePreviewRenderer`

**关联文件**：

- `apps/report-ai/src/components/Reference/ReferencePreviewContent/index.tsx`

**实现要点**：

- 添加 `chapterMap` prop
- 传递给 `FilePreviewRenderer`

**验收标准**：

- [ ] Props 定义正确
- [ ] 数据传递完整

---

### Task 6: 上游组件集成

**负责人**：待分配  
**预计工时**：1h  
**交付物**：

- 更新 `RPReferenceView` 组件
- 确保 `chapterMap` 从顶层传递

**关联文件**：

- `apps/report-ai/src/components/Reference/ReferenceView/index.tsx`

**实现要点**：

- 将 `chapterMap` 传递给 `ReferencePreviewContent`
- 确保数据流完整

**验收标准**：

- [ ] 数据从顶层正确传递
- [ ] 功能端到端可用

---

### Task 7: 功能测试与优化

**负责人**：待分配  
**预计工时**：2h  
**交付物**：

- 功能测试报告
- 性能优化（如需要）
- Bug 修复

**测试场景**：

- 多章节文件预览
- 单章节文件预览
- 外部引用跳转
- 无 trace 数据文件
- 边界情况测试

**验收标准**：

- [ ] 所有测试场景通过
- [ ] 无明显性能问题
- [ ] 无 TypeScript 错误

## 交付时间线

| 任务   | 预计工时 | 依赖关系 | 建议顺序 |
| ------ | -------- | -------- | -------- |
| Task 1 | 0.5h     | 无       | 第 1 批  |
| Task 2 | 2h       | Task 1   | 第 2 批  |
| Task 3 | 3h       | Task 1,2 | 第 3 批  |
| Task 4 | 1h       | Task 3   | 第 4 批  |
| Task 5 | 1h       | Task 4   | 第 4 批  |
| Task 6 | 1h       | Task 5   | 第 5 批  |
| Task 7 | 2h       | Task 6   | 第 6 批  |

**总预计工时**：10.5h

## 风险与依赖

### 技术风险

- `PDFViewer` 的 `scrollToPage` 方法可能存在时序问题
- 章节数据可能不完整或格式不一致

### 缓解措施

- 使用 `useEffect` 处理异步跳转
- 添加数据校验和降级处理

### 外部依赖

- 需要确认 `chapterMap` 在上游组件中可用
- 需要确认 `RPFileUnified.position` 数据格式稳定

## 更新记录

| 日期       | 修改人   | 更新内容     |
| ---------- | -------- | ------------ |
| 2025-01-XX | 开发团队 | 创建实施计划 |
