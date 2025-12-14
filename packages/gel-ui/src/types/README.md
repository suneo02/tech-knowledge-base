# 类型定义模块

提供完整的 TypeScript 类型系统，支撑强类型开发，确保代码的类型安全和开发体验。

## 目录结构

```
types/
├── ai-chat/                        # AI 对话类型定义
│   ├── chat.ts                     # 聊天核心类型
│   ├── message.ts                  # 消息类型定义
│   ├── context.ts                  # 上下文类型
│   ├── config.ts                   # 配置类型
│   └── index.ts                    # AI 对话类型导出
├── ai-chat-perf/                   # AI 对话性能优化类型
│   ├── optimized-types.ts          # 优化后的类型定义
│   ├── context-types.ts            # 上下文优化类型
│   └── index.ts                    # 性能优化类型导出
├── spl/                            # SPL 语言相关类型
│   ├── syntax.ts                   # SPL 语法类型
│   ├── parser.ts                   # 解析器类型
│   └── index.ts                    # SPL 类型导出
└── index.ts                        # 类型定义统一导出
```

## 关键文件说明

- **ai-chat/**: AI 对话相关的完整类型系统，包含消息、上下文、配置等核心类型
- **ai-chat-perf/**: 性能优化的类型定义，基于优化架构的类型系统
- **spl/**: SPL（Structured Processing Language）语言的类型定义
- **index.ts**: 所有类型定义的统一导出入口

## 依赖关系

```
types/
├── 上游依赖
│   ├── gel-api: 核心 API 类型
│   └── react: React 相关类型
├── 内部依赖
│   ├── 类型间相互引用和扩展
│   └── 泛型类型支持
└── 被依赖关系
    ├── 所有模块: 类型定义的基础
    ├── service: 服务层类型支撑
    ├── biz: 业务组件类型支撑
    └── hooks: Hooks 类型支撑
```

## 核心类型系统

### AI 对话类型
- **ChatMessage**: 聊天消息的完整类型定义
- **ChatContext**: 聊天上下文和状态类型
- **ChatConfig**: 聊天配置和设置类型
- **MessageRole**: 消息角色枚举和类型

### 性能优化类型
- **OptimizedContext**: 优化后的运行时上下文
- **ProcessFunction**: 流程处理函数类型
- **StreamProcessor**: 流式处理器类型

### SPL 语言类型
- **SPLSyntax**: SPL 语法树类型
- **SPLParser**: 解析器接口类型
- **SPLEvaluation**: 表达式求值类型

## 设计原则

### 类型安全
- **严格类型**: 避免使用 any 类型
- **泛型支持**: 灵活的泛型类型定义
- **联合类型**: 精确的联合类型定义

### 模块化
- **按功能分组**: 相关类型集中在同一模块
- **依赖清晰**: 明确的类型依赖关系
- **统一导出**: 便捷的类型导出方式

### 可扩展性
- **接口扩展**: 支持接口的扩展和实现
- **类型推导**: 完善的类型推导支持
- **向后兼容**: 类型定义的向后兼容性

## 相关文档

- [TypeScript 规范](../../../docs/rule/typescript-rule.md) - TypeScript 开发规范
- [设计文档](../../../docs/rule/design-doc.md) - 通用设计文档规范

## 使用示例

```typescript
import type {
  ChatMessage,
  ChatContext,
  ChatConfig
} from '@/types/ai-chat'

import type {
  OptimizedContext,
  ProcessFunction
} from '@/types/ai-chat-perf'

import type {
  SPLSyntax,
  SPLParser
} from '@/types/spl'

// 使用 AI 对话类型
const message: ChatMessage = {
  id: 'msg-123',
  content: 'Hello AI',
  role: 'user',
  timestamp: Date.now()
}

// 使用优化类型
const context: OptimizedContext = {
  staticConfig: config,
  runtime: state
}

// 使用 SPL 类型
const parser: SPLParser = {
  parse: (input: string) => syntaxTree,
  validate: (syntax: SPLSyntax) => boolean
}
```