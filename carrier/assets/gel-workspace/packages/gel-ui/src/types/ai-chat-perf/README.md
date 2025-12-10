# AI 对话优化类型系统

## 概述

这是一个基于现有 `agent.ts` 和 `parsed.ts` 重新设计的优化类型系统，采用模块化架构，提供更好的类型安全和开发体验。

## 设计原则

### 🎯 **核心原则**
1. **泛型支持**: 所有类型都支持泛型，确保灵活性和可扩展性
2. **通用参数**: 类型参数必须是通用的，不依赖特定模块
3. **模块自定义**: 各模块可以基于这些通用类型进行扩展
4. **展平结构**: 将嵌套对象展平到顶级，提供更直观的访问方式
5. **基于现有**: 参考现有的 `agent.ts` 和 `parsed.ts` 设计，保持兼容性

### 📋 **强约束规则**
- `TMessage` → `extends BaseMessage`
- `TInput` → `extends ChatSendInput` 
- `TMeta` → `extends BusinessMetadata`
- `TConfig` → `extends TechnicalConfig`
- `TData` → `extends Record<string, unknown>`

## 模块结构

### 📁 **文件组织**
```
ai-chat-perf/
├── base.ts           # 基础类型定义
├── config.ts         # 配置和元数据类型
├── input.ts          # 输入类型定义
├── messages.ts       # 消息类型定义（基于现有 agent.ts 和 parsed.ts）
├── pipeline.ts       # 流水线和函数类型
├── module-examples.ts # 模块扩展示例
├── index.ts          # 主入口文件
└── README.md         # 本文档
```

### 🔧 **模块职责**

#### **base.ts** - 基础类型
- `ModelChunk<TDelta, TMeta>` - 通用流式分片类型
- `BaseMessage<TContent, TMeta>` - 通用消息基础接口
- `MessageStatus` - 通用状态类型
- `MessageError` - 通用错误类型
- 工具类型：`PartialDeep`, `RequiredDeep`, `KeysOf`, `ValuesOf`, `If`

#### **config.ts** - 配置类型
- `BusinessMetadata` - 业务元数据（基于现有字段展平）
- `TechnicalConfig` - 技术配置
- `BaseConfig<TConfig>` - 通用配置接口
- `BaseContext<TData, TMeta>` - 通用上下文接口

#### **input.ts** - 输入类型
- `ChatSendInput<TContent, TMeta, TConfig>` - 通用输入类型
- `DefaultSendInput` - 默认输入类型
- `AgentBasedSendInput` - 基于现有 Agent 的输入类型

#### **messages.ts** - 消息类型
基于现有 `agent.ts` 和 `parsed.ts` 重新设计：

**Agent 消息类型**:
- `AgentUserMessage` - 用户消息（基于 `AgentMsgUserShare`）
- `AgentAIMessage` - AI 消息（基于 `AgentMsgAIShare`）
- `ExtendedAgentAIMessage` - 扩展 AI 消息（基于 `AgentMsgAIDepre`）

**解析后消息类型**:
- `ParsedUserMessage` - 解析后用户消息（基于 `UserMessageGEL`）
- `ParsedAIMessage` - 解析后 AI 消息（基于 `AIMessageGEL`）
- `ParsedAIReportMessage` - 报告消息（基于 `AIMessageReportContent`）
- `ParsedSuggestionMessage` - 建议消息（基于 `SuggestionMessage`）
- `ParsedFileMessage` - 文件消息（基于 `FileMessage`）
- `ParsedChartMessage` - 图表消息（基于 `ChartMessage`）
- `ParsedSubQuestionMessage` - 子问题消息（基于 `SubQuestionMessage`）
- `ParsedSimpleChartMessage` - 简单图表消息（基于 `SimpleChartMessage`）
- `ParsedSplTableMessage` - 超级名单表格消息（基于 `SplTableMessage`）

#### **pipeline.ts** - 流水线类型
- `AgentMessage<TMessage>` - 代理消息类型
- `ParsedMessage<TParsed>` - 解析后消息类型
- `StreamOutput<TOutput>` - 输出类型
- 转换函数类型：`TransformFunction`, `ParseFunction`, `ValidateFunction`, `FilterFunction`
- `PipelineProcessor` - 完整的流水线处理器接口

## 三段式流水线

### 🔄 **流程设计**
```
Input (ChatSendInput)
    ↓ InputToAgentFunction
AgentMessage (BaseMessage)
    ↓ AgentToParsedFunction  
ParsedMessage (BaseMessage)
    ↓ 渲染到 UI
```

### 📝 **ChatSendInput 结构**
```typescript
interface ChatSendInput<TContent, TMeta, TConfig> {
  content: TContent    // 核心内容：用户输入的主要内容
  meta?: TMeta        // 业务元数据：影响 AI 处理逻辑的业务信息
  config?: TConfig    // 技术配置：控制请求行为的技术参数
  timestamp?: number  // 时间戳
  requestId?: string  // 请求ID
}
```

#### **字段分类说明**

**`content` - 核心内容**
- 用户输入的主要内容
- 对应现有 `AgentMsgUserShare.content`

**`meta` - 业务元数据** (基于 `BusinessMetadata`)
包含**用户行为和业务意图**的元数据，**不包含 AI 输出内容**：
```typescript
interface BusinessMetadata {
  // 基础业务信息
  chatId?: string           // 会话ID
  agentId?: string         // 代理ID  
  agentParam?: AgentParam  // 代理参数
  
  // 展平的实体选项（用户选择的实体）
  entityType?: string      // 实体类型
  entityName?: string      // 实体名称
  entityCode?: string      // 实体代码
  
  // 展平的模型选项（用户选择的模型）
  modelType?: string       // 模型类型
  
  // 展平的搜索和思考信号（用户的偏好设置）
  deepSearch?: boolean     // 深度搜索偏好
  think?: boolean          // 思考模式偏好
  
  // 用户行为意图
  queryIntent?: 'analysis' | 'comparison' | 'search' | 'report' | 'chart' | 'custom'
  expectedFormat?: 'text' | 'chart' | 'table' | 'report' | 'mixed'
  businessContext?: 'research' | 'investment' | 'compliance' | 'reporting' | 'analysis'
}
```

**重要说明**：`BusinessMetadata` 专注于用户输入时的业务上下文，不包含 AI 输出的内容（如 `refBase`、`refTable`、`subQuestion`）。这些 AI 输出内容被单独定义在 `AIOutputContent` 接口中。

### 📤 **AI 输出内容** (基于 `AIOutputContent`)
AI 生成的引用和关联数据，这些字段属于 AI 的输出结果：
```typescript
interface AIOutputContent {
  refBase?: RAGItem[]  // AI 生成的引用资料
  refTable?: DPUItem[]          // AI 生成的表格信息
  subQuestion?: string[]             // AI 拆解的子问题
  entities?: any[]                   // AI 识别的实体
  chartData?: any[]                  // AI 生成的图表
}
```

**设计原则**：
- 这些字段是 AI 处理后的输出结果
- 不属于用户的业务元数据
- 主要用于 AI 消息类型中

**`config` - 技术配置** (基于 `TechnicalConfig`)
包含纯技术层面的配置参数：
```typescript
interface TechnicalConfig {
  timeout?: number         // 超时时间
  retries?: number        // 重试次数
  streaming?: boolean     // 是否流式输出
  maxConcurrency?: number // 最大并发数
  enableCache?: boolean   // 是否启用缓存
  logLevel?: string       // 日志级别
}
```

## 使用示例

### 🚀 **基础使用**

```typescript
import type { 
  ChatSendInput, 
  BusinessMetadata, 
  TechnicalConfig,
  AgentUserMessage,
  ParsedAIMessage
} from '@/types/ai-chat-perf'

// 定义输入
const input: ChatSendInput<string, BusinessMetadata, TechnicalConfig> = {
  content: "请分析这家公司的财务状况",
  meta: {
    chatId: "chat_123",
    agentId: "financial_agent",
    entityCode: "000001",
    entityType: "stock",
    deepSearch: true,
    think: true
  },
  config: {
    timeout: 30000,
    streaming: true,
    retries: 3
  }
}
```

### 🔧 **模块扩展**

```typescript
// 报告模块的自定义元数据
interface ReportMetadata extends BusinessMetadata {
  reportId: string
  chapterId?: string
  reportType: 'financial' | 'market' | 'custom'
}

// 报告模块的自定义配置
interface ReportConfig extends TechnicalConfig {
  includeCharts: boolean
  includeTables: boolean
  format: 'markdown' | 'html' | 'json'
}

// 报告模块的输入类型
type ReportInput = ChatSendInput<string, ReportMetadata, ReportConfig>

// 报告模块的消息类型
interface ReportMessage extends BaseMessage<string, ReportMetadata> {
  role: 'user' | 'ai'
  reportData?: {
    chapters: string[]
    charts: ChartData[]
  }
}
```

### 🔄 **类型转换**

```typescript
import { convertAgentMsgToSendInput, convertSendInputToAgentMsg } from '@/types/ai-chat-perf/module-examples'

// 现有类型 → 新类型
const oldAgentMsg: AgentMsgUserShare = { /* ... */ }
const newInput = convertAgentMsgToSendInput(oldAgentMsg)

// 新类型 → 现有类型  
const newInput: ChatSendInput = { /* ... */ }
const oldAgentMsg = convertSendInputToAgentMsg(newInput)
```

## 展平结构的优势

### 🎯 **设计特点：展平结构**

将嵌套的配置对象展平到 `BusinessMetadata` 的顶级，提供更直观的访问方式：

```typescript
// ❌ 嵌套结构（不推荐）
interface NestedMetadata {
  entityOptions: {
    entityType: string
    entityCode: string
  }
  modelOptions: {
    modelType: string
  }
}

// ✅ 展平结构（推荐）
interface BusinessMetadata extends EntityOptions, ModelOptions {
  entityType: string    // 直接访问
  entityCode: string    // 直接访问
  modelType: string     // 直接访问
}
```

### 📈 **展平结构的优势**

1. **更简洁的访问**：
```typescript
// 嵌套：meta.entityOptions.entityType
// 展平：meta.entityType
```

2. **更好的类型推断**：
```typescript
// TypeScript 能更好地推断展平后的类型
const entityType = meta.entityType // string | undefined
```

3. **更容易的解构**：
```typescript
const { entityType, entityCode, modelType } = meta
```

4. **更好的 IDE 支持**：
- 自动补全更准确
- 重构更安全
- 查找引用更精确

## 向后兼容性

### 🔄 **兼容性保证**
- 重新导出所有现有类型
- 提供转换工具函数
- 保持现有 API 不变
- 支持渐进式迁移

### 📝 **迁移指南**
1. **新项目**：直接使用新的类型系统
2. **现有项目**：使用转换工具逐步迁移
3. **混合使用**：新功能用新类型，旧功能保持不变

## 最佳实践

### ✅ **推荐做法**

```typescript
// 1. 明确的类型继承
interface CustomMeta extends BusinessMetadata {
  moduleId: string
  version: number
}

// 2. 使用强约束的泛型
const processor: PipelineProcessor<
  ChatSendInput<string, CustomMeta>,
  AgentUserMessage,
  ParsedAIMessage
> = { /* ... */ }

// 3. 利用展平结构
const { entityType, entityCode, deepSearch } = input.meta || {}
```

### 🚫 **避免的做法**

```typescript
// ❌ 不继承基类型
interface BadMeta {
  someField: string
  // 缺少 BusinessMetadata 的必要字段
}

// ❌ 使用 any 绕过约束
const badProcessor: PipelineProcessor<any, any, any> = { /* ... */ }

// ❌ 嵌套访问（应该使用展平结构）
const entityType = meta.entityOptions?.entityType
```

## 总结

这个优化的类型系统提供了：

1. **🎯 更强的类型安全**：通过泛型约束防止类型错误
2. **🚀 更好的开发体验**：智能提示、自动补全、重构支持
3. **🔧 更高的可扩展性**：模块化设计，易于扩展
4. **📈 更好的性能**：编译时类型检查，运行时零开销
5. **🔄 完全的兼容性**：不破坏现有代码，支持渐进迁移

基于现有的 `agent.ts` 和 `parsed.ts` 设计，确保了与现有系统的完美集成！🎉