# OutlineEditor 大纲编辑器组件

## 概述

大纲会话中的行内编辑器，支持树形浏览与就地编辑：标题与"编写思路"编辑、同级/子级新增、删除、字段标签，以及可选的智能生成辅助。采用简单的乐观更新机制，提供流畅的编辑体验。

## 功能索引

- 结构与交互（推荐）：./design.md
- 技术设计：./outline-edit.md
  - 章节 ID 映射机制：./outline-edit.md#-章节-id-映射机制
  - 新增章节完整流程：./outline-edit.md#新增章节完整流程含-id-映射与-aigc
- 需求说明：./requirement.md
- 上级模块需求：../requirement.md

## 关键能力

- **树形结构编辑**：节点选择、展开/折叠、行内编辑
- **行内操作**：hover/focus 显示编辑/删除/标题左侧"+"同级新增
- **快捷键操作**：支持键盘快捷键进行快速编辑和导航
- **智能提示**：hover标题时显示快捷键操作指南
- **乐观更新**：操作后立即更新UI，失败时自动回滚
- **智能生成**：编辑标题后可触发生成编写思路
- **字段标签**：在编辑区管理标签，支持增删
- **就地反馈**：未保存标记、保存/生成中/成功/失败提示

## 页面蓝图（速览）

```mermaid
graph TD
  Page[OutlineEditor]
  Page --> Side[大纲树（含行内操作）]
  Page --> Main[节点编辑区：标题/思路/标签]
  Side --> S2[Hover/Focus 操作："编辑/删除/左侧+"]
  Side --> S3[快捷键提示：Tooltip显示操作指南]
  Main --> M1[快捷键操作：Enter/Tab/方向键等]
```

## 技术特点

- **简化架构**：UI组件 → 状态管理 → API调用的简洁三层结构
- **全量保存**：通过 `reportChapter/batchUpdateChapterTreehUpdateChapterTreehUpdateChapterTree` API 提交完整大纲树，从 `ReportOutlineData.outlineId` 获取 reportId
- **乐观更新**：立即更新界面，API失败时回滚，提供流畅体验
- **自动保存**：基于 SaveController 实现去抖和节流的自动保存机制
- **错误处理**：基于API的success字段进行简单的成功/失败判断
- **状态隔离**：不同节点的编辑状态互不干扰

## 使用范围

- 由大纲会话页面调用，作为对话消息中的编辑卡或独立编辑视图
- 专注功能实现，避免过度复杂的分层设计
- 支持两种模式：
  - **编辑模式**（readonly=false）：用于最后一条 agent 消息，允许用户修改大纲内容
  - **预览模式**（readonly=true）：用于历史消息，只读展示大纲内容

## 相关文档

### 设计文档

- [大纲模块设计](../design.md) - 大纲模块整体设计
- [大纲编辑器需求](./requirement.md) - 详细功能需求
- [大纲编辑器设计](./design.md) - 结构与交互设计
- [技术设计](./outline-edit.md) - 技术实现方案
- [AI 对话核心流程](../../../../packages/gel-ui/docs/biz/ai-chat/chat-flow-core-design.md) - AI 对话流程
- [AI 对话技术设计](../../../../packages/gel-ui/docs/biz/ai-chat/chat-flow-technical-design.md) - AI 对话技术方案

### 代码实现

- [OutlineTreeEditor 组件](../../../src/components/outline/OutlineTreeEditor/README.md) - 组件实现
- [大纲组件集合](../../../src/components/outline/README.md) - 大纲相关组件
- [大纲编辑器 Context](../../../src/components/outline/OutlineTreeEditor/context/README.md) - 状态管理
- [大纲编辑器 Core](../../../src/components/outline/OutlineTreeEditor/core/README.md) - 核心逻辑
- [大纲编辑器 Hooks](../../../src/components/outline/OutlineTreeEditor/hooks/README.md) - 业务 Hooks
- [章节保存流程](../../shared/chapter-save-flow.md) - 保存机制与新增章节处理（含富文本编辑器对比）
