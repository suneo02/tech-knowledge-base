# 注水改为队列的可行性与改造方案

## 任务概览

| 项目 | 内容 |
| --- | --- |
| 任务来源 | 注水（Rehydration）是否改为队列更合理？ |
| 负责人 | 待指派 |
| 上线目标 | 将注水任务从单任务模型改为队列模型，提高系统稳定性和可观测性 |
| 当前版本 | v1.0 |
| 关联文档 | [原Issue](../issues/rehydration-queue-issues.md) |

## 背景与上下文

现有架构采用"Redux 决策 + Executor 执行，逐章节注水"的模式，完成检测在各控制器中触发，随后由执行器写入编辑器。设计基线：全文生成与章节重生成均为"逐章节生成 + 逐章节注水"。参见 `apps/report-ai/src/store/reportContentStore/hooks/rehydration/HYDRATION.md:117`。

## 需求提炼

### 必达能力
1. 支持多生产者并发触发注水任务
2. 提供统一顺序、去重与背压控制
3. 避免任务覆盖或遗漏的风险
4. 提供失败重试与优先级控制
5. 提高系统可观测性与稳态能力

### 约束条件
1. 与现有体验保持一致：仍为逐章节注水，不改变用户的实时可见效果
2. 保持与现有状态管理机制的兼容性
3. 确保改造过程中不影响现有功能

## 方案设计

### 问题根因
1. **单任务模型缺陷**：执行层以单任务消费并在完成后回写 idle，未管理任务队列：
   - 位置：`apps/report-ai/src/store/reportContentStore/hooks/rehydration/useHydrationExecutor.ts:85`

2. **直接触发单值任务**：完成检测在不同控制器中直接触发 setHydrationTask（单值），未入队：
   - 单章重生完成触发：`apps/report-ai/src/store/reportContentStore/hooks/rehydration/useCompletionHandler.ts:74`
   - 全文生成当前章完成触发：`apps/report-ai/src/store/reportContentStore/hooks/useFullDocGenerationController.ts:114`
   - 多章节顺序生成当前章完成触发：`apps/report-ai/src/store/reportContentStore/hooks/useMultiChapterGeneration.ts:222`

3. **缺少队列结构**：决策层仅维护 currentTask，无队列结构：
   - 位置：`apps/report-ai/src/store/reportContentStore/reducers/hydrationReducers.ts:25、34`
   - 类型定义：`apps/report-ai/src/types/report/generation.ts:201` 中的 RPHydrationState 未包含队列

### 解决方案设计
将注水任务改为"队列 + 单消费者"的模型：

1. **状态层改造**：在 RPHydrationState 增加 pendingTasks（FIFO），保留 currentTask 作为队首。

2. **Reducers改造**：新增 enqueueHydrationTask/dequeueHydrationTask；completeHydrationTask 完成后若队列非空自动推进队首为新的 currentTask。

3. **触发点修改**：在 useCompletionHandler、全文与多章节控制器中，将原 setHydrationTask 改为 enqueue，并保留 correlationId（用于日志与兜底）。

4. **执行层改造**：useHydrationExecutor 读取队首任务→执行→完成→推进，实现单消费者顺序消费；提供去重策略（同章只保留最新）、基础背压（同一时间只处理一个任务）。

5. **兜底与可观测性**：沿用 activeOperations 查找与临时 ID 策略；增加基础 metrics（队列长度、平均耗时、失败计数）。

## 实施拆解

| 子任务 | 模块 | 方法 | 负责人 | 预计交付时间 |
| ---- | ---- | ---- | ---- | --- |
| 1. 状态层改造 | RPHydrationState | 添加pendingTasks字段 | 待指派 | TBD |
| 2. Reducers改造 | hydrationReducers | 添加队列操作方法 | 待指派 | TBD |
| 3. 触发点修改 | 各控制器 | 改用enqueue方法 | 待指派 | TBD |
| 4. 执行层改造 | useHydrationExecutor | 实现队列消费逻辑 | 待指派 | TBD |
| 5. 可观测性增强 | 监控系统 | 添加队列指标 | 待指派 | TBD |
| 6. 测试验证 | 整体流程 | 功能测试 | 待指派 | TBD |

## 验收记录

### 功能验收用例
1. 单章节重生成：完成后生成一条队列任务，被正确消费并写入编辑器（包含 correlationId 验证）。
2. 全文逐章节生成：每个章节完成分别入队，按顺序消费，不发生覆盖或乱序。
3. 并发两章完成：两条任务均入队且依次执行，无丢失；同章重复完成仅保留最新一次。
4. 缺失 correlationId：通过 activeOperations 查找最新 pending 操作或生成临时 ID，任务仍可执行并记录告警。
5. 失败重试：注水执行失败后记录失败计数，确保队列继续推进；必要时加入简易重试策略。

### 非功能风险
- 队列长度可能无限增长，需要考虑限流机制
- 需要确保队列操作不会影响现有性能

## 实现说明

### 与设计差异
- 暂未实现，待实施后补充

### 关键PR
- 暂无，待实施后补充

### 可复用经验
- 暂无，待实施后补充

## 更新记录

| 日期 | 修改人 | 更新内容 |
| --- | --- | --- |
| 2025-11-13 | - | 初始化问题分析与改造建议 |
| 2025-01-09 | - | 从Issue文档转换为Spec格式，创建初始版本 |

---
**状态**：🚧 进行中  
**创建时间**：2025-11-13  
**优先级**：🟡 中  
**影响范围**：注水系统  
**预估工期**：3-4 人日