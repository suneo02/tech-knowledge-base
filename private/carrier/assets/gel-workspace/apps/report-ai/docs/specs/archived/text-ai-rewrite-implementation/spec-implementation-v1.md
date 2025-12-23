# 实施拆解 - 文本 AI 重写

> 📖 回链：[任务概览](./README.md) | 阶段：实施拆解

## 实施概览

- 计划分为“选区采集”“改写调度”“悬浮预览集成”三部分，总工期约 5 天。
- 预览细节拆分至 [悬浮预览组件方案](../text-ai-rewrite-preview-floating/spec-preview-floating-v1.md)，此文仅保留主流程交付要求。
- 交付顺序遵循“先能力封装 → 再状态编排 → 最后体验集成”，每轮改写前必须执行会话重置。

## 子任务拆解

### Task A：选区采集与快照（1.5 天）

- 在 `ReportEditor` 的改写触发回调中获取 TinyMCE 选区、文本、上下文与定位信息，组装 `SelectionSnapshot` 传递给外部。
- 快照在回调内部就地验证（正文区域、10-2000 字符、上下文完整），失败则直接提示并中止流程。
- 为快照写入到期时间（60 秒）与版本号，供后续恢复时比对。
- 验收要点：回调在退出前确保 TinyMCE 光标状态恢复、不污染全局 Hook。
- 代码触点：`apps/report-ai/src/components/ReportEditor/index.tsx`、`apps/report-ai/src/components/ReportEditor/types/index.ts`。

### Task B：文本改写调度 Hook（2 天）

- 新增 `useTextRewrite`，在 `globalOperation` 内注册 `text_rewrite` kind，确保互斥。
- 封装 `startRewrite` / `abortRewrite` / `rejectRewrite` / `confirmRewrite` / `reset` 方法，区分流式中止与完成后的用户拒绝。
- 调用 `startRewrite` 时先执行 `resetSession`，清空消息（`setMessages([])`）、预览实例、订阅与脏状态锁。
- 监听流式消息，仅在完成信号出现时触发替换；任意出口（中止、拒绝、确认）都要调用统一的清理流程。
- 验收要点：状态流转完整、重复请求被拦截、失败后快照可恢复、清理逻辑在四种分支均生效。

### Task C：预览组件对接（1.5 天）

- 按 [悬浮预览组件方案](../text-ai-rewrite-preview-floating/spec-preview-floating-v1.md) 实施，Hook 与 UI 解耦。
- 在 ReportEditor 中注入预览入口与回调，将主流程的预览数据与动作透传，并处理 `abort`、`reject`、`confirm` 三类回调。
- 设计降级：预览异常时回退到 Toast + 手动复制方案，不阻断改写完成。
- Guard：与 `useStreamingPreview` 消息通道隔离，禁止改写流写入 TinyMCE；检测到误注入时立即调用 `abortRewrite` 并提示。

### 集成测试与文档（0.5 天）

- 完成单元测试（选区、调度、预览对接）与两条端到端用例。
- 更新 README 与用户操作说明，记录约束与降级策略。

## 里程碑安排

| 顺序 | 产出                  | 责任人 | 预计工期 | 依赖 |
| ---- | --------------------- | ------ | -------- | ---- |
| 1    | 选区采集与快照能力    | Kiro   | 1.5 天   | -    |
| 2    | `useTextRewrite` Hook | Kiro   | 2 天     | 1    |
| 3    | 悬浮预览集成          | Kiro   | 1.5 天   | 1-2  |
| 4    | 联调与测试资料        | Kiro   | 0.5 天   | 1-3  |

## 关键依赖与接口

- TinyMCE 选区能力：`useReportEditorRef`、`EditorFacade`。
- 全局状态：`globalOperation` reducer 与 selectors。
- 消息通道：`sendRPContentMessage`、`parsedRPContentMessages`。
- 预览渲染：`AIAnswerMarkdownViewer`（仅通过预览 spec 调用）。
- 消息缓冲：`setMessages` 与改写专用缓存，要求调用前执行清空。
- 流式隔离：`useStreamingPreview` 需通过开关或消息过滤排除改写内容。

## 风险与缓解

1. **快照恢复失败**：为快照提供版本号，恢复前再次校验选区仍在正文区域。
2. **状态互斥失效**：在 `globalOperation` 层新增守卫，若已有非 idle 状态拒绝新请求。
3. **流式误注入**：若 `useStreamingPreview` 仍监听改写消息，需要新增开关或过滤，防止 DOM 被注水。
4. **预览集成拖延主流程**：预览开发独立推进，主流程保留降级回调，确保可先上线核心改写能力。

## 交付检查清单

- [ ] 选区采集流程覆盖单元测试，失败分支可回退。
- [ ] Hook 状态图与章节级生成保持一致，日志可追溯到 correlationId。
- [ ] `abortRewrite`、`rejectRewrite`、`confirmRewrite` 三个出口均走到统一清理流程。
- [ ] 预览组件对接通过联调，并验证降级入口。
- [ ] README 与用户说明同步更新使用方式与限制。

## 相关文档

- [方案设计](./spec-design-v1.md)
- [悬浮预览组件方案](../text-ai-rewrite-preview-floating/spec-preview-floating-v1.md)
- [验证与风险](./spec-verification-v1.md)

## 更新记录

| 日期       | 修改人 | 更新内容                                            |
| ---------- | ------ | --------------------------------------------------- |
| 2025-11-04 | Codex  | 拆分预览任务，补充清理/中断细节                     |
| 2025-11-03 | Kiro   | ✅ 完成 Task 3：悬浮预览组件及 ReportEditor 集成    |
| 2025-11-03 | Kiro   | ✅ 完成 Task 2：文本改写控制 Hook                   |
| 2025-10-30 | Kiro   | ✅ 完成 Task 1：编辑器选区能力扩展                  |
| 2025-10-30 | Kiro   | 修改预览方式为悬浮组件，使用 AIAnswerMarkdownViewer |
| 2025-10-30 | Kiro   | 简化为 3 个核心模块，参考 useChapterRegeneration    |
| 2025-10-29 | Kiro   | 精简至 100 行                                       |
