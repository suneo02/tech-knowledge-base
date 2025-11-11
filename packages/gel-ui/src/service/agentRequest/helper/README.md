# 辅助工具函数模块

为 AI Agent 请求处理提供通用工具函数和辅助能力。

## 目录结构

```
helper/
├── agentMsgCreator.ts          # AI 消息创建器
├── createHandleError.ts        # 错误处理器创建
├── index.ts                    # 工具函数统一导出
├── misc.ts                     # 通用辅助函数
└── streamParser.ts             # 流数据解析器
```

## 关键文件说明

- **agentMsgCreator.ts**: 创建各种类型的 AI 消息对象，包括消息流、数据召回、子问题等
- **createHandleError.ts**: 提供统一的错误处理函数创建器，标准化错误格式
- **streamParser.ts**: 解析和处理流式数据，支持实时数据转换和格式化
- **misc.ts**: 提供通用的辅助函数，如类型转换、数据验证等

## 依赖关系

```
helper/
├── 上游依赖
│   ├── gel-api: 消息类型定义
│   └── ../types: 核心类型系统
├── 内部使用
│   ├── processes: 流程处理调用消息创建器
│   └── unified-handler: 统一处理器使用错误处理
└── 被依赖关系
    ├── processes: 业务流程处理
    └── unified-handler: 统一请求处理
```

## 核心功能

### 消息创建
- `createAgentAIMsgStream()`: 创建 AI 消息流
- `createAgentMsgAIDataRetrieval()`: 创建数据召回消息
- `createAgentMsgAISubQuestion()`: 创建子问题消息
- `createAgentMsgAIInitBySendInput()`: 初始化发送输入消息

### 错误处理
- `CreateHandleError`: 标准化错误处理函数创建器
- 提供统一的错误格式和上下文信息

### 流数据处理
- `StreamParser`: 流式数据解析器
- 支持多种数据格式的实时转换

## 使用示例

```typescript
import {
  createAgentAIMsgStream,
  createHandleError
} from './helper'

// 创建 AI 消息流
const msgStream = createAgentAIMsgStream({
  chatId: 'xxx',
  content: 'hello',
  timestamp: Date.now()
})

// 创建错误处理器
const handleError = createHandleError('processAnalysis')
handleError(new Error('Analysis failed'), { chatId: 'xxx' })
```