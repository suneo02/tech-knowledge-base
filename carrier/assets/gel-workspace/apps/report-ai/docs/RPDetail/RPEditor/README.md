# ReportEditor 模块

## 概述

章节化报告编辑器：在单页内完成章节编辑、AI 辅助、占位就地反馈与导出，保障连续写作体验与内容安全。

## 文档导航

- 需求：./requirement.md
- 设计（布局与功能）：./design.md
- 子专题设计：
  - Toolbar（停用策略）：./Toolbar/design.md
  - Context Menu：./ContextMenu/design.md
  - 样式方案：./Styles/design.md
  - 内容管理（编排/流式/状态/扩展）：../ContentManagement/README.md
  - 数据三层指南：../ContentManagement/data-layer-guide.md
  - 展示层 / 文档渲染 / 外部占位：./rendering-and-presentation-guide.md
  - 生成场景（互斥 + 流式）：../ContentManagement/full-generation-flow.md
  - 编辑与保存场景：../ContentManagement/edit-and-save-flow.md
  - 生命周期互斥与守卫：../ContentManagement/lifecycle-flow.md
  - 未来扩展：../ContentManagement/future-expansion.md
  - 改造计划：../ContentManagement/reform-plan.md
  - API 概览：./API/overview.md

## 关键能力

- 章节定位与编辑（标题/正文）
- AI 辅助（润色/续写/翻译/摘要）与结果采纳
- 自动保存与状态反馈
- [外部渲染](./rendering-and-presentation-guide.md#4-外部渲染节点设计)：Loading/Citation 占位、引用资料编号标记、章节编号（不落库）
- 导出 Word/PDF/HTML

## 非目标

- 本 README 不包含视觉规范与 API 细节

## 代码实现

### 组件层

- [ReportEditor 组件](../../../src/components/ReportEditor/README.md) - 编辑器组件实现
- [编辑器配置](../../../src/components/ReportEditor/config/README.md) - TinyMCE 配置
- [编辑器 Hooks](../../../src/components/ReportEditor/hooks/) - 编辑器业务逻辑

### 状态管理层

- [reportContentStore](../../../src/store/reportContentStore/README.md) - 内容状态管理
- [Hooks 架构](../../../src/store/reportContentStore/hooks/README.md) - 业务逻辑 Hooks
- [Selectors](../../../src/store/reportContentStore/selectors/README.md) - 状态选择器

### 领域层

- [reportEditor Domain](../../../src/domain/reportEditor/README.md) - 编辑器领域逻辑
- [chapter Domain](../../../src/domain/chapter/README.md) - 章节领域逻辑

## 保存与状态策略（摘要）

- 采用“文档级 dirty + 全量保存 + 单飞（Single-Flight）”，不做版本/ETag 管理。
- 存储仅包含 Canonical（事实层）与最小 Draft（会话层）；LiveOutline/OutlineVM 为运行时派生。
- 通过整文规范化 + 文档级哈希判断是否需要保存；失败不阻塞继续编辑，可重试。
- 详见：`../ContentManagement/data-layer-guide.md`
