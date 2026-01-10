# Report AI 项目文档

## 一句话定位

Report AI 项目的文档中心，包含模块设计、功能方案、问题跟踪和开发任务管理。

## 目录结构

```
docs/
├── README.md                    # 本文件，文档索引
├── getting-started.md           # 快速开始指南
├── dev/                         # 开发管理文档
│   ├── README.md                # 开发管理索引
│   ├── tasks-pending.md         # 待办任务列表
│   └── tasks-completed.md       # 已完成任务归档
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

### 开发管理

- [开发任务管理](./dev/README.md) - 待办任务、已完成任务归档
- [快速开始指南](./getting-started.md) - 开发环境搭建和项目启动

### 核心模块设计

- [报告详情模块](./RPDetail/README.md) - 报告编辑、内容管理、引用资料
- [大纲会话模块](./RPOutline/README.md) - 大纲编辑器、会话管理
- [首页模块](./HomePage/README.md) - 首页功能设计
- [文件管理模块](./FileManagement/README.md) - 文件上传、解析、管理

### 功能设计与问题跟踪

- [Spec 文档索引](./specs/README.md) - 功能设计方案、任务拆解
- [Issue 文档索引](./issues/README.md) - 问题跟踪、根因分析

### 共享设计

- [自动保存方案](./shared/auto-save-design.md) - 通用自动保存机制
- [文件上传设计](./shared/FileUpload/README.md) - 文件上传功能设计

## 文档与代码关联

| 模块       | 代码位置                                    | 设计文档                            |
| ---------- | ------------------------------------------- | ----------------------------------- |
| 报告编辑器 | `src/components/ReportEditor/`              | `docs/RPDetail/RPEditor/`           |
| 内容管理   | `src/store/reportContentStore/`             | `docs/RPDetail/ContentManagement/`  |
| 引用资料   | `src/components/Reference/`                 | `docs/RPDetail/Reference/`          |
| 大纲编辑器 | `src/components/outline/OutlineTreeEditor/` | `docs/RPOutline/OutlineEditor/`     |
| 聊天发送器 | `src/components/ChatCommon/Sender/`         | `docs/components/ChatSenderReport/` |

## 相关规范

- [文档编写规范](../../../docs/rule/doc-general-rule.md)
- [README 编写规范](../../../docs/rule/doc-readme-structure-rule.md)
- [Spec 文档规范](../../../docs/rule/doc-spec-rule.md)
- [Issue 文档规范](../../../docs/rule/issue-doc-rule.md)

