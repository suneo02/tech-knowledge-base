# AI Agent 请求服务

负责处理 AI 对话的完整请求流程，包括意图分析、数据召回、问句拆解等核心功能。

## 目录结构

```
agentRequest/
├── helper/                              # 辅助工具函数
│   ├── agentMsgCreator.ts              # AI 消息创建器
│   ├── createHandleError.ts            # 错误处理器创建
│   ├── index.ts                        # 工具函数导出
│   ├── misc.ts                         # 通用辅助函数
│   └── streamParser.ts                 # 流数据解析器
├── processes/                          # 业务流程处理
│   ├── processAnalysis.ts              # 意图分析处理
│   ├── processChatPreflight.ts         # 聊天预检处理
│   ├── processChatSave.ts              # 聊天保存处理
│   ├── processDataRetrieval.ts         # 数据召回处理
│   ├── processQuestionDecomposition.ts # 问句拆解处理
│   ├── processStreamFinalization.ts    # 流式数据终结处理
│   ├── enrichStreamWithPostData.ts     # 流数据后处理增强
│   ├── index.ts                        # 流程函数导出
│   └── README.md                       # 流程处理详细文档
├── unified-handler/                    # 统一请求处理器
│   ├── analytics.ts                    # 数据分析上报
│   ├── index.ts                        # 统一处理器核心
│   ├── processSteps.ts                 # 处理步骤定义
│   ├── streamProcessor.ts              # 流式处理器
│   ├── timeout.ts                      # 超时处理
│   └── types.ts                        # 统一处理器类型
├── events.ts                           # 事件总线系统
├── index.ts                            # 主入口文件
├── logger.ts                           # 日志系统
├── runContext.ts                       # 运行上下文类
└── types.ts                            # 核心类型定义
```

## 关键文件说明

- **types.ts**: 核心类型系统，定义 `ChatStaticConfig`、`RuntimeState` 等关键接口
- **runContext.ts**: 运行上下文类，管理整个请求流程的状态和配置
- **index.ts**: 统一导出所有模块的公共接口
- **events.ts**: 事件总线实现，支持流程事件监听和处理
- **unified-handler/index.ts**: 统一请求处理器，整合所有处理流程

## 依赖关系

```
agentRequest/
├── 上游依赖
│   ├── gel-api: 核心 API 类型和数据结构
│   └── axios: HTTP 请求客户端
├── 内部依赖
│   ├── helper: ← processes, unified-handler
│   ├── events: ← runContext, processes
│   └── types: ← 所有模块
└── 下游服务
    ├── useXChat: React Hook 层调用
    └── middleware: 中间件系统协作
```

## 核心能力

### 请求处理流程
1. **意图分析** (`processAnalysis`) - 分析用户输入意图
2. **数据召回** (`processDataRetrieval`) - 检索相关数据
3. **问句拆解** (`processQuestionDecomposition`) - 拆解复杂问题
4. **流式处理** (`unified-handler/streamProcessor`) - 处理流式响应
5. **数据保存** (`processChatSave`) - 保存对话数据

### 上下文管理
- **ChatRunContext**: 统一的运行上下文，贯穿整个请求流程
- **状态同步**: 自动同步状态变更到所有相关模块
- **事件驱动**: 基于事件的流程控制和状态通知

### 错误处理
- **统一错误处理**: `createHandleError` 提供标准化错误格式
- **流程容错**: 关键流程失败时的降级处理机制
- **日志追踪**: 完整的错误日志和上下文信息

## 相关文档

- [流程处理详细文档](./processes/README.md) - 业务流程处理详细说明
- [设计文档](../../../docs/rule/design-doc.md) - 通用设计文档规范
- [API 请求规范](../../../docs/rule/api-request-rule.md) - API 调用规范
- [错误处理规范](../../../docs/rule/error-handling-rule.md) - 错误处理指南

## 使用示例

```typescript
import { createChatRunContext, createXAgentRequest } from './agentRequest'

// 创建运行上下文
const context = createChatRunContext(staticConfig, sessionConfig)

// 执行完整请求流程
await createXAgentRequest(context)
```