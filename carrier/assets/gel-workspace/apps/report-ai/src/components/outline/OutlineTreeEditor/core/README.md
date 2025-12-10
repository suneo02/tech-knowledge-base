# core

大纲编辑器的领域逻辑，包括编辑操作和保存接口

## 目录结构

```
core/
├── operations.ts            # 大纲编辑动作及乐观回放
└── transport.ts             # 保存接口封装
```

## 关键说明

- **operations.ts**: 定义大纲编辑动作（增删改）和乐观更新逻辑
- **transport.ts**: 统一的全量保存接口，调用后端 API

## 依赖关系

transport → operations
