# 内容管理模块（布局与功能设计）

## 术语速查

- **Canonical 层**：后端返回的事实树，决定初始化、生成完成后的基线。
- **前端数据层**：`ReportContentStore`、Draft、Hydration、哈希与 Single-Flight 保存。
- **展示层**：LiveOutline、渲染/解析函数、TinyMCE DOM 以及注水执行器。
- **纵向场景**：初始化与守卫 / 生成 / 编辑保存 / 路由退出 / 监控。
- 语气采用“主语 + 动作 + 结果”的平实写法，完整背景见 [reform-plan.md](./reform-plan.md)。

## 横纵结构导航

横向分三层（Canonical / 前端数据层 / 展示层），纵向按场景梳理。下表可作为阅读入口，后续章节会逐步与之对齐。

| 场景 \\ 层级       | Canonical 层                                                                  | 前端数据层                                                                                                    | 展示层                                                                                                                          |
| ------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 初始化 / 还原      | [lifecycle-flow §4](./lifecycle-flow.md#41-初始化--还原)                      | [data-layer-guide §1.2](./data-layer-guide.md#12-生命周期) / [§2.2](./data-layer-guide.md#22-hydration-状态)  | [../RPEditor/rendering-and-presentation-guide.md §6](../RPEditor/rendering-and-presentation-guide.md#6-更新与注水)              |
| **AIGC 核心流程**  | [aigc-core-flow](./aigc-core-flow.md)                                         | 通用 AIGC 流程 / 状态管理 / 失败处理                                                                          | 通用流式处理 / 渲染更新                                                                                                         |
| 全文 AIGC          | [full-generation-flow](./full-generation-flow.md)                             | 多章节队列管理 / 批量注水 / [data-layer-guide §2.6](./data-layer-guide.md#26-与生成重生成的配合)              | [../RPEditor/rendering-and-presentation-guide.md §6](../RPEditor/rendering-and-presentation-guide.md#6-更新与注水)              |
| 多章节顺序 AIGC    | [multi-chapter-sequential-aigc-flow](./multi-chapter-sequential-aigc-flow.md) | 用户自选章节 / 保持选择顺序 / 灵活控制 / [data-layer-guide §2.6](./data-layer-guide.md#26-与生成重生成的配合) | [../RPEditor/rendering-and-presentation-guide.md §6](../RPEditor/rendering-and-presentation-guide.md#6-更新与注水)              |
| 单章节 AIGC        | [single-chapter-aigc-flow](./single-chapter-aigc-flow.md)                     | 独立状态管理 / 直接处理 / 快速重试 / [data-layer-guide §2.6](./data-layer-guide.md#26-与生成重生成的配合)     | [../RPEditor/rendering-and-presentation-guide.md §6](../RPEditor/rendering-and-presentation-guide.md#6-更新与注水)              |
| 文本 AI 改写       | [text-ai-rewrite-flow](./text-ai-rewrite-flow.md)                             | 选区管理 / DOM 操作 / [data-layer-guide §2.3](./data-layer-guide.md#23-规范化与文档级哈希)                    | [../RPEditor/rendering-and-presentation-guide.md §7-8](../RPEditor/rendering-and-presentation-guide.md#7-选区操作与-dom-更新)   |
| 用户编辑与保存     | [edit-and-save-flow](./edit-and-save-flow.md)                                 | [data-layer-guide §2.3–§2.7](./data-layer-guide.md#23-规范化与文档级哈希)                                     | [../RPEditor/rendering-and-presentation-guide.md §6.5](../RPEditor/rendering-and-presentation-guide.md#65-展示层与-liveoutline) |
| 路由 / 守卫 / 异常 | [lifecycle-flow §5](./lifecycle-flow.md#5-权限与操作控制)                     | [data-layer-guide §4](./data-layer-guide.md#4-操作触发与防护横向视角)                                         | [../RPEditor/rendering-and-presentation-guide.md §9](../RPEditor/rendering-and-presentation-guide.md#9-相关文档)                |
| 监控与扩展         | [future-expansion](./future-expansion.md)                                     | 同左                                                                                                          | 同左                                                                                                                            |

> 横向/纵向文档会随着改造持续更新。如新增场景或层级，请同步更新此矩阵。

### Rehydration 机制

注水机制属于“前端数据层 ↔ 展示层”的交界专题，仍由 [HYDRATION.md](../../../src/store/reportContentStore/HYDRATION.md) 负责说明（Correlation ID、状态机、常见故障）。横向文档只保留入口，不再重复细节。

> 推荐阅读顺序：先看本页的横纵导航，再结合数据文档第 1–3 章理解底层模型。

## 核心概念

- **AIGC 流程体系**：
  1. **AIGC 核心流程**（基础）——提供通用 AIGC 流程，包括前置校验、流式处理、状态管理、失败处理等公共机制。
  2. **全文 AIGC 流程**（全量）——基于核心流程，自动筛选所有叶子章节，按树结构顺序批量生成。
  3. **多章节顺序 AIGC 流程**（灵活）——用户自选章节，保持选择顺序，支持跳过与单独重试，介于全文与单章节之间。
  4. **单章节 AIGC 流程**（快速）——独立状态管理，直接处理单章节，快速重试机制。
  5. **文本 AI 改写流程**（专用）——基于核心流程，专注选区管理、DOM 操作、光标恢复等细粒度编辑特性。
  6. **用户编辑与保存流程**（互斥流）——监听编辑 → 文档级哈希判定 → 单飞保存，失败可重试。
- **支撑流程**：初始化/还原、缺失补齐、路由离开等在四条主线之间穿插，主要负责注水、状态恢复与阻断提示。
- **互斥原则**：生成期间编辑器只读；保存期间允许继续输入但不会触发下一轮保存；任何会影响内容安全的操作（生成、离开页面、还原等）均需先处理 `hasDirty`。
- **Draft & LiveOutline**：Draft 维护与 Canonical 对齐的章节树（`ReportDetailChapterDraft[]`），仅在存在未保存编辑时保留，记录 dirty 状态与局部哈希；LiveOutline 通过纯函数解析 HTML/树生成。`draftTree` 为空意味着 `hasDirty=false`；存在时以 Draft 为主，否则以 Canonical 为主。
- **Canonical 实体**：`chapters` 使用 `RPDetailChapter[]` 树结构，节点 `content`/`aigcContent` 存储 HTML 字符串；`reportId`、`reportName`、`parsedRPContentMessages` 等元数据在同一层维护。
- **Hydration State**：`pendingHydrateChapters (correlationId → chapterId)` 记录等待注水的章节，Orchestrator 负责实际写入 TinyMCE；成功写入后调用 `markChapterRehydrated` 更新 `lastHydratedEpoch` 并清理待办，以此保证“谁决定”“谁执行”分离。

## 快速导航

- 想看**AIGC 通用流程** → aigc-core-flow.md（所有场景的公共机制）。
- 想看**全文生成多章节管理** → full-generation-flow.md（自动全量、树结构顺序、批量处理）。
- 想看**用户自选多章节生成** → multi-chapter-sequential-aigc-flow.md（自选章节、保持顺序、灵活控制）。
- 想看**单章节快速生成** → single-chapter-aigc-flow.md（独立状态、直接处理、快速重试）。
- 想看**选区级文本改写** → text-ai-rewrite-flow.md（选区管理、DOM 操作）。
- 想看"保存如何判定、何时触发" → data-layer-guide.md §2.3–§2.7 + lifecycle-flow.md 第 3.2 节。
- 想看"初始化/还原和离开页面怎么办" → lifecycle-flow.md 第 4 节。
- 想了解"数据如何渲染成 HTML、如何解析回数据" → ../RPEditor/rendering-and-presentation-guide.md。
- 想了解"未来是否会做章节增量保存、协同编辑" → future-expansion.md。

## 设计原则回顾

- 任务导向：围绕 AIGC 核心流程（通用机制）+ 专项流程（全文/单章节/文本改写）与用户编辑形成完整交互体系。
- 状态透明：只读、生成中、保存中、错误等状态需在 UI 中可视化，并提供重试或退出路径。
- 简单一致：所有章节数据来自唯一 Canonical 源；文档级哈希触发保存，生成直接落盘；注水策略保持光标与滚动稳定。

## 核心蓝图

```mermaid
flowchart LR
  Core[AIGC 核心流程] --> FullGen[全文 AIGC]
  Core --> MultiGen[多章节顺序 AIGC]
  Core --> ChapterGen[单章节 AIGC]
  Core --> TextRewrite[文本 AI 改写]

  Init[初始化/还原] --> Ready[编辑就绪]
  Ready -->|全文生成| FullGen
  Ready -->|多章节生成| MultiGen
  Ready -->|单章节生成| ChapterGen
  Ready -->|选区改写| TextRewrite

  FullGen -->|成功| Canonical[更新 Canonical + 基线]
  ChapterGen -->|成功| Canonical
  TextRewrite -->|完成| Dirty[hasDirty]

  Canonical --> Rehydrate[注水恢复可编辑]
  Rehydrate --> Ready
  Ready -->|用户编辑| Dirty
  Dirty -->|单飞保存| Save[/doc/save]
  Save --> Ack[ACK]
  Ack -->|成功| Canonical
  Ack -->|失败| Dirty

  Ready -->|离开/还原等| Guard[前置校验]
  Guard --> Dirty
```

> 需要追溯旧版章节级 diff 或其他细节，可查阅 Git 历史。若未来扩展落地，请同步更新本文档地图，保持团队心智一致。

## 初始注水策略

- **问题背景**：`@tinymce/tinymce-react` 会在 `initialValue` 变化时调用 `setContent`，导致保存成功后 Canonical 刷新时覆盖用户当前的编辑上下文。
- **解决方案**：在 `ReportContentInner` 中按 `reportId` 缓存首帧 HTML，仅在首次注水或切换报告时下发 `initialValue`，其余场景由 Hydration 任务驱动内容同步。
- **实现位置**：`apps/report-ai/src/pages/ReportDetail/ReportContent/useEditorInitialValue.ts:21`
- **关联策略**：重新进入加载态会重置缓存，保证跨报告导航时能够重新注水；详见本节代码注释。

## 相关文档

### 设计文档

- [报告编辑器设计](../README.md) - 编辑器整体设计
- [生命周期与控制](./lifecycle-flow.md) - 核心流程与互斥编排
- [数据层指南](./data-layer-guide.md) - 数据模型与状态管理
- [Correlation ID 设计](./correlation-id-design.md) - 操作追踪机制详解

### AIGC 流程体系

- [AIGC 核心流程](./aigc-core-flow.md) - 通用 AIGC 流程（所有场景的基础）
- [全文 AIGC 流程](./full-generation-flow.md) - 自动全量生成，树结构顺序
- [多章节顺序 AIGC 流程](./multi-chapter-sequential-aigc-flow.md) - 用户自选章节，灵活控制
- [单章节 AIGC 流程](./single-chapter-aigc-flow.md) - 独立快速生成，单章节重试
- [文本 AI 改写流程](./text-ai-rewrite-flow.md) - 选区级文本改写

### 支撑流程

- [用户编辑与保存流程](./edit-and-save-flow.md) - 编辑保存详解
- [渲染与展示层完整指南](../RPEditor/rendering-and-presentation-guide.md) - 双向同步机制
- [未来扩展](./future-expansion.md) - 扩展方向
- [Hydration 机制](../../../src/store/reportContentStore/HYDRATION.md) - 注水机制运行手册

### 代码实现

- [reportContentStore](../../../src/store/reportContentStore/README.md) - 状态管理入口
- [Hooks 架构](../../../src/store/reportContentStore/hooks/README.md) - 业务逻辑层 Hooks
- [Reducers](../../../src/store/reportContentStore/reducers/) - 状态更新逻辑
- [Selectors](../../../src/store/reportContentStore/selectors/README.md) - 状态查询接口
- [ReportEditor 组件](../../../src/components/ReportEditor/README.md) - 编辑器组件实现
- [reportEditor Domain](../../../src/domain/reportEditor/README.md) - 编辑器领域逻辑
- [章节保存流程](../../../shared/chapter-save-flow.md) - 保存机制、新增章节处理、ID 替换与 AIGC 操作前置条件（含大纲编辑器对比）
