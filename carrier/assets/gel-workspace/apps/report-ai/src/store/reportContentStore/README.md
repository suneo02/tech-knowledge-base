# reportContentStore

报告编辑器的核心状态管理模块，负责报告内容的状态管理、数据同步和编辑器状态协调

## 目录结构

```
reportContentStore/
├── index.ts                     # 主导出文件
├── types.ts                     # 核心类型定义
├── slice.ts                     # Redux slice
├── factory.ts                   # Store 工厂
├── provider.tsx                 # Provider 组件
├── hooksRedux.ts                # Redux hooks
├── selectors/                   # 状态选择器
│   ├── base.ts                  # 基础选择器
│   ├── chapters.ts              # 章节相关
│   ├── generation.ts            # 全文生成相关
│   └── index.ts                 # 统一导出
├── reducers/                    # Redux reducers
│   ├── canonicalReducers.ts     # Canonical Layer 操作
│   ├── ephemeralReducers.ts     # Ephemeral Layer 操作
│   ├── hydrationReducers.ts     # 重注水控制
│   ├── generationReducers.ts    # AI 生成管理
│   ├── uiControlReducers.ts     # UI 控制层操作
│   └── index.ts                 # 统一导出
├── hooks/                       # 业务逻辑 Hooks
│   ├── useEditorDraftSync.ts    # 编辑器草稿同步
│   ├── useEditorState.ts        # 编辑器状态管理
│   ├── useRehydrationOrchestrator.ts  # 统一注水编排
│   ├── useFullDocumentGenerationController.ts  # 全文生成控制器
│   ├── useAutoSave.ts           # 自动保存
│   ├── rehydration/             # 重注水子模块
│   │   ├── useInitialFullHydration.ts
│   │   ├── useFullDocumentRehydration.ts
│   │   ├── usePendingChapterRehydration.ts
│   │   └── useStreamingGenerationHydration.ts
│   └── index.ts                 # 统一导出
└── utils/                       # 状态管理工具
    ├── RehydrationGate.ts       # 重注水判定工具
    ├── chapterProcessing.ts     # 统一章节处理逻辑
    └── index.ts                 # 导出
```

## 关键说明

- **slice.ts**: Redux Toolkit 管理三层状态架构（Canonical/Ephemeral/UI Control）
- **factory.ts**: Store 工厂模式支持多个报告编辑器实例独立运行
- **provider.tsx**: Provider 组件实现作用域隔离
- **selectors/**: 状态选择器，按功能模块组织
- **reducers/**: 模块化 reducers，按功能职责分离
- **hooks/**: 业务逻辑 Hooks，封装编辑器交互、数据同步、保存操作
- **hooks/rehydration/**: 重注水子模块，负责各种重注水场景的 LocalDraft 创建和基线设置
- **utils/**: 提供事件闸门、重注水判定、统一章节处理等工具

## 依赖关系

页面/容器 → hooks → reducers → slice → selectors

## 相关文档

- [内容管理设计](../../../docs/RPDetail/ContentManagement/README.md) - 内容管理完整设计方案
- [数据模型与状态机](../../../docs/RPDetail/ContentManagement/data-layer-guide.md) - 三层状态架构详解
- [生命周期与控制](../../../docs/RPDetail/ContentManagement/lifecycle-flow.md) - 生命周期管理
- [自动保存方案](../../../docs/shared/auto-save-design.md) - 通用自动保存设计
