# 单章节 AIGC 实施计划

> 📖 回链：[任务概览](./README.md) | 阶段：实施拆解

## 交付目标

- 在 `ReportDetail` 内容管理面板接入单章节生成流程
- 支持触发、取消、重试三类核心操作并保证状态隔离
- 输出可复用的 Hook 与 UI 模块，方便后续章节能力扩展

## 里程碑

| 里程碑               | 目标说明                                             | 截止时间   | 验收标准                        |
| -------------------- | ---------------------------------------------------- | ---------- | ------------------------------- |
| M1: 状态管理就绪     | 单章节状态容器、Hooks 与事件总线打通                 | 2025-11-05 | `chapterGenerationState` 可观测 |
| M2: UI 交互与流程联调 | 章节面板交互、进度条、取消/重试按钮联动              | 2025-11-08 | Storybook 场景全部可用          |
| M3: 文档与测试签收   | 手册、单测、集成测试、监控探针全部落地并通过评审     | 2025-11-11 | CI 无红灯 + 验证用例通过        |

## 子任务拆解

| 顺序 | 子任务 & 交付物                                              | 负责人 | 相关目录                                                              | 预计耗时 | 依赖 |
| ---- | ------------------------------------------------------------ | ------ | --------------------------------------------------------------------- | -------- | ---- |
| T1   | 搭建 `useSingleChapterGenerator` Hook 与状态 Store          | Kiro   | `apps/report-ai/src/modules/aigc/singleChapter/`                      | 2d       | 核心流程校验 |
| T2   | 接入章节卡片触发、取消、重试入口                             | Kiro   | `apps/report-ai/src/pages/ReportDetail/RightPanel/ContentManagement/` | 2d       | T1 |
| T3   | 实现流式回调与线性进度计算，联通注水接口                     | Kiro   | `apps/report-ai/src/modules/aigc/shared/streaming.ts`（新建）         | 1.5d     | T1 |
| T4   | 交付 UI 组件（进度、状态提示、失败处理）与样式               | Kiro   | `.../ContentManagement/ui`                                           | 1.5d     | T2 |
| T5   | 编写 Hook/组件单测与 Storybook，补充流程集成用例             | Kiro   | `apps/report-ai/src/modules/aigc/__tests__/`                          | 2d       | T2-4 |
| T6   | 更新 `single-chapter-aigc-flow.md` 与 Release Note 说明       | Kiro   | `apps/report-ai/docs/RPDetail/ContentManagement/`                     | 1d       | T3-5 |

> ⚙️ 工具集按规范使用 ahooks + lodash + classnames + pnpm；TypeScript + Less Module。

## 实施策略

- **集成面**：仅改动单章节入口与注水逻辑，新代码集中在 `modules/aigc/singleChapter`。
- **流程复用**：直接复用核心流程校验、错误处理，适配请求参数即可。
- **并行节奏**：T2、T3 可穿插推进；T4 依赖 Hook 暴露稳定接口。
- **降级**：保留 Feature Flag，异常时回退到全文生成入口。

## 协作与依赖

- **后端**：确认 `operationType=single_chapter` 核心接口就绪。
- **产品**：冻结入口位置与文案，明确取消/失败提示。
- **QA**：覆盖取消、重试、网络抖动场景，复用 Storybook 进行回归。
- **验收**：执行 [验证计划](./spec-verification-v1.md)，用例通过后再放行 Feature Flag。

## 更新记录

| 日期       | 修改人 | 更新内容                         |
| ---------- | ------ | -------------------------------- |
| 2025-10-30 | Kiro   | 精简实施计划，聚焦核心交付      |
