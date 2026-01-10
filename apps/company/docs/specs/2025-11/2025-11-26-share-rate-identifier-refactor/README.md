title: ShareRateIdentifier 展示逻辑重构
resolved_at: 2025-11-26
owner: Kiro
source: 代码优化需求
status: ✅ 已完成
domain: 企业详情
version: v1
---

# ShareRateIdentifier 展示逻辑重构

[返回 Spec 索引](/docs/specs/README.md)

## 任务概览

| 项目     | 内容                                     |
| -------- | ---------------------------------------- |
| 任务来源 | 代码优化需求                             |
| 负责人   | Kiro                                     |
| 上线目标 | 简化股权比例展示逻辑，统一使用后端字段   |
| 当前版本 | v1                                       |
| 关联文档 | [spec-design-v1.md](./spec-design-v1.md) |
| 状态     | ✅ 已完成                                |

## 背景

当前股权比例展示使用前端格式化（`displayPercent`、`formatPercent` 等），逻辑复杂。后端已提供 `showShareRate` 字段，统一使用该字段 + `formatText` 包装。

## 涉及模块

8 个列表模块 + 1 个弹窗（showRoute）：

- 受益所有人/自然人/机构
- 历史受益人/实控人
- 疑似实控人/公告披露实控人
- 股东穿透

## 子文档

- [spec-design-v1.md](./spec-design-v1.md) - 方案设计
- [spec-implementation-plan-v1.md](./spec-implementation-plan-v1.md) - 实施计划

## 更新记录

| 日期       | 修改人 | 更新内容       |
| ---------- | ------ | -------------- |
| 2024-11-24 | Kiro   | 初始化文档结构 |
| 2025-11-26 | AI     | 归档文档       |
