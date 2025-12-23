# AI 对话优化类型系统架构说明

## 目录职责
提供基于现有 `agent.ts` 和 `parsed.ts` 重新设计的优化类型系统，采用模块化架构和强类型约束，支持泛型扩展和业务定制。

## 目录结构
```
ai-chat-perf/
├── base.ts              # 基础类型定义：BaseMessage、状态枚举、工具类型
├── streamTypes.ts       # 流式输出类型：ModelChunk、流式状态、转换函数
├── config.ts            # 配置类型：BusinessMetadata、AIOutputContent、TechnicalConfig
├── input.ts             # 输入类型：ChatSendInput、AgentBasedSendInput
├── agentMessages.ts     # Agent 消息类型：流水线第二阶段的消息类型
├── parsedMessages.ts    # 解析后消息类型：流水线第三阶段的消息类型
├── messages.ts          # 消息类型统一导出
├── moduleExamples.ts    # 模块扩展示例和类型转换工具
├── index.ts             # 统一导出入口
├── README.md            # 详细使用文档
└── architecture.md      # 本架构说明文档
```

## 文件职责说明
- **base.ts**: 定义基础标识类型、工具类型，BaseMessage 仅用于特殊场景
- **streamTypes.ts**: 定义流式输出相关类型，包括 ModelChunk、流式状态、转换函数等（已简化）
- **config.ts**: 定义业务元数据（用户行为意图）和技术配置（系统参数）的分离
- **input.ts**: 定义三段式流水线的输入类型，支持泛型扩展
- **agentMessages.ts**: 定义流水线第二阶段的 Agent 消息类型（从 ChatSendInput 转换而来）
- **parsedMessages.ts**: 定义流水线第三阶段的解析后消息类型（准备渲染到 UI）
- **messages.ts**: 消息类型统一导出文件
- **moduleExamples.ts**: 提供模块扩展示例和新旧类型转换工具
- **index.ts**: 统一导出所有类型，提供清晰的 API 接口

## 核心设计原则

### 类型约束体系
```
TInput → extends ChatSendInput  
TContext → extends InputContext
TConfig → extends TechnicalConfig
TData → extends Record<string, unknown>
```

注意：在三段式架构中，Agent 和 Parsed 消息都使用交叉类型，不依赖 BaseMessage 约束。

### 三段式数据流
```
ChatSendInput → AgentMessage → ParsedMessage
   ↓           ↓              ↓
 用户输入    代理处理      解析结果
```

### 概念分离
- **InputContext**: 用户输入时的上下文信息和处理偏好
- **AIOutputContent**: AI 生成的输出内容（refBase、refTable、subQuestion）
- **TechnicalConfig**: 纯技术层面的系统配置参数

## 模块依赖
- streamTypes.ts → 独立模块 (定义流式输出相关类型)
- agentMessages.ts → base.ts + config.ts (使用基础类型和配置)
- parsedMessages.ts → base.ts + config.ts + agentMessages.ts (使用基础类型、配置和 Agent 消息)
- messages.ts → agentMessages.ts + parsedMessages.ts (重新导出所有消息类型)
- moduleExamples.ts → 所有模块 (提供转换和示例)
- index.ts → 所有模块 (统一导出)
- 外部模块 → index.ts (通过统一接口使用)

## 与现有系统集成
- **兼容性**: 基于现有 `../ai-chat/message/agent.ts` 和 `../ai-chat/message/parsed.ts` 设计
- **转换工具**: 提供新旧类型双向转换函数
- **渐进迁移**: 支持新旧类型系统并存使用
