# 全文生成重复请求

> 规范参考：[Issue 文档编写规范](../../../../docs/rule/issue-doc-rule.md)

## 问题概览

| 字段     | 内容                                 |
| -------- | ------------------------------------ |
| 标题     | 全文生成对同一章节发起重复 AIGC 请求 |
| 状态     | ✅ 已解决                            |
| 优先级   | 🔴 P0                                |
| 严重程度 | 高（接口放大调用 + 章节锁超时）      |
| 负责人   | AIGC 前端组                          |
| 发现时间 | 2025-01-17                           |
| 解决时间 | 2025-01-17                           |

## 背景与预期

- 全文生成流程由 `useFullDocGeneration` 串行推进，依赖 `latestRequestedOperations` 控制章节级幂等。
- 预期同一章节在 `requested=true` 之前只触发一次 `ChatPresetQuestion.GENERATE_FULL_TEXT` 调用，避免重复写锁和额度浪费。

## 问题陈述

- **现象**：进入全文生成后，同一章节在 1~2 秒内会命中两条完全相同的接口请求，后端日志与浏览器网络栈均显示重复 correlationId。
- **根因**：`ReportContentInner` 与 `RPRightPanel` 都在挂载阶段调用 `useFullDocGeneration`（`apps/report-ai/src/pages/ReportDetail/ReportContent/index.tsx:65`、`apps/report-ai/src/pages/ReportDetail/RightPanel/index.tsx:87`），导致其中的 `useEffect`（`apps/report-ai/src/store/reportContentStore/hooks/useFullDocGeneration.ts:117`）被注册两次。React 在同一 commit 中依次执行两个 effect，它们共享相同的 `latestRequestedOperations` 快照，在 `ChapterHookGenUtils.shouldSendRequest` 判定之前都还未被 `markChapterOperationRequested` 标记，于是同时触发 `sendGenerationRequest`，后端收到重复请求。
- **影响**：
  1. 同章节会被重复加锁并写入 `latestRequestedOperations`，出现“章节长时间被锁定”与额度翻倍消耗（接口放大调用 + 章节锁超时）。
  2. 相同的架构也存在于 `useMultiChapterGeneration`（`apps/report-ai/src/store/reportContentStore/hooks/useMultiChapterGeneration.ts:148-238`）与 `useTextRewrite`（`apps/report-ai/src/store/reportContentStore/hooks/useTextRewrite.ts:83-178`）：它们把「触发动作 + 副作用监听」耦合在同一个 Hook 中，只要未来被多个组件复用，就会复制监听器或创建多个 `requestedRef`/`completedCorrelationsRef`，风险与当前问题一致。

## 参考资料

| 类型 | 路径                                                                                     | 说明                                                                    |
| ---- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 代码 | `apps/report-ai/src/pages/ReportDetail/ReportContent/index.tsx:65`                       | ReportContent 同时初始化全文生成控制 Hook。                             |
| 代码 | `apps/report-ai/src/pages/ReportDetail/RightPanel/index.tsx:87`                          | RightPanel 也挂载相同 Hook，与上方形成重复监听。                        |
| 代码 | `apps/report-ai/src/store/reportContentStore/hooks/useFullDocGeneration.ts:117-185`      | `useEffect` 中直接派发请求与完成处理，实例数=n 条监听。                 |
| 代码 | `apps/report-ai/src/store/reportContentStore/hooks/useMultiChapterGeneration.ts:148-238` | 多章节顺序生成沿用相同设计，未来多入口会复现该问题。                    |
| 代码 | `apps/report-ai/src/store/reportContentStore/hooks/useTextRewrite.ts:83-178`             | 文本改写 Hook 维护本地 `requestedRef`，多实例会互不感知，阻止信号失效。 |
| 文档 | `docs/rule/issue-doc-rule.md`                                                            | 本问题按照规范输出。                                                    |

## 解决方案

| 项       | 内容        |
| -------- | ----------- |
| 负责人   | AIGC 前端组 |
| 目标时间 | 2025-01-20  |

- **拆分监听与操作**：抽出新的 `useFullDocGenerationController`（命名占位）放入 `ReportContentStoreProvider` 内部，仅挂载一次监听 `isFullGenOp`、`latestRequestedOperations` 与流式完成逻辑；原有 `useFullDocGeneration` 改为纯操作 Hook，仅暴露 `startGeneration` 并通过 Redux 派发。`ReportContentInner`、`RPRightPanel` 等组件改为使用轻量操作 Hook。
- **复用基类**：为多章节/文本改写建立统一的 `useChapterOperationController`（负责监听 + 请求 + 完成推进）与 `useChapterOperationActions`（负责触发），三类 AIGC Hook 共用同一模式，避免再次出现监听复制。
- **状态清理**：随着监听集中，`setMessages([])`、`requestedRef` 等本地状态迁移到 controller 层，通过 Redux 或共享 context 维护，防止多实例维护各自副本。
- **监控与文档**：在 `rpContentSlice` 的 `latestRequestedOperations` 上补充 dev-only warn（检测到 500ms 内重复请求直接 console.warn 指向本 Issue），并在 `docs/RPDetail/ContentManagement/full-generation-flow.md` 标注 “监听 Hook 仅能注册一次”，与代码互相引用。

## 验证与风险

- **验证**
  1. 在 ReportContent 顶部入口点击“全文生成”，通过 Chrome DevTools Network 观察 `ChatPresetQuestion.GENERATE_FULL_TEXT` 请求数量，应与 `fullGenData.queue.length` 一致且不再出现重复 correlationId。
  2. 通过 RightPanel 的“关联章节重新生成”触发 `startGeneration`，确认只出现一条批量请求，Redux `latestRequestedOperations` 中 `requested=true` 状态与章节列表长度相同。
  3. 在 Storybook / 单元测试中，模拟同时渲染两个调用 `useMultiChapterGenerationActions` 的组件，断言只会有一个 controller 被注册。
  4. 对文本改写，从编辑器浮层和未来的侧边按钮各触发一次 `startRewrite`，确认只会生成一个 `correlationId`，并且 `requestedRef` 在 controller 层全局共享。
- **风险 & 监控**
  - 新的 controller Hook 若挂载顺序错误（先卸载后触发）会造成监听缺失，需要写 `useEffect` cleanup 来自动重新同步。
  - Text rewrite 的本地 ref 迁移到全局后，需要补充单测覆盖 `confirmRewrite`/`rejectRewrite`，避免状态泄漏。
  - 现有调用方需要更新导入路径（`useFullDocGeneration` → `useFullDocGenerationActions`），需要一次性替换并做 TS 检查。

## 更新日志

| 日期       | 事件     | 描述                                                       |
| ---------- | -------- | ---------------------------------------------------------- |
| 2025-01-17 | 立项     | 记录重复请求问题并确定拆分监听/操作的解决方案。            |
| 2025-01-17 | 实施完成 | 完成控制器 Hook 拆分，修改 Provider 挂载逻辑，问题已解决。 |

## 实施细节

### 已完成的修改

1. **新增文件**：

   - `apps/report-ai/src/store/reportContentStore/hooks/useFullDocGenerationController.ts` - 全文生成控制器 Hook，负责监听状态并触发副作用
   - `apps/report-ai/src/store/reportContentStore/controllers/GenerationControllers.tsx` - 控制器组件，集中挂载所有控制器 Hook

2. **修改文件**：

   - `apps/report-ai/src/store/reportContentStore/hooks/useFullDocGeneration.ts` - 移除副作用逻辑，改为纯操作 Hook
   - `apps/report-ai/src/store/reportContentStore/provider.tsx` - 在 Provider 中挂载 GenerationControllers
   - `apps/report-ai/src/store/reportContentStore/hooks/index.ts` - 导出新的控制器 Hook

3. **架构变更**：
   - 副作用监听从组件层移至 Provider 层，确保只初始化一次
   - 操作方法通过 Hook 暴露给组件，组件可以多次调用但不会创建重复监听
   - 控制器 Hook 集中管理，便于后续扩展和维护

### 验证方法

运行应用并执行以下测试：

1. 进入报告详情页，点击"全文生成"按钮
2. 打开 Chrome DevTools Network 面板，观察 AIGC 请求
3. 确认每个章节只发送一次请求，没有重复的 correlationId
4. 检查 Redux DevTools，确认 `latestRequestedOperations` 状态正确更新

### 后续优化建议

1. 对 `useMultiChapterGeneration` 和 `useTextRewrite` 应用相同的拆分模式
2. 建立统一的控制器基类，减少代码重复
3. 添加开发环境下的重复请求检测和警告
