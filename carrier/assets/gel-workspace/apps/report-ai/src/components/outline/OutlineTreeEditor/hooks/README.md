# hooks

大纲编辑器的业务 Hooks，封装编辑操作和保存逻辑

## 目录结构

```
hooks/
├── index.ts                         # 统一导出
├── useOutline.ts                    # 聚合所有编辑操作
├── useOutlinePersistence.ts         # SaveController + 乐观更新
├── useOutlineItemHeaderState.ts     # 标题编辑状态
├── useOutlineItemHeaderKeyboard.ts  # 键盘交互
└── useThoughtGeneration.ts          # AI 思路生成
```

## 关键说明

- **useOutline.ts**: 聚合所有编辑操作和保存状态，对外暴露统一接口
- **useOutlinePersistence.ts**: 封装 SaveController，负责自动/手动保存仲裁和失败回滚
- **useThoughtGeneration.ts**: AI 思路生成的触发和状态管理

## 依赖关系

useOutline → useOutlinePersistence → core/transport
