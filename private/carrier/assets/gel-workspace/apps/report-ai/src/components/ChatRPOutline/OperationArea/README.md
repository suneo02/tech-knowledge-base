# OperationArea

大纲操作区组件，提供返回、重新生成大纲、生成全文等操作按钮

## 目录结构

```
OperationArea/
├── hooks/
│   └── useOperationActions.ts    # 业务逻辑 Hook
├── index.tsx                     # 主组件
└── index.module.less            # 样式文件
```

## 核心文件职责

### index.tsx

操作区主组件，包含返回、重新生成大纲、生成全文按钮

### hooks/useOperationActions.ts

封装操作按钮的业务逻辑，根据大纲确认状态和生成状态控制按钮可用性

## 模块依赖

```
OperationArea
  └─> hooks/useOperationActions
      ├─> useChatRoomContext
      └─> useRPOutlineContext
```

## 相关文档

- [大纲模块设计](../../../../../docs/RPOutline/design.md) - 大纲模块整体设计
- [大纲编辑器设计](../../../../../docs/RPOutline/OutlineEditor/design.md) - 大纲编辑器设计
