# 服务层模块

提供前端应用的服务层抽象，包括 AI Agent 请求处理、AI 对话服务等核心业务逻辑。

## 目录结构

```
service/
├── agentRequest/                   # AI Agent 请求服务
│   ├── helper/                     # 辅助工具函数
│   ├── processes/                  # 业务流程处理
│   ├── unified-handler/            # 统一请求处理器
│   ├── events.ts                   # 事件总线系统
│   ├── index.ts                    # 服务主入口
│   ├── logger.ts                   # 日志系统
│   ├── runContext.ts               # 运行上下文
│   ├── types.ts                    # 类型定义
│   └── README.md                   # 详细文档
├── ai-chat/                        # AI 对话服务
│   ├── hooks/                      # AI 对话相关 Hooks
│   ├── utils/                      # AI 对话工具函数
│   ├── types/                      # AI 对话类型
│   ├── constants/                  # 常量定义
│   ├── api.ts                      # API 接口封装
│   └── index.ts                    # 对话服务导出
└── index.ts                        # 服务层统一导出
```

## 关键文件说明

- **agentRequest/**: AI Agent 请求处理的核心服务，管理完整的请求流程和状态
- **ai-chat/**: AI 对话相关的服务层，提供对话管理、状态持久化等功能
- **agentRequest/unified-handler/**: 统一的请求处理器，整合预处理、流式处理等
- **agentRequest/processes/**: 业务流程处理函数，支持意图分析、数据召回等

## 依赖关系

```
service/
├── 上游依赖
│   ├── axios: HTTP 请求客户端
│   ├── gel-api: API 类型定义
│   └── 外部 API: 后端服务接口
├── 内部依赖
│   ├── types: 使用类型定义
│   ├── utils: 使用工具函数
│   └── constants: 使用常量定义
├── 协作依赖
│   ├── assets: 使用静态资源
│   └── config: 使用配置文件
└── 被依赖关系
    ├── biz/ai-chat: 业务组件主要消费方
    ├── hooks/aiChat: AI 对话 Hooks
    └── 页面组件: 直接调用服务
```

## 核心功能

### AI Agent 请求服务
- **请求流程管理**: 完整的 AI 请求处理流程
- **状态管理**: 统一的请求状态和上下文管理
- **流式处理**: 实时流式数据的接收和处理
- **错误处理**: 统一的错误处理和降级机制

### AI 对话服务
- **对话管理**: 对话创建、保存、查询等功能
- **消息处理**: 消息发送、接收、状态同步
- **持久化**: 对话历史的本地存储管理
- **配置管理**: 对话配置和用户偏好设置

### 事件和日志系统
- **事件总线**: 模块间的事件通信机制
- **日志记录**: 完整的操作日志和调试信息
- **性能监控**: 请求性能和用户行为监控

## 设计架构

### 分层架构
```
┌─────────────────┐
│   业务组件层     │ ← biz/ai-chat
├─────────────────┤
│   Hooks 层       │ ← hooks/aiChat
├─────────────────┤
│   服务层         │ ← service/
├─────────────────┤
│   网络层         │ ← axios + gel-api
└─────────────────┘
```

### 统一处理模式
- **上下文驱动**: 统一的运行上下文管理
- **事件驱动**: 基于事件的流程控制和通知
- **流式支持**: 原生支持流式数据处理
- **类型安全**: 完整的 TypeScript 类型系统

## 相关文档

- [Agent 请求服务详细文档](./agentRequest/README.md) - AI Agent 请求处理详情
- [API 请求规范](../../../docs/rule/api-request-rule.md) - API 调用规范
- [错误处理规范](../../../docs/rule/error-handling-rule.md) - 错误处理指南

## 使用示例

```typescript
import { createChatRunContext, createXAgentRequest } from './service/agentRequest'
import { AIChatService } from './service/ai-chat'

// AI Agent 请求处理
const context = createChatRunContext(staticConfig, sessionConfig)
await createXAgentRequest(context, {
  onStreamData: handleStreamData,
  onComplete: handleComplete,
  onError: handleError
})

// AI 对话服务
const chatService = new AIChatService()
await chatService.sendMessage({
  content: 'Hello AI',
  chatId: 'chat-123',
  onStream: handleStream
})
```