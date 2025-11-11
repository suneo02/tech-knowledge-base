# 模板使用公司选择 - 实施拆解

> 📖 返回 [任务概览](./README.md)

## 实施计划

### 任务拆解

| 序号 | 任务                   | 负责人 | 预计工时 | 状态      | 说明                          |
| ---- | ---------------------- | ------ | -------- | --------- | ----------------------------- |
| 1    | 添加弹窗状态管理       | 待分配 | 0.5h     | ⏳ 待开始 | 新增 5 个状态变量             |
| 2    | 实现公司选择弹窗 UI    | 待分配 | 1h       | ⏳ 待开始 | Modal + Form + CorpPresearch  |
| 3    | 实现 API 调用逻辑      | 待分配 | 0.5h     | ⏳ 待开始 | 调用 report/template/use 接口 |
| 4    | 修改"开始使用"按钮逻辑 | 待分配 | 0.5h     | ⏳ 待开始 | 从直接跳转改为打开弹窗        |
| 5    | 错误处理与用户提示     | 待分配 | 0.5h     | ⏳ 待开始 | 异常情况的友好提示            |
| 6    | 功能测试与优化         | 待分配 | 1h       | ⏳ 待开始 | 测试各种场景，优化用户体验    |

**总计工时**：约 4 小时

## 实施要点

### 任务 1：状态管理

**文件**：`apps/report-ai/src/components/TemplateList/index.tsx`

新增状态：

- `useModalVisible`：弹窗显示状态
- `selectedTemplate`：当前选中模板
- `selectedCorpId`：选中的公司 ID
- `selectedCorpName`：选中的公司名称
- `confirmLoading`：确认按钮加载状态

### 任务 2：弹窗 UI

**文件**：`apps/report-ai/src/components/TemplateList/index.tsx`

组件结构：

- Modal 容器，标题"使用模板"
- Form 表单布局，vertical 模式
- Form.Item 包裹 CorpPresearch 组件
- 确认按钮在未选择公司时禁用

依赖导入：

- `Form` from `@wind/wind-ui`
- `CorpPresearch` from `gel-ui/biz/common/CorpPresearch`

### 任务 3：API 调用

**文件**：`apps/report-ai/src/components/TemplateList/index.tsx`

实现函数：

- `useReportTemplate(templateId, entityCode)`：封装 API 调用
- `handleConfirmUse()`：确认按钮点击处理
  - 调用 API
  - 成功后清空状态、关闭弹窗、跳转页面
  - 失败时显示错误提示
- `handleCancelUse()`：取消按钮点击处理，清空状态

### 任务 4：按钮逻辑调整

**文件**：`apps/report-ai/src/components/TemplateList/index.tsx`  
**位置**：`@see apps/report-ai/src/components/TemplateList/index.tsx:60-75`

修改 `onUse` 函数：

- 移除原有的直接跳转逻辑
- 改为设置 `selectedTemplate` 并打开弹窗

### 任务 5：错误处理

覆盖场景：

- API 调用失败
- 网络异常
- 参数校验失败

处理方式：

- try-catch 捕获异常
- message.error 显示友好提示
- finally 中重置 loading 状态

### 任务 6：测试清单

| 测试场景         | 预期结果           |
| ---------------- | ------------------ |
| 点击"开始使用"   | 弹窗打开           |
| 未选择公司       | 确认按钮禁用       |
| 搜索并选择公司   | 确认按钮可点击     |
| 点击确认（成功） | 提示成功并跳转     |
| 点击确认（失败） | 显示错误提示       |
| 点击取消         | 弹窗关闭，状态清空 |
| 多次打开弹窗     | 状态正确重置       |

## 关键代码位置

| 功能         | 文件路径                                               | 行号参考 |
| ------------ | ------------------------------------------------------ | -------- |
| 模板列表组件 | `apps/report-ai/src/components/TemplateList/index.tsx` | 全文     |
| 公司搜索组件 | `packages/gel-ui/src/biz/common/CorpPresearch/`        | 全文     |
| API 定义     | `packages/gel-api/src/chat/report/template.ts`         | 24-29    |

## 风险与注意事项

1. **API 返回值**：需确认接口返回的 reportId，可能与模板 ID 不同
2. **公司代码格式**：确认 entityCode 是否需要特殊处理
3. **CorpPresearch 配置**：根据需求调整是否需要历史搜索功能
4. **跳转时机**：确认是否需要等待接口返回后再跳转

## 更新记录

| 日期       | 修改人 | 更新内容     |
| ---------- | ------ | ------------ |
| 2025-10-30 | Kiro   | 完成实施拆解 |
