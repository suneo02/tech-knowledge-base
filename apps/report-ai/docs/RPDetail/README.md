# RPDetail - 报告详情模块

报告详情页面，采用三栏布局：左侧 AI 对话、中间富文本编辑器、右侧大纲与引用管理

## 目录结构

```
RPDetail/
├── ContentManagement/         # 内容管理（核心数据层/场景）
│   ├── README.md              # 文档地图与术语速查
│   ├── data-layer-guide.md    # Canonical/数据层/展示层桥接
│   ├── lifecycle-flow.md
│   ├── full-generation-flow.md
│   ├── edit-and-save-flow.md
│   ├── future-expansion.md
│   └── reform-plan.md
├── RPEditor/                  # 报告编辑器设计
│   ├── ContextMenu.md         # 上下文菜单设计
│   ├── Toolbar.md             # 工具栏设计
│   ├── rendering-and-presentation-guide.md  # 渲染与展示层完整指南（已合并）
│   ├── design.md              # 编辑器整体设计
│   └── requirement.md         # 编辑器需求
├── Reference/                 # 引用资料设计
│   ├── 01-requirement.md      # 需求文档
│   ├── 02-design.md           # 设计文档
│   └── presearch.md           # 技术选型
├── Outline/                   # 大纲视图设计
│   └── requirements.md        # 需求文档
├── AIChat/                    # AI 聊天设计
│   └── requirements.md        # 需求文档
├── design.md                  # 报告详情整体设计
└── requirement.md             # 报告详情需求
```

## 核心模块职责

### RPEditor - 报告编辑器

基于 TinyMCE 的富文本编辑器，支持章节化编辑、AI 辅助、自动保存、流式生成

### ContentManagement - 内容管理内核

位于 `docs/RPDetail/ContentManagement/`，聚焦 Canonical/Draft/展示三层数据流、生成与保存互斥、注水与外部渲染规范，以及未来扩展计划，是 ReportEditor 与 store 的共同“单一事实来源”。

### Reference - 引用资料

右侧引用资料面板，展示文件、表格、建议资料，支持预览和引用序号管理

### Outline - 大纲视图

右侧大纲面板，展示章节树形结构，支持导航和进度指示

### AIChat - AI 对话

左侧对话区域，与 AI 协作生成和优化报告内容

## 页面布局

```
┌─────────────────────────────────────────────────────────┐
│                     报告详情页面                          │
├──────────┬─────────────────────────┬─────────────────────┤
│          │                         │                     │
│  AI 对话  │    报告编辑器 (TinyMCE)   │   大纲 / 引用资料   │
│          │                         │                     │
│  ChatRP  │    ReportEditor         │   Outline           │
│  Left    │    - 工具栏              │   Reference         │
│          │    - 章节内容            │   - 章节导航         │
│          │    - AI 生成             │   - 引用列表         │
│          │    - 自动保存            │   - 文件预览         │
│          │                         │                     │
└──────────┴─────────────────────────┴─────────────────────┘
```

## 模块依赖

```
报告详情页面
  ├─> RPEditor (编辑器)
  │   ├─> ContentManagement (内容管理)
  │   └─> 渲染与展示层 (已合并到 rendering-and-presentation-guide.md)
  ├─> Reference (引用资料)
  │   └─> File/PDFViewer (文件预览)
  ├─> Outline (大纲视图)
  └─> AIChat (AI 对话)
```

## 相关文档

### 设计文档

- [需求文档](./requirement.md) - 功能需求与验收标准
- [设计文档](./design.md) - 技术方案与架构设计
- [报告编辑器](./RPEditor/README.md) - 编辑器完整设计
- [引用资料](./Reference/README.md) - 引用资料完整设计
- [大纲视图](./Outline/README.md) - 大纲视图设计
- [AI 聊天](./AIChat/README.md) - AI 对话设计

### 代码实现

- [报告详情页面](../../src/pages/ReportDetail/) - 页面组件
- [ReportEditor 组件](../../src/components/ReportEditor/README.md) - 编辑器组件
- [Reference 组件](../../src/components/Reference/README.md) - 引用资料组件
- [reportContentStore](../../src/store/reportContentStore/README.md) - 内容状态管理
- [OutlineView 组件](../../src/components/outline/OutlineView/README.md) - 大纲展示组件
- [ChatRPLeft 组件](../../src/components/ChatRPLeft/README.md) - 左侧聊天组件
