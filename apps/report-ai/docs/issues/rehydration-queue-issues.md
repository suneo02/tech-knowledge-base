# 注水改为队列的可行性与改造方案

## 问题概览

| 字段 | 内容 |
| --- | --- |
| 标题 | 注水（Rehydration）是否改为队列更合理？ |
| 状态 | 🚧 进行中 |
| 优先级 | 🟡 中 |
| 责任人 | 待定 |
| 发现时间 | 2025-11-13 |
| 目标上线时间 | 待定 |

## 背景与预期
- 现有架构采用“Redux 决策 + Executor 执行，逐章节注水”的模式，完成检测在各控制器中触发，随后由执行器写入编辑器。
- 设计基线：全文生成与章节重生成均为“逐章节生成 + 逐章节注水”。参见 apps/report-ai/src/store/reportContentStore/hooks/rehydration/HYDRATION.md:117。

## 问题陈述
- 现象：当前模型以单任务 currentTask 驱动注水，若存在多生产者并发触发或高频完成事件，可能出现任务覆盖或遗漏的风险，缺少统一顺序、去重与背压控制。
- 根因：
  - 执行层以单任务消费并在完成后回写 idle，未管理任务队列：apps/report-ai/src/store/reportContentStore/hooks/rehydration/useHydrationExecutor.ts:85。
  - 完成检测在不同控制器中直接触发 setHydrationTask（单值），未入队：
    - 单章重生完成触发：apps/report-ai/src/store/reportContentStore/hooks/rehydration/useCompletionHandler.ts:74。
    - 全文生成当前章完成触发：apps/report-ai/src/store/reportContentStore/hooks/useFullDocGenerationController.ts:114。
    - 多章节顺序生成当前章完成触发：apps/report-ai/src/store/reportContentStore/hooks/useMultiChapterGeneration.ts:222。
  - 决策层仅维护 currentTask，无队列结构：apps/report-ai/src/store/reportContentStore/reducers/hydrationReducers.ts:25、apps/report-ai/src/store/reportContentStore/reducers/hydrationReducers.ts:34；RPHydrationState 未包含队列：apps/report-ai/src/types/report/generation.ts:201。
- 影响：在并发或高频完成场景下，可能出现注水任务的覆盖/遗漏；同时难以提供背压、失败重试与优先级控制，降低可观测性与稳态能力。

## 参考资料

| 类型 | 路径 | 作用 | 备注 |
| --- | --- | --- | --- |
| 设计文档 | apps/report-ai/src/store/reportContentStore/hooks/rehydration/HYDRATION.md:87 | 关键时序与互锁，逐章节注水基线 | 全文与单章均逐章节执行 |
| 设计文档 | apps/report-ai/docs/RPDetail/ContentManagement/correlation-id-design.md | Correlation ID 追踪机制 | 兜底匹配与临时 ID |
| 代码 | apps/report-ai/src/store/reportContentStore/hooks/rehydration/useHydrationExecutor.ts:85 | 章节级注水执行与任务完成 | 单任务执行模型 |
| 代码 | apps/report-ai/src/store/reportContentStore/hooks/rehydration/useCompletionHandler.ts:74 | 单章完成后触发注水任务 | setHydrationTask 单值 |
| 代码 | apps/report-ai/src/store/reportContentStore/hooks/useFullDocGenerationController.ts:114 | 全文当前章完成后触发注水任务 | setHydrationTask 单值 |
| 代码 | apps/report-ai/src/store/reportContentStore/hooks/useMultiChapterGeneration.ts:222 | 多章节当前章完成后触发注水任务 | setHydrationTask 单值 |
| 代码 | apps/report-ai/src/store/reportContentStore/reducers/hydrationReducers.ts:25 | 设置/完成注水任务 | 仅维护 currentTask |
| 类型 | apps/report-ai/src/types/report/generation.ts:201 | RPHydrationState 定义 | 无队列字段 |

## 解决方案
- 将注水任务改为“队列 + 单消费者”的模型：
  - 状态层：在 RPHydrationState 增加 pendingTasks（FIFO），保留 currentTask 作为队首。
  - reducers：新增 enqueueHydrationTask/dequeueHydrationTask；completeHydrationTask 完成后若队列非空自动推进队首为新的 currentTask。
  - 触发点修改：在 useCompletionHandler、全文与多章节控制器中，将原 setHydrationTask 改为 enqueue，并保留 correlationId（用于日志与兜底）。
  - 执行层：useHydrationExecutor 读取队首任务→执行→完成→推进，实现单消费者顺序消费；提供去重策略（同章只保留最新）、基础背压（同一时间只处理一个任务）。
  - 兜底与可观测性：沿用 activeOperations 查找与临时 ID 策略；增加基础 metrics（队列长度、平均耗时、失败计数）。
- 与现有体验保持一致：仍为逐章节注水，不改变用户的实时可见效果。

## 验证记录
1. 单章节重生成：完成后生成一条队列任务，被正确消费并写入编辑器（包含 correlationId 验证）。
2. 全文逐章节生成：每个章节完成分别入队，按顺序消费，不发生覆盖或乱序。
3. 并发两章完成：两条任务均入队且依次执行，无丢失；同章重复完成仅保留最新一次。
4. 缺失 correlationId：通过 activeOperations 查找最新 pending 操作或生成临时 ID，任务仍可执行并记录告警。
5. 失败重试：注水执行失败后记录失败计数，确保队列继续推进；必要时加入简易重试策略。

## 更新日志
- 2025-11-13：初始化问题分析与改造建议。

## 附录（可选）
- 无
