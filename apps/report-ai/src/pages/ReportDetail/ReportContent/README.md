# ReportContent

报告详情页面的核心内容组件，使用门面式 Hook 统一管理报告编辑器

## 目录结构

```
ReportContent/
├── index.tsx                    # 主组件
└── ...
```

## 关键说明

- **index.tsx**: 报告内容页面组件，集成 ReportEditor 和 AI 聊天功能
- 使用 `useReportEditor` 门面 Hook 统一管理三层状态架构（Canonical/Ephemeral/UI Control）
- 使用 `useReportContentPersistence` 封装单飞保存、自动保存与失败重试
- 支持全文生成、智能重注水、生命周期管理
- 自动处理初始化 → 加载 → 重注水 → 就绪的完整流程

## 依赖关系

ReportContent → useReportEditor → ReportEditor
ReportContent → useReportContentPersistence → SaveController

## 相关文档

- [内容管理设计](../../../docs/RPDetail/ContentManagement/README.md) - 内容管理完整设计
- [生命周期与控制](../../../docs/RPDetail/ContentManagement/lifecycle-flow.md) - 生命周期管理详解
- [报告编辑器设计](../../../docs/RPDetail/RPEditor/design.md) - 编辑器整体设计
- [自动保存方案](../../../docs/shared/auto-save-design.md) - 自动保存机制
