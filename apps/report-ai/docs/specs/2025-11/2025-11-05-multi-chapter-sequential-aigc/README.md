# 多章节顺序 AIGC 实现

## 任务概览

| 字段     | 内容                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------- |
| 任务来源 | [多章节顺序 AIGC 场景](../../RPDetail/ContentManagement/multi-chapter-sequential-aigc-flow.md) |
| 当前阶段 | ⏳ 待实施                                                                                      |
| 复用基线 | `useFullDocGeneration`, `useChapterRegeneration`                                               |

## 核心文档

- [spec-core-v1.md](./spec-core-v1.md) - 实现方案与任务拆解

## 实施任务

| 任务                                  | 预计工时 | 状态 |
| ------------------------------------- | -------- | ---- |
| 实现 `useMultiChapterGeneration` Hook | 4h       | ⏳   |
| 添加 Redux reducers 与 selectors      | 2h       | ⏳   |
| UI 集成（章节多选面板）               | 3h       | ⏳   |
| 测试与验证                            | 2h       | ⏳   |

## 更新记录

| 日期       | 修改人 | 更新内容           |
| ---------- | ------ | ------------------ |
| 2025-11-05 | Kiro   | 创建 spec 精简版本 |
