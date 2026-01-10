# Report AI Spec 文档目录

> 📖 本目录遵循 [Spec 文档编写规范](../../../../docs/rule/doc-spec-rule.md)

## 一句话定位

记录 report-ai 项目的功能设计方案、任务拆解与实施计划。

## 目录结构

```
specs/
├── README.md                              # 本文件，Spec 任务索引与概览
├── 2025-01/                               # 2025年1月完成的 Spec 归档
├── 2025-02/                               # 2025年2月完成的 Spec 归档
├── 2025-10/                               # 2025年10月完成的 Spec 归档
├── 2025-11/                               # 2025年11月完成的 Spec 归档
├── aigc-auto-scroll-optimization/         # AIGC 流式生成自动滚动优化
├── aigc-cancel-feature/                   # AIGC 取消功能
├── ai-chat-file-reference/                # AI 对话文件引用
├── dom-utils-abstraction/                 # DOM 操作工具抽象与统一
├── chapter-number-delete-behavior/        # 章节编号删除行为分析
├── editor-dom-sync-timing-analysis/       # 编辑器 DOM 同步性能优化
├── heading-nesting-assumption/            # 标题嵌套假设问题修复
├── outline-thought-generation-abort-issues/ # 大纲思考生成中止问题
├── pdf-preview-issues/                    # PDF 预览问题
├── rehydration-queue-issues/              # 重新水化队列问题
├── report-editor-organization-issues/     # 报告编辑器组织问题
├── streaming-preview-leaf-only/           # 流式预览仅叶子节点
├── text-ai-rewrite-change-save-issue/     # 文本 AI 重写变更保存问题
├── tinymce-attribute-misuse/              # TinyMCE 属性误用
├── tinymce-inline-styles-issue/           # TinyMCE 内联样式问题
├── undo-redo-state-polling/               # Undo/Redo 状态轮询优化
└── archived/                              # 已归档的 Spec
```

## 进行中的任务

| 任务                                                                   | 阶段        | 负责人 |
| ---------------------------------------------------------------------- | ----------- | ------ |
| [DOM 操作工具抽象与统一](./dom-utils-abstraction/README.md)            | 🚧 进行中   | TBD    |
| [AIGC 流式生成自动滚动优化](./aigc-auto-scroll-optimization/README.md) | 🟡 方案评审 | Kiro   |
| [AIGC 取消功能](./aigc-cancel-feature/README.md)                       | 🟡 方案评审 | TBD    |

## 关键文件说明

| 文件                                           | 作用                          |
| ---------------------------------------------- | ----------------------------- |
| [2025-01/README.md][1]                         | 2025年1月完成的Spec归档概览   |
| [2025-11/README.md][4]                         | 2025年11月完成的Spec归档概览  |
| [dom-utils-abstraction/README.md][9]           | DOM 操作工具抽象与统一方案    |
| [aigc-auto-scroll-optimization/README.md][8]   | AIGC 流式生成自动滚动优化方案 |
| [editor-dom-sync-timing-analysis/README.md][6] | 编辑器DOM同步性能优化分析     |
| [pdf-preview-issues/README.md][7]              | PDF预览问题分析与解决方案     |

## 依赖示意

```
report-ai应用
├── 前端组件层
│   ├── 编辑器组件
│   └── AIGC功能组件
├── 业务逻辑层
│   ├── 报告生成流程
│   └── 文件管理功能
└── 数据存储层
    ├── 本地状态管理
    └── 远程API调用
```

## 相关文档

- [Spec 文档编写规范](../../../../docs/rule/doc-spec-rule.md) - Spec 文档编写标准
- [README 编写规范](../../../../docs/rule/doc-readme-structure-rule.md) - README 编写标准
- [Report AI 项目文档](../README.md) - 项目整体文档

[1]: ./2025-01/README.md
[2]: ./2025-02/README.md
[3]: ./2025-10/README.md
[4]: ./2025-11/README.md
[6]: ./editor-dom-sync-timing-analysis/README.md
[7]: ./pdf-preview-issues/README.md
[8]: ./aigc-auto-scroll-optimization/README.md
[9]: ./dom-utils-abstraction/README.md
