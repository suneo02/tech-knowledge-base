# 引用资料 PDF 多页码跳转 - 实施计划

> 📖 回链：[任务概览](./README.md) | 遵循 [Spec 文档编写规范](../../../../../docs/rule/doc-spec-rule.md)

## 实施拆解

### 任务 1：扩展类型定义

**负责人**：Kiro  
**预计时间**：30 分钟  
**依赖**：无

**改动文件**：

- `apps/report-ai/src/components/Reference/type.ts`
- `apps/report-ai/src/components/Reference/FilePreviewRenderer/types.ts`

**改动内容**：

1. 在 `PreviewData` 接口添加 `pageNumbers?: number[]` 字段
2. 在 `PDFPreviewWrapperProps` 接口添加 `pageNumbers?: number[]` 字段
3. 新增 `PDFPreviewHandle` 接口，定义 `scrollToPage` 方法

**验收标准**：

- 类型定义编译通过
- 不影响现有代码的类型检查

---

### 任务 2：实现页码提取工具函数

**负责人**：Kiro  
**预计时间**：45 分钟  
**依赖**：任务 1

**改动文件**：

- `apps/report-ai/src/components/Reference/utils/previewDataUtils.ts`

**改动内容**：

1. 新增 `extractPageNumbers` 函数，从 `RPFileTraced.position` 数组提取页码
2. 更新 `createPreviewDataFromReference` 函数，添加 `pageNumbers` 字段逻辑
3. 处理页码去重、排序、过滤无效值

**验收标准**：

- 能正确提取 position 数组中的所有页码
- 页码已去重并按升序排序
- 过滤掉 ≤ 0 的无效页码
- 空数组或无效数据返回空数组

---

### 任务 3：改造 PDF 预览组件

**负责人**：Kiro  
**预计时间**：2 小时  
**依赖**：任务 1, 任务 2

**改动文件**：

- `apps/report-ai/src/components/Reference/FilePreviewRenderer/PDFPreviewWrapper.tsx`
- `apps/report-ai/src/components/Reference/FilePreviewRenderer/PDFPreviewWrapper.module.less`（新增）

**改动内容**：

1. 使用 `forwardRef` 包装组件，暴露 `PDFPreviewHandle`
2. 实现 `scrollToPage` 方法，调用 PDFViewer 的 `goToPage`
3. 添加快捷按钮 UI，仅在 `pageNumbers.length > 1` 时显示
4. 实现按钮点击事件，调用 `scrollToPage`
5. 添加样式文件，设计快捷按钮布局

**验收标准**：

- 多页码时显示快捷按钮，单页码或无页码时不显示
- 点击按钮能正确跳转到对应页码
- 外部可通过 ref 调用 `scrollToPage` 方法
- UI 样式美观，不影响 PDF 预览区域

---

### 任务 4：验证 PDFViewer 组件 API

**负责人**：Kiro  
**预计时间**：30 分钟  
**依赖**：任务 3

**改动文件**：

- `apps/report-ai/src/components/File/PDFViewer/index.tsx`（查看）

**改动内容**：

1. 确认 PDFViewer 是否暴露 `goToPage` 方法
2. 如果没有，需要添加该方法或使用替代方案
3. 确认 ref 类型定义是否正确

**验收标准**：

- PDFViewer 支持页码跳转功能
- ref 类型定义完整

---

### 任务 5：更新引用列表组件

**负责人**：Kiro  
**预计时间**：30 分钟  
**依赖**：任务 2

**改动文件**：

- `apps/report-ai/src/components/Reference/ReferenceItemTable/index.tsx`（或其他列表组件）

**改动内容**：

1. 确认列表点击文件时，调用 `previewById` 不传递 `pageNumber` 选项
2. 确保多页码场景能正确传递到预览组件

**验收标准**：

- 列表点击文件时，显示多页码快捷按钮
- 不影响编辑器引用点击的单页码跳转

---

### 任务 6：集成测试与优化

**负责人**：Kiro  
**预计时间**：1 小时  
**依赖**：任务 3, 任务 4, 任务 5

**测试场景**：

1. 编辑器引用点击 → 单页码直接跳转
2. 列表文件点击（多页码）→ 显示快捷按钮
3. 点击快捷按钮 → 正确跳转
4. 外部调用 `scrollToPage` → 正确跳转
5. 边界情况：空页码、单页码、无效页码

**验收标准**：

- 所有场景功能正常
- 无控制台错误或警告
- 性能符合要求（跳转 < 500ms）

---

## 时间规划

| 任务   | 预计时间 | 累计时间  |
| ------ | -------- | --------- |
| 任务 1 | 30 分钟  | 30 分钟   |
| 任务 2 | 45 分钟  | 1.25 小时 |
| 任务 3 | 2 小时   | 3.25 小时 |
| 任务 4 | 30 分钟  | 3.75 小时 |
| 任务 5 | 30 分钟  | 4.25 小时 |
| 任务 6 | 1 小时   | 5.25 小时 |

**总计**：约 5.25 小时

## 风险与应对

| 风险                      | 应对措施                               |
| ------------------------- | -------------------------------------- |
| PDFViewer 不支持 goToPage | 查找替代 API 或修改 PDFViewer 组件     |
| 快捷按钮过多影响 UI       | 限制显示数量（如最多 10 个）或使用下拉 |
| position 数据格式不一致   | 添加数据验证和容错处理                 |

## 更新记录

| 日期       | 修改人 | 更新内容                     |
| ---------- | ------ | ---------------------------- |
| 2025-11-12 | Kiro   | 初始创建，完成任务拆解与规划 |

## 相关文档

- [任务概览](./README.md)
- [需求与设计](./spec-core-v2.md)
- [React 组件规范](../../../../../docs/rule/code-react-component-rule.md)
- [TypeScript 编码规范](../../../../../docs/rule/code-typescript-style-rule.md)

