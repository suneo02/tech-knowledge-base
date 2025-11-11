# Report Content Store Hooks 生命周期职责不清晰

## 问题概览

| 字段         | 内容                                     |
| ------------ | ---------------------------------------- |
| 问题         | 章节/全文 AIGC 生命周期职责交叉与重复触发 |
| 状态         | ✅ 已解决                                 |
| 优先级       | 🟡 中                                      |
| 责任人       | Codex                                     |
| 发现时间     | 2025-10-29                                |
| 目标上线时间 | 待定                                      |
| 关联 Spec    | [spec-design-v1.md](./spec-design-v1.md)   |

## 背景与预期

当前 AIGC 生命周期基于“开始 → 流式消息 → 完成检测 → 注水 → 收尾”的统一基线（`docs/RPDetail/ContentManagement/full-generation-flow.md` 与 `apps/report-ai/src/store/reportContentStore/hooks/rehydration/HYDRATION.md`）。理想状态下，章节重生成与全文生成应复用同一套触发/完成协议，避免多处重复判断。

## 问题陈述

### 现象

1. `startRegeneration` 与 `startFullDocumentGeneration` 分别散落在 Hook 与 reducer 中执行消息清空、章节锁定等操作，调用方难以理解职责分界（`apps/report-ai/src/store/reportContentStore/hooks/useChapterRegeneration.ts:55`、`apps/report-ai/src/store/reportContentStore/reducers/generationReducers.ts:40`）。
2. 同一章节完成流程分别由 `useCompletionHandler` 与 `useFullDocGeneration` 监听消息尾部并触发 `processSingleChapterCompletion`，出现重复的完成检测与注水任务设置（`apps/report-ai/src/store/reportContentStore/hooks/rehydration/useCompletionHandler.ts:40`、`apps/report-ai/src/store/reportContentStore/hooks/useFullDocGeneration.ts:189`）。
3. 全局操作结束点分散：章节重生成在 Hook 内多次调用 `finishGlobalOperation`，全文生成则在 reducer 内 `completeFullDocumentGeneration` 结束，导致状态机行为不一致（`apps/report-ai/src/store/reportContentStore/hooks/rehydration/useCompletionHandler.ts:78`、`apps/report-ai/src/store/reportContentStore/reducers/generationReducers.ts:165`）。
4. “只发送一次”防抖逻辑在两个 Hook 内使用不同的 `ref` 与状态判断，实现方式不统一，未来扩展（如并发章节请求）风险高（`apps/report-ai/src/store/reportContentStore/hooks/useChapterRegeneration.ts:104`、`apps/report-ai/src/store/reportContentStore/hooks/useFullDocGeneration.ts:159`）。

### 根因

1. 启动流程没有共享入口：章节重生成通过 Hook 清理上下文消息，而全文生成在 reducer 内处理锁定与队列，缺乏统一的开始协议。
2. 完成状态依赖消息监听而非统一调度：`useCompletionHandler` 仅关注 `regeneration` 类型操作，全文生成另起监听，未复用同一完成判断。
3. 全局操作状态机缺乏单一出口：两个流程分别在 Hook 与 reducer 中调用 `finishGlobalOperation`，没有等待注水确认的统一标准。

### 影响

- 生命周期判定逻辑重复，实现者难以维护或扩展新的生成模式。
- 出现重复注水或遗漏收尾的潜在风险，影响章节锁定与编辑体验。
- 无法在统一层面添加埋点与错误兜底，增加调试成本。

## 参考资料

| 类型 | 位置                                                                                             | 作用                                   | 备注                    |
| ---- | ------------------------------------------------------------------------------------------------ | -------------------------------------- | ----------------------- |
| 文档 | `docs/RPDetail/ContentManagement/full-generation-flow.md`                                        | 全文生成基线流程                       | 指明统一生命周期期望    |
| 文档 | `apps/report-ai/src/store/reportContentStore/hooks/rehydration/HYDRATION.md`                     | Hydration 编排说明                     | 描述 Correlation 闭环   |
| 代码 | `apps/report-ai/src/store/reportContentStore/hooks/useChapterRegeneration.ts:55`                 | 章节生成启动逻辑                       | Hook 处理上下文清理     |
| 代码 | `apps/report-ai/src/store/reportContentStore/reducers/generationReducers.ts:40`                  | 全文生成启动逻辑                       | Reducer 处理锁定/队列   |
| 代码 | `apps/report-ai/src/store/reportContentStore/hooks/useFullDocGeneration.ts:189`                  | 全文完成检测                           | Hook 内推进队列与完成   |
| 代码 | `apps/report-ai/src/store/reportContentStore/hooks/rehydration/useCompletionHandler.ts:40`       | 章节完成检测                           | 仅覆盖重生成操作        |
| 代码 | `apps/report-ai/src/store/reportContentStore/utils/chapterProcessing.ts:26`                      | 统一章节完成处理                       | 被多处重复调用          |
| 代码 | `apps/report-ai/src/store/reportContentStore/reducers/globalOperationReducers.ts:46`             | 全局操作状态机接口                     | 提供 `finishGlobalOperation` |

## 解决方案概览

| 序号 | 要点 | 负责人 | 计划时间 | 说明 |
| ---- | ---- | ------ | -------- | ---- |
| 1 | 统一启动协议，新增 store 层 `startChapterOperation` | Codex | 2025-10-29 | Hook 仅负责互斥校验与调度 |
| 2 | 重构章节完成监听（保留/替换 `useCompletionHandler`），只处理单章收尾 | Codex | 2025-10-29 | 避免影响全文队列推进 |
| 3 | 标准化 `finishGlobalOperation` 调用时机 | Codex | 2025-10-29 | 等待注水完成后统一收尾 |
| 4 | Redux 持久化“已发送章节”标记 | Codex | 2025-10-29 | `latestRequestedOperations` + `requested` |

## 验证与风险

| 项目 | 内容 |
| ---- | ---- |
| 验证 | 章节/全文生成流程日志比对、Hydration 任务顺序、Vitest + Storybook 回归 |
| 风险 | 生命周期统一后旧组件依赖可能失效；Correlation 绑定需重点回归；Redux 状态扩展需关注序列化兼容 |

## 更新日志

| 日期       | 事件 | 描述                               |
| ---------- | ---- | ---------------------------------- |
| 2025-10-29 | 创建 | 首次梳理章节/全文生成职责交叉问题 |
| 2025-10-29 | 更新 | 统一方案汇总到表格，补充验证与风险 |
| 2025-10-29 | 解决 | 合并共享启动、请求幂等与完成收尾逻辑 |
