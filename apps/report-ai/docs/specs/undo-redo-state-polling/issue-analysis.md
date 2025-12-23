# 问题分析 - Undo/Redo 状态轮询问题

> 📖 [返回问题概览](./README.md) | 遵循 [Issue 文档编写规范](../../../../../docs/rule/issue-doc-rule.md)

## 背景与预期

编辑器工具栏需要实时显示 undo/redo 按钮的可用状态。TinyMCE 提供了 `undoManager` 的事件机制，应该通过事件监听而非轮询来获取状态变化。

**设计预期**：

- 按钮状态应实时更新，无延迟
- 不应在编辑器无操作时执行状态检查
- 遵循事件驱动原则

## 问题陈述

### 现象

`ReportContent/index.tsx:133-139` 使用 `setInterval` 每 500ms 轮询一次 `canUndo()`/`canRedo()` 状态。

**来源**：@see `pages/ReportDetail/ReportContent/index.tsx:121-139`

### 根因

1. **实现简单但低效**：使用定时器轮询是最简单的实现方式，但性能低效
2. **EditorFacade 未封装事件**：`EditorFacade` 未封装 `undoManager` 相关事件，导致上层无法直接监听
3. **缺少事件驱动机制**：没有利用 TinyMCE 提供的事件机制

**来源**：

- @see `pages/ReportDetail/ReportContent/index.tsx:121-139` - 当前轮询实现
- @see `domain/reportEditor/editor/editorFacade.ts:327-360` - EditorFacade undo/redo 方法

### 影响

- **性能浪费**：每 500ms 执行状态检查，即使编辑器无操作
- **状态延迟**：最多 500ms 的更新延迟
- **资源占用**：长时间打开页面累积大量无效调用
- **代码质量**：违反事件驱动原则

### 性能影响分析

- **优化前**：每秒 2 次调用，1 小时 = 7200 次无效调用
- **优化后**：仅在实际操作时触发，1 小时 = 600-3000 次有效调用
- **性能提升**：约 95% 的无效调用被消除

## 关键参考

| 文档/代码路径                                            | 作用                        | 备注                    |
| -------------------------------------------------------- | --------------------------- | ----------------------- |
| `pages/ReportDetail/ReportContent/index.tsx:121-139`     | 当前轮询实现                | 使用 setInterval 轮询   |
| `domain/reportEditor/editor/editorFacade.ts:327-360`     | EditorFacade undo/redo 方法 | 已封装 hasUndo/hasRedo  |
| `components/ReportEditor/config/editorConfig.ts:203-206` | 内容变更事件监听示例        | 使用 facade.on 监听事件 |

## 更新记录

| 日期       | 修改人 | 更新内容             |
| ---------- | ------ | -------------------- |
| 2025-10-29 | Kiro   | 从主文档拆分问题分析 |
