# 问题分析 - 编辑器 DOM 同步性能优化

> 📖 [返回问题概览](./README.md) | 遵循 [Issue 文档编写规范](../../../../../docs/rule/issue-doc-rule.md)

## 背景与预期

report-ai 编辑器需要为所有章节标题维护唯一的章节 ID（持久化 ID 或临时 ID），以支持章节引用、编号计算等功能。当前通过 `ensureSectionIds` 函数在每次内容变化时扫描并补齐 ID。

**设计预期**：

- 章节 ID 应在标题创建时立即分配
- 编辑正文内容时不应触发 ID 扫描
- 大文档（100+ 章节）编辑时应保持流畅

## 问题陈述

### 现象

#### 1. 高频执行

用户每次输入（input/keyup/change/paste）都会在下一帧触发 `ensureSectionIds`

**来源**：@see `apps/report-ai/src/components/ReportEditor/config/editorConfig.ts:198-206`

**触发路径**：

```
handleContentChange
  → requestDomSync()
  → RAF
  → performSync
  → ensureSectionIds
```

#### 2. 全量扫描

每次执行都会扫描所有标题元素

**来源**：@see `apps/report-ai/src/domain/reportEditor/chapterId/ensureIds.ts:82`

**代码**：`body.querySelectorAll(HEADING_SELECTOR)` 扫描整个文档

#### 3. 无变更检测

即使只编辑正文，也会执行完整的 ID 同步流程

**影响**：不必要的 DOM 查询和遍历

### 根因

1. **事件绑定过于宽泛**：绑定了 4 个编辑事件（input/change/keyup/paste），导致任何内容变化都触发同步
2. **缺少增量更新机制**：未利用编辑器的选区信息，无法判断变更是否涉及标题
3. **防抖策略不足**：RAF 只能合并同一帧内的多次调用，无法应对连续输入

### 影响范围

- **性能影响**：大文档（100+ 章节）场景下，每次输入可能导致卡顿
- **用户体验**：高频输入时可能出现延迟感
- **资源消耗**：不必要的 DOM 查询增加 CPU 占用

## 相关代码位置

| 文件                                                                        | 职责         | 问题相关性              |
| --------------------------------------------------------------------------- | ------------ | ----------------------- |
| `apps/report-ai/src/components/ReportEditor/config/editorConfig.ts:198-206` | 事件绑定     | 绑定了 4 个内容变化事件 |
| `apps/report-ai/src/components/ReportEditor/hooks/useEditorDomSync.ts:132`  | DOM 同步协调 | 执行 ensureSectionIds   |
| `apps/report-ai/src/domain/reportEditor/chapterId/ensureIds.ts:67-118`      | 章节 ID 确保 | 全量扫描标题元素        |
| `apps/report-ai/src/components/ReportEditor/index.tsx:115`                  | 运行时绑定   | 调用 bindEditorRuntime  |

## 更新记录

| 日期       | 修改人 | 更新内容             |
| ---------- | ------ | -------------------- |
| 2025-10-29 | Kiro   | 从主文档拆分问题分析 |
