# context

大纲编辑器的状态管理，提供渲染状态和业务操作的 Context

## 目录结构

```
context/
├── OutlineStoreContext.tsx      # 渲染状态 Context
├── OutlineOperationsContext.tsx # 业务操作 Context
├── initialState.ts              # 初始状态
├── selectors/                   # 状态选择器
└── reducers/                    # 状态 reducers
```

## 关键说明

- **OutlineStoreContext.tsx**: 管理大纲数据、导航、AI 生成状态等渲染所需状态
- **OutlineOperationsContext.tsx**: 暴露编辑方法和保存状态
- **selectors/**: 状态选择器
- **reducers/**: 状态更新逻辑

## 依赖关系

OutlineOperationsContext → OutlineStoreContext
