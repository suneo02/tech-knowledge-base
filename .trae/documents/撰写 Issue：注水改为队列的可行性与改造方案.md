我将按照 docs/rule/issue-doc-rule.md 的结构，创建 Issue 文档并放置在 apps/report-ai/docs/issues/rehydration-queue-issues.md，内容包含：

- 问题概览：状态（🚧 进行中）、优先级（🟡 中）、责任人与目标上线时间（占位，待你确认）
- 背景与预期：当前“Redux 决策 + Executor 执行、逐章节注水”的设计基线（参考 HYDRATION.md 第4节）
- 问题陈述：
  - 现象：现有模型使用单任务 currentTask，可能在多生产者/并发完成时出现任务覆盖或遗漏风险
  - 根因代码引用：
    - useHydrationExecutor 以单任务消费并在完成后 idle（apps/report-ai/src/store/reportContentStore/hooks/rehydration/useHydrationExecutor.ts:85）
    - useCompletionHandler/全文/多章节控制器在完成后直接 setHydrationTask（apps/report-ai/src/store/reportContentStore/hooks/rehydration/useCompletionHandler.ts:74、apps/report-ai/src/store/reportContentStore/hooks/useFullDocGenerationController.ts:114、apps/report-ai/src/store/reportContentStore/hooks/useMultiChapterGeneration.ts:222）
    - hydrationReducers 仅维护 currentTask（apps/report-ai/src/store/reportContentStore/reducers/hydrationReducers.ts:25、34）
    - RPHydrationState 当前无队列（apps/report-ai/src/types/report/generation.ts:201）
  - 影响：并发/高频完成场景下缺少顺序、去重、背压与重试能力
- 解决方案（建议）：将注水任务改为“队列 + 单消费者”模型：
  - 状态层：RPHydrationState 增加 pendingTasks（FIFO），保留 currentTask 为队首
  - reducers：新增 enqueue/dequeue；completeHydrationTask 完成后自动推进队列
  - 触发点：useCompletionHandler / 全文 / 多章节控制器从 setHydrationTask 改为 enqueue，并保留 correlationId
  - 执行层：useHydrationExecutor 读取队首任务→执行→完成→推进，提供去重（同章只保留最新）与基础背压
  - 兜底：沿用 activeOperations 查找与临时 ID 策略，增加基础 metrics（队列长度、平均耗时、失败计数）
- 参考资料表格：列出上述文件路径与设计文档（HYDRATION.md、correlation-id-design.md 等）
- 验证记录：给出 ≤5 条验证步骤（单章重生、全文逐章、并发两章、缺失 correlationId、失败重试）
- 更新日志：初始化记录

请确认后我将据此生成完整 Issue 文档内容并保存到指定路径。