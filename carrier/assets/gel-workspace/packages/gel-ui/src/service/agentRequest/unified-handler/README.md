# 统一请求处理器

提供 AI Agent 请求的统一处理入口，整合预处理、流式处理、超时管理、数据分析等功能。

## 目录结构

```
unified-handler/
├── analytics.ts            # 数据分析上报
├── index.ts                # 统一处理器核心实现
├── processSteps.ts         # 处理步骤定义
├── streamProcessor.ts      # 流式数据处理器
├── timeout.ts              # 超时处理机制
└── types.ts                # 统一处理器类型定义
```

## 关键文件说明

- **index.ts**: 核心统一处理器，整合所有处理步骤
- **streamProcessor.ts**: 专门处理流式数据接收和解析
- **timeout.ts**: 提供请求超时管理和重置机制
- **analytics.ts**: 负责用户行为和请求分析的数据上报
- **processSteps.ts**: 定义处理步骤的执行顺序和逻辑
- **types.ts**: 统一处理器的接口类型定义

## 依赖关系

```
unified-handler/
├── 上游依赖
│   ├── ../types: 核心类型系统
│   ├── ../helper: 辅助工具函数
│   └── ../processes: 业务流程处理
├── 内部协作
│   ├── streamProcessor ← index: 流式数据处理
│   ├── timeout ← index: 超时控制
│   └── analytics ← index: 数据上报
└── 下游使用
    ├── 外部应用: 通过 createXAgentRequest 调用
    └── useXChat: React Hook 层集成
```

## 核心功能

### 请求处理流程
1. **预处理** (`processPreprocessing`) - 请求参数验证和初始化
2. **流式处理** (`processStreamRequest`) - 处理流式数据响应
3. **超时管理** (`resetTimeout`, `clearTimeoutTimer`) - 请求超时控制
4. **中止处理** (`handleStreamAbort`) - 请求中止和清理
5. **数据分析** (`reportAnalytics`) - 用户行为数据上报

### 统一入口
- `createXAgentRequest()`: 主要的统一处理函数入口
- 整合所有处理步骤，提供完整的请求处理能力

### 流式处理
- 支持实时数据流接收和解析
- 自动处理流数据格式转换和验证
- 提供流数据事件回调机制

## 使用示例

```typescript
import { createXAgentRequest, resetTimeout } from './unified-handler'

// 执行完整请求处理
await createXAgentRequest(context, {
  onStreamData: (data) => console.log('Stream data:', data),
  onComplete: (result) => console.log('Request completed:', result),
  onError: (error) => console.error('Request failed:', error)
})

// 重置超时计时器
resetTimeout(context, 30000) // 30秒超时
```