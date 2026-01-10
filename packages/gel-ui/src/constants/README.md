# 常量定义模块

提供应用中的常量定义，包括枚举值、魔法数字、固定配置等，避免硬编码提升代码可维护性。

## 目录结构

```
constants/
├── index.ts                        # 常量统一导出
├── api.ts                          # API 相关常量
├── chat.ts                         # 聊天相关常量
├── common.ts                       # 通用常量
├── enums.ts                        # 枚举定义
├── errors.ts                       # 错误码常量
├── events.ts                       # 事件名称常量
├── storage.ts                      # 存储相关常量
└── validation.ts                   # 验证规则常量
```

## 关键文件说明

- **enums.ts**: 核心枚举定义，包含消息角色、状态、类型等
- **api.ts**: API 相关常量，包含接口路径、HTTP 状态码等
- **chat.ts**: 聊天功能专用常量，包含默认配置、限制值等
- **errors.ts**: 错误码和错误信息常量
- **events.ts**: 事件名称常量，避免字符串硬编码
- **storage.ts**: 本地存储的键名和配置常量

## 依赖关系

```
constants/
├── 上游依赖
│   └── 无外部依赖，纯常量定义
├── 内部依赖
│   ├── 常量间的相互引用
│   └── 派生常量的计算
└── 被依赖关系
    ├── 所有模块: 常量消费方
    ├── service: 服务层常量使用
    ├── biz: 业务组件常量使用
    └── utils: 工具函数常量使用
```

## 核心常量分类

### 枚举常量
- **MessageRole**: 消息角色枚举（user, assistant, system）
- **ChatStatus**: 聊天状态枚举（idle, processing, error）
- **MessageType**: 消息类型枚举（text, image, file）
- **ApiStatus**: API 状态枚举（success, error, loading）

### 配置常量
- **ChatConfig**: 聊天默认配置值
- **ApiConfig**: API 配置常量
- **StorageConfig**: 存储配置常量
- **ValidationConfig**: 验证规则常量

### 业务常量
- **Limits**: 各种限制值（消息长度、文件大小等）
- **Timeouts**: 超时时间配置
- **Retries**: 重试次数配置
- **Formats**: 格式常量（日期、文件等）

## 设计原则

### 命名规范
- 使用 UPPER_SNAKE_CASE 命名
- 分组使用前缀标识（CHAT_, API_, STORAGE_）
- 名称语义化，避免缩写

### 分类管理
- 按功能模块分组
- 相关常量集中定义
- 避免循环依赖

### 类型安全
- 使用 as const 断言
- 提供 TypeScript 类型
- 支持枚举式的使用

### 可扩展性
- 预留扩展空间
- 支持环境差异化
- 版本兼容性考虑

## 常量定义模式

### 枚举模式
```typescript
// 使用 as const 创建不可变常量
export const MESSAGE_ROLE = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system'
} as const

export type MessageRole = typeof MESSAGE_ROLE[keyof typeof MESSAGE_ROLE]
```

### 配置模式
```typescript
// 分组配置常量
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 4000,
  MAX_MESSAGES_IN_CHAT: 100,
  DEFAULT_TIMEOUT: 30000,
  RETRY_COUNT: 3
} as const
```

### 事件模式
```typescript
// 事件名称常量
export const CHAT_EVENTS = {
  MESSAGE_SENT: 'chat:message-sent',
  MESSAGE_RECEIVED: 'chat:message-received',
  CHAT_STARTED: 'chat:started',
  CHAT_ENDED: 'chat:ended'
} as const
```

## 相关文档

- [TypeScript 规范](../../../docs/rule/code-typescript-style-rule.md) - TypeScript 开发规范
- [API 请求规范](../../../docs/rule/code-api-client-rule.md) - API 调用规范

## 使用示例

```typescript
import {
  MESSAGE_ROLE,
  CHAT_CONFIG,
  CHAT_EVENTS,
  API_ENDPOINTS
} from '@/constants'

// 使用枚举常量
const message = {
  role: MESSAGE_ROLE.USER,
  content: 'Hello AI'
}

// 使用配置常量
if (message.content.length > CHAT_CONFIG.MAX_MESSAGE_LENGTH) {
  console.error('Message too long')
}

// 使用事件常量
emit(CHAT_EVENTS.MESSAGE_SENT, { message })

// 使用 API 常量
const response = await fetch(API_ENDPOINTS.CHAT_SEND, {
  method: 'POST',
  body: JSON.stringify(message)
})
```
