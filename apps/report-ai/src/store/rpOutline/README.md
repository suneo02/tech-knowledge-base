# rpOutline

大纲状态管理 Store，负责大纲数据的状态管理和编辑操作

## 目录结构

```
rpOutline/
├── index.ts                     # 统一导出
├── slice.ts                     # Redux slice
├── types.ts                     # 类型定义
├── selectors/                   # 状态选择器
└── reducers/                    # Redux reducers
    ├── editReducers.ts          # 编辑状态管理
    └── resetReducers.ts         # 状态重置
```

## 关键说明

- **slice.ts**: Redux Toolkit slice 定义
- **selectors/**: 状态选择器
- **reducers/**: 编辑和重置相关的 reducers

## 依赖关系

slice → reducers → types
