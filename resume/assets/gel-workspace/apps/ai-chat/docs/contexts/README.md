# AI Chat Context 状态管理

## 定位
提供 React Context 状态管理方案，用于跨组件共享状态和逻辑，支持复杂交互场景下的状态协调。

## 目录结构
```
contexts/
├── SuperChat/           # 超级聊天相关上下文
│   └── SheetContext/    # 表格标签页上下文
└── README.md           # 本文档
```

## 核心特性
- **状态集中管理**: 避免状态提升，简化组件通信
- **异步操作协调**: 支持轮询、队列等复杂异步场景
- **实例引用管理**: 统一管理组件实例引用
- **智能交互优化**: 提供智能滚动、自动选中等增强功能

## 设计原则
- 解耦组件与状态管理逻辑
- 提供可预测的状态更新机制
- 支持复杂异步操作协调
- 优化用户交互体验

## 关联文件
- [SheetContext design](./SuperChat/SheetContext/design.md)
- @see apps/ai-chat/src/contexts/