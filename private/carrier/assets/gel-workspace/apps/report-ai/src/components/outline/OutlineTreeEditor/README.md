# OutlineTreeEditor

报告大纲的树形编辑器，支持多层级编辑、乐观更新和 AI 思路生成

## 目录结构

```
OutlineTreeEditor/
├── index.tsx                    # 主组件入口
├── index.module.less            # 主组件样式
├── types.ts                     # 公共类型定义
├── components/                  # UI 组件
│   ├── OutlineEditorContainer.tsx
│   ├── OutlineEditorItem/
│   │   ├── OutlineItemHeader.tsx
│   │   ├── OutlineItemKeywords.tsx
│   │   └── OutlineItemWritingThought.tsx
│   └── HierarchicalNumber.tsx
├── context/                     # 状态管理
│   ├── OutlineStoreContext.tsx  # 渲染状态
│   ├── OutlineOperationsContext.tsx # 业务操作
│   ├── initialState.ts
│   ├── selectors/
│   └── reducers/
├── core/                        # 领域逻辑
│   ├── operations.ts            # 大纲编辑动作及乐观回放
│   └── transport.ts             # 保存接口封装
└── hooks/                       # 业务 Hook
    ├── useOutline.ts            # 聚合所有编辑操作
    ├── useOutlinePersistence.ts # SaveController + 乐观更新
    ├── useOutlineItemHeaderState.ts
    ├── useOutlineItemHeaderKeyboard.ts
    └── useThoughtGeneration.ts
```

## 关键说明

- **components/**: 纯展示和交互组件
- **context/**: OutlineStoreContext 管理渲染状态，OutlineOperationsContext 暴露编辑方法和保存状态
- **core/operations.ts**: 大纲编辑动作定义和乐观回放逻辑
- **core/transport.ts**: 统一的全量保存接口
- **hooks/useOutlinePersistence.ts**: 封装 SaveController，负责自动/手动保存仲裁和失败回滚

## 依赖关系

UI 组件 → useOutlineOperationsContext → useOutline → useOutlinePersistence → SaveController → transport.saveOutline

## 相关文档

- [大纲编辑器设计](../../../../docs/RPOutline/OutlineEditor/design.md) - 大纲编辑器完整设计
- [自动保存方案](../../../../docs/shared/auto-save-design.md) - 通用自动保存设计
- [大纲模块设计](../../../../docs/RPOutline/design.md) - 大纲模块整体设计
