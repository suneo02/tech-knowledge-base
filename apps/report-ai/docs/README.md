# Report AI 项目文档

> 📖 本目录遵循 [文档编写规范](../../../docs/rule/documentation-rule.md)

## 一句话定位

Report AI 项目的完整文档中心，包含功能设计、技术架构、问题跟踪和任务方案。

## 目录结构

```
docs/
├── README.md                    # 本文件，文档索引
├── getting-started.md           # 快速开始指南
├── specs/                       # 功能设计与任务方案（Spec 文档）
│   ├── README.md                # Spec 索引
│   ├── aigc-button-on-hover/    # 章节标题悬停 AIGC 按钮
│   ├── context-menu-issues/     # Context Menu 交互问题
│   └── ...                      # 其他 Spec
├── issues/                      # 问题跟踪与分析（Issue 文档）
│   ├── README.md                # Issue 索引
│   ├── archived/                # 已解决问题归档
│   └── ...                      # 进行中的问题
├── shared/                      # 共享设计文档
│   ├── auto-save-design.md      # 通用自动保存设计
│   └── FileUpload/              # 文件上传设计
├── HomePage/                    # 首页模块文档
├── FileManagement/              # 文件管理模块文档
├── RPOutline/                   # 大纲会话模块文档
│   ├── design.md                # 大纲模块设计
│   └── OutlineEditor/           # 大纲编辑器设计
├── RPDetail/                    # 报告详情模块文档
│   ├── RPEditor/                # 报告编辑器设计
│   │   ├── design.md            # 编辑器整体设计
│   │   ├── rendering-and-presentation-guide.md  # 渲染与展示层指南
│   │   ├── ContentManagement/   # 内容管理设计
│   │   ├── ContextMenu/         # 上下文菜单设计
│   │   └── Toolbar/             # 工具栏设计
│   ├── Reference/               # 引用资料设计
│   └── Outline/                 # 大纲视图设计
├── components/                  # 组件设计文档
│   ├── ChatSenderReport/        # 聊天发送器设计
│   └── FreeOutlineEditor/       # 自由大纲编辑器设计
├── api/                         # API 接口规范
└── requirementRaw.md            # 原始需求文档
```

## 关键文档

### 快速开始

- [快速开始指南](./getting-started.md) - 开发环境搭建和项目启动

### 功能设计与任务

- [Spec 文档索引](./specs/README.md) - 功能设计方案、任务拆解与实施计划
- [Issue 文档索引](./issues/README.md) - 问题跟踪、根因分析和解决方案

### 核心模块设计

- [内容管理设计](./RPDetail/ContentManagement/README.md) - 报告内容管理的核心设计
- [报告编辑器设计](./RPDetail/RPEditor/design.md) - 编辑器整体设计
- [渲染与展示层指南](./RPDetail/RPEditor/rendering-and-presentation-guide.md) - 渲染机制与展示层操作
- [大纲编辑器设计](./RPOutline/OutlineEditor/design.md) - 大纲树形编辑器设计

### 共享设计

- [自动保存方案](./shared/auto-save-design.md) - 通用自动保存机制
- [文件上传设计](./shared/FileUpload/README.md) - 文件上传功能设计

## 文档与代码关联

### 双向关联原则

- **文档 → 代码**：设计文档中标注对应的代码实现位置
- **代码 → 文档**：代码中使用 `@see` 注释引用相关设计文档
- **README 桥接**：README 文档作为桥梁，连接代码目录和设计文档

### 核心模块映射

| 模块       | 代码位置                                    | 设计文档                            | README                                                               |
| ---------- | ------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------- |
| 报告编辑器 | `src/components/ReportEditor/`              | `docs/RPDetail/RPEditor/`           | [组件 README](../src/components/ReportEditor/README.md)              |
| 内容管理   | `src/store/reportContentStore/`             | `docs/RPDetail/ContentManagement/`  | [Store README](../src/store/reportContentStore/README.md)            |
| 引用资料   | `src/components/Reference/`                 | `docs/RPDetail/Reference/`          | [组件 README](../src/components/Reference/README.md)                 |
| 大纲编辑器 | `src/components/outline/OutlineTreeEditor/` | `docs/RPOutline/OutlineEditor/`     | [组件 README](../src/components/outline/OutlineTreeEditor/README.md) |
| 聊天发送器 | `src/components/ChatCommon/Sender/`         | `docs/components/ChatSenderReport/` | [组件 README](../src/components/ChatCommon/Sender/README.md)         |

## 依赖关系

```
设计文档 ←→ README 文档 ←→ 源代码
    ↓           ↓            ↓
  需求分析   目录说明    具体实现
    ↓           ↓            ↓
Spec/Issue   模块索引    功能实现
```

## 相关规范

- [文档编写规范](../../../docs/rule/documentation-rule.md) - 通用文档编写标准
- [README 编写规范](../../../docs/rule/readme-rule.md) - README 编写标准
- [Spec 文档编写规范](../../../docs/rule/spec-doc-rule.md) - Spec 文档编写标准
- [Issue 文档编写规范](../../../docs/rule/issue-doc-rule.md) - Issue 文档编写标准

## 更新记录

| 日期       | 修改人 | 更新内容                                   |
| ---------- | ------ | ------------------------------------------ |
| 2025-10-29 | Kiro   | 按照 README 规范重构，添加 Spec/Issue 索引 |
