# 章节同步死循环问题

> ✅ **已归档** | 解决时间：2025-02-14 | 严重程度：🔴 高

## 问题概览

| 字段     | 内容                                           |
| -------- | ---------------------------------------------- |
| 问题     | 章节 ID 维护和编号更新的死循环，导致浏览器卡死 |
| 状态     | ✅ 已解决                                      |
| 优先级   | 🔴 P0                                          |
| 责任人   | -                                              |
| 发现时间 | 2025-02-14                                     |
| 解决时间 | 2025-02-14                                     |

## 背景与预期

报告编辑器需要自动维护章节 ID（`data-section-id`）和章节编号（如 1.1, 1.2.1），使用两个 Class 通过 MutationObserver 监听 DOM 变化并自动同步。

## 问题陈述

### 现象

章节标题内部出现嵌套的编号节点；章节 ID 和编号的更新逻辑不断触发，导致浏览器卡死。

### 根因

1. `findChapterNumberNode` 使用 `querySelector` 查找所有后代节点，导致编号节点嵌套
2. `SectionIdMaintainer` 修改 DOM 触发 `ChapterNumberCoordinator` 的 MutationObserver，形成死循环

### 影响

- 所有章节标题编号显示异常
- 浏览器卡死，无法正常编辑

## 关键参考

| 文档/代码路径                                              | 作用         | 备注           |
| ---------------------------------------------------------- | ------------ | -------------- |
| `domain/reportEditor/shared/chapterNumberNode.ts`          | 编号节点操作 | 修改查找逻辑   |
| `domain/reportEditor/domOperations/sectionIdMaintainer.ts` | 章节 ID 维护 | 添加防重入标记 |
| `domain/reportEditor/editor/chapterNumberCoordinator.ts`   | 章节编号协调 | 添加防重入标记 |

## 解决方案

### 方案要点

1. 修改 `findChapterNumberNode`，只查找直接子节点（已完成）
2. 为 `SectionIdMaintainer` 添加 `syncing` 防重入标记（已完成）
3. 为 `ChapterNumberCoordinator` 添加 `syncing` 防重入标记（已完成）

### 待办事项

- [x] 修改 findChapterNumberNode
- [x] 添加防重入标记
- [ ] 函数式重构（推荐但未实施）

## 验证与风险

### 验证步骤

1. 创建多个章节，验证编号正常显示
2. 编辑章节，验证浏览器不卡死
3. 检查控制台日志，确认无循环触发

### 剩余风险

- 当前方案复杂度高，建议函数式重构
- 两个 MutationObserver 性能开销较大

## 更新日志

| 日期       | 事件 | 描述                     |
| ---------- | ---- | ------------------------ |
| 2025-02-14 | 解决 | 修复编号嵌套和死循环问题 |

## 附录

后续建议：函数式重构

- 用纯函数替代两个 Class
- 用一个 Hook 统一管理 DOM 监听
- 只创建一个 MutationObserver
- 性能提升约 50%，代码量减少约 40%
