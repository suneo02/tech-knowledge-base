# 章节生成后渲染缺失溯源数据问题修复

## 任务概览

| 项目 | 内容 |
| --- | --- |
| 任务来源 | 章节生成完成后渲染仍使用 AI messages，导致缺失 DPU/RAG 等溯源数据 |
| 负责人 | Kiro |
| 上线目标 | 修复章节生成完成后渲染缺失溯源数据问题，确保溯源标记正确显示 |
| 当前版本 | v1.0 |
| 关联文档 | [原Issue](../issues/archived/chapter-rendering-missing-source-data.md) |
| 状态 | ✅ 已完成 |

## 背景与上下文

章节生成流程分为两个阶段：

1. **流式生成阶段**：AI 返回流式消息，实时渲染到编辑器（仅文本内容）
2. **完成阶段**：消息合并到 `chapter.content`，包含完整溯源信息（DPU、RAG、files 等）

预期行为：章节完成后，编辑器应渲染 `chapter.content`（包含溯源标记），而非继续使用临时的流式消息。

## 需求提炼

### 必达能力
1. 章节完成后编辑器渲染包含溯源标记的内容
2. 章节内容与 Redux 中的 `chapter.content` 保持同步
3. 章节完成后清理流式消息，释放内存
4. 避免消息残留可能引发的重复处理
5. 保持现有功能不受影响

### 约束条件
1. 不影响现有功能
2. 保持用户体验一致
3. 确保修复过程中系统稳定性
4. 与现有状态管理机制兼容

## 方案设计

### 问题根因
1. **消息未清理**：章节完成后，Context 中的流式消息未被清除
2. **渲染依赖流式消息**：`selectChapterContentMap` 优先使用流式消息渲染
3. **清理时机不明确**：缺少在章节完成入口处清理消息的逻辑

### 解决方案设计
**核心思路**：在每个章节完成的入口处，直接调用 Context 的清理方法，移除该章节的流式消息。

1. **拆分选择器，明确职责**：
   - 创建 `selectChapterStreamPreviewMap`：依赖 messages，用于流式预览
   - 修改 `selectChapterContentMap`：不依赖 messages，用于注水
   - `useChapterStreamPreview` 使用流式预览选择器
   - `useHydrationExecutor` 使用注水选择器

2. **在 Context 中暴露清理方法**：
   - 在 `ReportDetailContext` 中添加 `clearChapterMessages(chapterId: string)` 方法
   - 内部调用 `setMessages` 过滤掉指定章节的 AI 消息（role='ai' 且 chapterId 匹配）

3. **在三个章节完成入口处调用清理**：
   - `useCompletionHandler`：合并 → 清理 → 注水
   - `useFullDocGenerationController`：合并 → 清理 → 注水
   - `useMultiChapterGeneration`：合并 → 清理 → 注水

4. **彻底重构：移除 Redux 中的 parsedRPContentMessages**：
   - 将选择器改为接收参数的函数（`createChapterStreamPreviewMap`、`createChapterAIMessageStatusMap`）
   - 将这两个函数移至 domain 层（`@/domain/reportEditor/chapter/composition`）
   - 更新工具函数接收 messages 参数（`processSingleChapterCompletion`、`isChapterFinished`）
   - 更新所有调用点从 Context 获取 messages 并传递
   - 移除 Redux 状态、Reducer、选择器
   - 删除 ChatSync 组件（不再需要同步）
   - Context 成为消息的唯一数据源，减少内存占用和同步开销

## 实施拆解

| 子任务 | 模块 | 方法 | 负责人 | 预计交付时间 |
| ---- | ---- | ---- | ---- | --- |
| 1. 拆分选择器 | selectors/composition.ts | 创建流式预览和注水选择器 | 已完成 | 2025-11-10 |
| 2. 添加清理方法 | ReportDetailContext | 实现clearChapterMessages | 已完成 | 2025-11-10 |
| 3. 调整注水任务触发时机 | 多个模块 | 修改触发顺序 | 已完成 | 2025-11-10 |
| 4. 在完成入口处实施完整流程 | 三个控制器 | 实施合并→清理→注水 | 已完成 | 2025-11-10 |
| 5. 彻底重构 | 多个模块 | 移除Redux中的消息 | 已完成 | 2025-11-10 |
| 6. 测试验证 | 测试 | 验证溯源标记显示 | 已完成 | 2025-11-10 |

## 验收记录

### 功能验收用例
1. **单章节重生成验证**：触发单章节重生成，观察完成后编辑器是否显示溯源标记
2. **消息清理验证**：检查 Context 中的消息，确认该章节消息已清除
3. **全文生成验证**：触发全文生成，验证所有章节完成后消息均被清除
4. **内存占用验证**：验证内存占用，确认消息清理后内存释放
5. **多章节生成验证**：验证多章节生成时溯源标记正确显示

### 非功能风险
- 清空消息可能影响其他依赖消息历史的功能（需要回归测试）
- 如果全文生成也需要类似处理，需要同步修改
- 并发操作时需要确保消息清空的时机正确

## 实现说明

### 与设计差异
- 完全按照设计方案实现，无差异

### 关键PR
- 暂无，待补充

### 可复用经验
1. Context 作为唯一数据源可以减少内存占用和同步开销
2. 明确的数据流向和职责分离可以提高代码可维护性
3. 及时清理不需要的数据可以避免内存泄漏和潜在bug

## 更新记录

| 日期 | 修改人 | 更新内容 |
| --- | --- | --- |
| 2025-11-10 | Kiro | 分析章节渲染缺失溯源数据问题，确定根因为消息未清理 |
| 2025-11-10 | Kiro | 明确在章节完成入口处调用清理，不通过 ChatSync 监听 |
| 2025-11-10 | Kiro | 在 Context 中添加清理方法，在三个章节完成入口处调用 |
| 2025-11-10 | Kiro | 调整注水任务触发时机，确保在消息清理后执行 |
| 2025-11-10 | Kiro | 拆分选择器，创建流式预览和注水两个独立选择器，明确数据源 |
| 2025-11-10 | Kiro | 彻底重构完成，移除 Redux 中的 parsedRPContentMessages，Context 成为唯一数据源 |
| 2025-01-09 | - | 从Issue文档转换为Spec格式，创建初始版本 |

---
**状态**：✅ 已完成  
**创建时间**：2025-11-10  
**优先级**：🔴 高  
**影响范围**：章节生成渲染机制  
**预估工期**：1 人日  
**实际工期**：1 人日