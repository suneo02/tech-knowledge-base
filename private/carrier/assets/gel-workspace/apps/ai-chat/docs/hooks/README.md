# AI Chat Hooks

## 定位
提供自定义 React Hooks，封装复杂业务逻辑和状态管理，为 AI 聊天应用提供可复用的功能模块。

## 目录结构
```
hooks/
├── useConversation/     # 会话管理 Hook
├── useStreamOutput/     # 流式输出 Hook
└── README.md           # 本文档
```

## 核心 Hooks
- **useConversation**: 管理会话列表和状态
- **useStreamOutput**: 处理 AI 流式输出逻辑

## 设计原则
- **状态封装**: 将复杂状态逻辑封装在 Hook 中
- **业务复用**: 提供可跨组件复用的业务逻辑
- **接口简洁**: 提供简单易用的 API 接口
- **类型安全**: 完整的 TypeScript 类型定义

## 使用场景
- 会话管理和切换
- AI 对话流式处理
- 消息状态管理
- 异步操作协调

## 关联文件
- [useConversation design](./useConversation/design.md)
- [useStreamOutput design](./useStreamOutput/design.md)
- @see apps/ai-chat/src/hooks/