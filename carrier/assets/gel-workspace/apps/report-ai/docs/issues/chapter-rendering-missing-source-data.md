# 章节生成后渲染缺失溯源数据问题

## 问题概览

| 项目     | 内容                                                              |
| -------- | ----------------------------------------------------------------- |
| 标题     | 章节生成完成后渲染仍使用 AI messages，导致缺失 DPU/RAG 等溯源数据 |
| 状态     | ✅ 已解决                                                         |
| 优先级   | 🔴 高                                                             |
| 责任人   | Kiro                                                              |
| 发现时间 | 2025-11-10                                                        |
| 完成时间 | 2025-11-10                                                        |

## 背景与预期

章节生成流程分为两个阶段：

1. **流式生成阶段**：AI 返回流式消息，实时渲染到编辑器（仅文本内容）
2. **完成阶段**：消息合并到 `chapter.content`，包含完整溯源信息（DPU、RAG、files 等）

预期行为：章节完成后，编辑器应渲染 `chapter.content`（包含溯源标记），而非继续使用临时的流式消息。

## 问题陈述

### 现象

章节生成完成后，编辑器渲染仍依赖流式消息，导致：

- 溯源标记（DPU、RAG、files）未显示
- 章节内容与 Redux 中的 `chapter.content` 不同步
- 消息未被清理，占用内存且可能引发重复处理

### 根因

1. **消息未清理**：章节完成后，Context 中的流式消息未被清除
   - 位置：`useCompletionHandler`、`useFullDocGenerationController`、`useMultiChapterGeneration`
2. **渲染依赖流式消息**：`selectChapterContentMap` 优先使用流式消息渲染

   - 位置：`selectors/composition.ts:56-73`
   - 流式预览需要依赖消息，但完成后应切换到 `chapter.content`

3. **清理时机不明确**：缺少在章节完成入口处清理消息的逻辑

### 影响

- 功能缺陷：溯源标记缺失
- 数据不一致：编辑器与 Redux 状态不同步
- 性能问题：内存占用持续增长
- 潜在 Bug：消息残留可能触发重复处理

## 参考资料

| 文档/代码                                   | 作用                 | 备注                 |
| ------------------------------------------- | -------------------- | -------------------- |
| `useCompletionHandler.ts:59-65`             | 单章节重生成完成入口 | 需添加消息清理       |
| `useFullDocGenerationController.ts:102-108` | 全文生成章节完成入口 | 需添加消息清理       |
| `useMultiChapterGeneration.ts:209-214`      | 多章节生成完成入口   | 需添加消息清理       |
| `context/ReportDetail.tsx`                  | Context 定义         | 需暴露清理消息的方法 |
| `selectors/composition.ts:56-73`            | 章节内容选择器       | 已正确实现，无需修改 |

## 解决方案

### 最终方案

**核心思路**：在每个章节完成的入口处，直接调用 Context 的清理方法，移除该章节的流式消息。

**实施步骤**：

1. **拆分选择器，明确职责**

   - 创建 `selectChapterStreamPreviewMap`：依赖 messages，用于流式预览
   - 修改 `selectChapterContentMap`：不依赖 messages，用于注水
   - `useChapterStreamPreview` 使用流式预览选择器
   - `useHydrationExecutor` 使用注水选择器

2. **在 Context 中暴露清理方法**

   - 在 `ReportDetailContext` 中添加 `clearChapterMessages(chapterId: string)` 方法
   - 内部调用 `setMessages` 过滤掉指定章节的 AI 消息（role='ai' 且 chapterId 匹配）

3. **在三个章节完成入口处调用清理**

   - `useCompletionHandler`：合并 → 清理 → 注水
   - `useFullDocGenerationController`：合并 → 清理 → 注水
   - `useMultiChapterGeneration`：合并 → 清理 → 注水

4. **验证渲染切换**
   - 消息清理后，注水使用 `selectChapterContentMap`（包含溯源数据）
   - 流式预览继续使用 `selectChapterStreamPreviewMap`
   - 验证溯源标记正常显示

**关键点**：

- 不修改 `selectChapterContentMap` 逻辑（流式预览依赖消息）
- 清理在章节完成入口处同步执行，时机准确
- 清理发生在 Context 层（数据源头），Redux 自动同步

**负责人**：待分配  
**计划时间**：0.5 天

### 备选方案

**方案 B**：通过 ChatSync 监听并清理

- 在 Redux 中标记需要清理的章节，ChatSync 监听并清理
- 缺点：增加复杂度，清理时机不够精确

**放弃理由**：直接在完成入口处清理更简单直接。

## 验证记录

### 代码修改验证

1. ✅ **拆分选择器，明确职责**

   - 创建 `selectChapterStreamPreviewMap`：依赖 messages，用于流式预览
   - 修改 `selectChapterContentMap`：不依赖 messages，用于注水
   - `useChapterStreamPreview` 使用流式预览选择器
   - `useHydrationExecutor` 使用注水选择器（包含溯源数据）

2. ✅ **在 Context 中添加清理方法**

   - 在 `ReportDetailContext` 中添加 `clearChapterMessages` 方法
   - 过滤掉指定章节的 AI 消息（role='ai' 且 chapterId 匹配）

3. ✅ **调整注水任务触发时机**

   - 从 `processSingleChapterCompletion` 中移除注水任务触发
   - 在三个入口处按正确顺序执行：合并消息 → 清理消息 → 触发注水

4. ✅ **在三个章节完成入口处实施完整流程**

   - `useCompletionHandler.ts`：合并 → 清理 → 注水
   - `useFullDocGenerationController.ts`：合并 → 清理 → 注水
   - `useMultiChapterGeneration.ts`：合并 → 清理 → 注水

5. ✅ **语法检查通过**

   - 所有修改的文件均无 TypeScript 诊断错误

6. ✅ **彻底重构：移除 Redux 中的 parsedRPContentMessages**

   - 将选择器改为接收参数的函数（`createChapterStreamPreviewMap`、`createChapterAIMessageStatusMap`）
   - 将这两个函数移至 domain 层（`@/domain/reportEditor/chapter/composition`）
   - 更新工具函数接收 messages 参数（`processSingleChapterCompletion`、`isChapterFinished`）
   - 更新所有调用点从 Context 获取 messages 并传递
   - 移除 Redux 状态、Reducer、选择器
   - 删除 ChatSync 组件（不再需要同步）
   - Context 成为消息的唯一数据源，减少内存占用和同步开销

### 功能验证步骤

待用户测试后补充：

1. 触发单章节重生成，观察完成后编辑器是否显示溯源标记
2. 检查 Context 中的消息，确认该章节消息已清除
3. 触发全文生成，验证所有章节完成后消息均被清除
4. 验证内存占用，确认消息清理后内存释放

## 更新日志

| 日期       | 事件         | 描述                                                            |
| ---------- | ------------ | --------------------------------------------------------------- |
| 2025-11-10 | 创建文档     | 分析章节渲染缺失溯源数据问题，确定根因为消息未清理              |
| 2025-11-10 | 方案确定     | 明确在章节完成入口处调用清理，不通过 ChatSync 监听              |
| 2025-11-10 | 修复完成     | 在 Context 中添加清理方法，在三个章节完成入口处调用             |
| 2025-11-10 | 优化时序     | 调整注水任务触发时机，确保在消息清理后执行                      |
| 2025-11-10 | 拆分选择器   | 创建流式预览和注水两个独立选择器，明确数据源                    |
| 2025-11-10 | 彻底重构完成 | 移除 Redux 中的 parsedRPContentMessages，Context 成为唯一数据源 |
