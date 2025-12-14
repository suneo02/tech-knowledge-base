# AI Chat Process Functions

基于 ChatRunContext 的统一流程函数，提供一致的上下文接口设计。

## 概述

Process 函数是专注于特定业务逻辑处理的纯函数实现。通过使用统一的 `ChatRunContext` 作为入参，确保了一致的上下文接口和互操作性。

## 设计原则

### 统一接口
- 所有 process 函数都使用 `ChatRunContext<TInput, TChunk>` 作为入参
- 支持泛型，允许自定义输入和输出类型
- 返回 Promise，支持异步处理

### 状态管理
- 通过 `Object.assign(context.runtime, updates)` 更新运行时状态
- 状态变更会自动同步到整个执行上下文
- 支持状态的读取和修改

### 错误处理
- 遵循统一的错误处理模式
- 支持中止信号 (AbortSignal) 的处理
- 提供详细的错误日志和上下文信息

## 核心函数

### processAnalysis

意图分析处理函数，负责用户消息的意图识别和分析。

```typescript
import { processAnalysis } from './processes'

// 使用示例
const result = await processAnalysis(context)
console.log('分析结果:', result)
```

**功能特性：**
- 调用 analysisEngine 进行意图分析
- 处理分析结果和错误
- 更新上下文状态（rawSentenceID, chatId, it, rewriteSentence）
- 触发 `beforeAnalysis` 和 `afterAnalysis` 事件

**返回结果：**
```typescript
interface ProcessAnalysisResult {
  rawSentenceID: string
  chatId: string
  it?: string
  rewriteSentence?: string
}
```

### processDataRetrieval

数据召回处理函数，基于分析结果进行数据检索和召回。

```typescript
import { processDataRetrieval } from './processes'

// 使用示例
await processDataRetrieval(context)
```

**功能特性：**
- 根据分析结果进行数据召回
- 处理数据检索错误（不影响主流程）
- 执行 queryReference 请求
- 触发 `beforeDataRetrieval` 和 `afterDataRetrieval` 事件
- 错误容错处理

### processQuestionDecomposition

问句拆解处理函数，进行问句拆解和轮询处理。

```typescript
import { processQuestionDecomposition } from './processes'

// 使用示例
const result = await processQuestionDecomposition(context)
console.log('拆解结果:', result)
```

**功能特性：**
- 根据分析结果进行问句拆解轮询
- 处理拆解结果和事件通知
- 更新上下文状态（dpuResponse, ragResponse, gelData 等）
- 触发 `beforeQuestionDecomposition`、`afterQuestionDecomposition` 和 `onQuestionReceived` 事件
- 支持轮询和中止机制

**返回结果：**
```typescript
interface ProcessQuestionDecompositionResult {
  dpuResponse?: ChatDPUResponse
  ragResponse?: ChatRAGResponse
  gelData?: GelData[]
  splTable?: SplTable[]
  reportData?: ReportChatData
  modelType?: EModelType
}
```

## 回调函数系统

Process 函数使用简单直接的回调函数替代复杂的事件系统，提供最直观、高效的通知机制。

> **为什么选择回调函数？**
> 
> 经过重新评估，我们发现即使是简化的 SimpleEventBus 仍然过于复杂。对于简单的通知需求，直接的回调函数是最优解：
> - **零复杂度**: 不需要任何事件系统
> - **类型安全**: 完整的 TypeScript 支持
> - **易于理解**: 直观的函数参数
> - **高性能**: 直接函数调用，无额外开销

### 支持的回调类型

#### 分析相关回调
- `onAnalysisStart` - 分析开始回调
- `onAnalysisSuccess` - 分析成功回调 (替代 `onAnalysisEngineSuccess`)
- `onAnalysisError` - 分析错误回调

#### 数据召回相关回调
- `onDataRetrievalStart` - 数据召回开始回调
- `onDataRetrievalSuccess` - 数据召回成功回调
- `onDataRetrievalError` - 数据召回错误回调

#### 问句拆解相关回调
- `onQuestionDecompositionStart` - 问句拆解开始回调
- `onQuestionDecompositionSuccess` - 问句拆解成功回调
- `onQuestionDecompositionError` - 问句拆解错误回调
- `onQuestionReceived` - 接收到问题回调 (替代 `onReciveQuestion`)

#### 通用回调
- `onError` - 通用错误回调
- `onComplete` - 完成回调

### 回调使用示例

```typescript
import { processAnalysis, ProcessCallbacks } from './processes'

// 定义回调函数
const callbacks: ProcessCallbacks = {
  // 分析相关回调 (替代 onAnalysisEngineSuccess)
  onAnalysisSuccess: (analysisResult) => {
    console.log('分析完成:', analysisResult)
    
    // 处理分析结果
    handleAnalysisSuccess(analysisResult)
  },
  
  onAnalysisError: (error) => {
    console.error('分析失败:', error)
    // 处理错误
  },

  // 问题接收回调 (替代 onReciveQuestion)
  onQuestionReceived: (questions) => {
    console.log('接收到问题:', questions)
    
    // 处理接收到的问题
    handleQuestionsReceived(questions)
  },

  // 数据召回回调
  onDataRetrievalSuccess: () => {
    console.log('数据召回成功')
  },
  
  onDataRetrievalError: (error) => {
    console.error('数据召回失败:', error)
  }
}

// 调用 process 函数，传入回调
const result = await processAnalysis(context, callbacks)
```

### 回调函数类型定义

```typescript
// 完整的回调接口
interface ProcessCallbacks {
  // 分析相关回调
  onAnalysisStart?: (data: { message: string; chatId: string }) => void | Promise<void>
  onAnalysisSuccess?: (result: AnalysisEngineResponse) => void | Promise<void>
  onAnalysisError?: (error: Error) => void | Promise<void>

  // 数据召回相关回调
  onDataRetrievalStart?: (data: { chatId: string; rawSentenceID: string }) => void | Promise<void>
  onDataRetrievalSuccess?: () => void | Promise<void>
  onDataRetrievalError?: (error: Error) => void | Promise<void>

  // 问句拆解相关回调
  onQuestionDecompositionStart?: (data: { rawSentenceID: string }) => void | Promise<void>
  onQuestionDecompositionSuccess?: (result: any) => void | Promise<void>
  onQuestionDecompositionError?: (error: Error) => void | Promise<void>
  onQuestionReceived?: (questions: string[]) => void | Promise<void>

  // 通用回调
  onError?: (error: Error, phase: string) => void | Promise<void>
  onComplete?: (result: any) => void | Promise<void>
}

// Process 函数类型（带回调）
type ProcessFunctionWithCallbacks<TResult = void> = (
  context: ChatRunContext,
  callbacks?: ProcessCallbacks
) => Promise<TResult>
```

### 迁移指南

#### 从旧回调函数迁移

**旧方式 (SessionConfig 中的回调):**
```typescript
// 旧的回调方式
const sessionConfig = {
  onAnalysisEngineSuccess: (result) => {
    console.log('分析成功:', result)
  },
  onReciveQuestion: (questions) => {
    console.log('接收到问题:', questions)
  }
}
```

**新方式 (Process 函数参数):**
```typescript
// 新的回调方式 - 作为函数参数传入
const callbacks: ProcessCallbacks = {
  onAnalysisSuccess: (result) => {
    console.log('分析成功:', result)
  },
  onQuestionReceived: (questions) => {
    console.log('接收到问题:', questions)
  }
}

await processAnalysis(context, callbacks)
```

#### 使用迁移工具

```typescript
import { createCallbacksFromLegacy } from './processes'

// 自动转换旧回调
const legacyCallbacks = {
  onAnalysisEngineSuccess: (result) => console.log('分析成功:', result),
  onReciveQuestion: (questions) => console.log('问题:', questions)
}

const callbacks = createCallbacksFromLegacy(legacyCallbacks)
await processAnalysis(context, callbacks)
```

### 回调函数优势

1. **极简设计**: 移除所有事件系统，只保留最基本的回调函数
2. **零复杂度**: 不需要任何额外的抽象层或事件总线
3. **高性能**: 直接函数调用，无任何额外开销
4. **类型安全**: 完整的 TypeScript 类型支持，编译时检查
5. **易于理解**: 最直观的函数参数，无学习成本
6. **灵活使用**: 可选参数，按需使用
7. **易于调试**: 直接的函数调用栈，便于调试和追踪

## 使用方式

### 基础使用

```typescript
import { 
  processAnalysis, 
  processDataRetrieval, 
  processQuestionDecomposition,
  ChatRunContext 
} from './processes'

// 创建或获取 context
const context: ChatRunContext = {
  // ... context 配置
}

// 顺序执行流程函数
try {
  const analysisResult = await processAnalysis(context)
  await processDataRetrieval(context)
  const questionResult = await processQuestionDecomposition(context)
} catch (error) {
  console.error('Process execution failed:', error)
}
```

### 批量执行

```typescript
import { executeProcessSequence, PROCESS_ORDER } from './processes'

// 按预定义顺序执行所有流程
await executeProcessSequence(context, PROCESS_ORDER)

// 自定义执行顺序
await executeProcessSequence(context, ['analysis', 'data-retrieval'])
```

### 并行执行

```typescript
import { executeProcessParallel } from './processes'

// 并行执行多个流程（适用于独立的处理逻辑）
await executeProcessParallel(context, ['data-retrieval', 'question-decomposition'])
```

### 条件执行

```typescript
import { createConditionalProcess, processAnalysis } from './processes'

// 创建条件执行的流程函数
const conditionalAnalysis = createConditionalProcess(
  processAnalysis,
  (context) => context.runtime.status === 'initializing'
)

await conditionalAnalysis(context)
```

### 安全执行

```typescript
import { createSafeProcess, processDataRetrieval } from './processes'

// 创建带错误处理的流程函数
const safeDataRetrieval = createSafeProcess(processDataRetrieval)

await safeDataRetrieval(context) // 不会抛出错误
```

## 上下文结构

### ChatRunContext

```typescript
interface ChatRunContext<TInput, TChunk> {
  // 静态配置 - 所有会话共享
  staticCfg: {
    axiosInstance: AxiosInstance
    isDev: boolean
    clientType: ChatClientType
  }
  
  // 会话配置 - 会话创建时确定
  sessionCfg: {
    input: TInput
    // 注意：回调函数已移除，现在作为 process 函数的参数传递
  }
  
  // 运行时状态 - 执行过程中变化
  runtime: {
    status: MessageStatus | RunStatus
    chatId: string
    rawSentenceID?: string
    it?: string
    rewriteSentence?: string
    // ... 其他状态字段
  }
  
  // 控制器
  abortController?: AbortController
  
  // 注意：不再需要事件总线，回调函数直接作为参数传递
  
  // 扩展字段
  [key: string]: unknown
}
```

## 与 Middleware 的关系

### 相似性
- **统一接口**: 都使用 `ChatRunContext` 作为参数
- **状态管理**: 都通过 `Object.assign(context.runtime, updates)` 更新状态
- **错误处理**: 都遵循相同的错误处理模式
- **中止支持**: 都支持 AbortController 中止机制

### 差异性
- **执行方式**: Process 函数是纯函数，Middleware 是类实例
- **流程控制**: Process 函数需要手动编排，Middleware 有自动的 pipeline
- **生命周期**: Process 函数没有 `next()` 概念，专注于单一职责

### 迁移指南

从 Middleware 迁移到 Process 函数：

```typescript
// 原 Middleware 方式
class AnalysisMiddleware extends BaseMiddleware {
  async handle(context: ChatRunContext): Promise<void> {
    // 处理逻辑
    await context.next()
  }
}

// 新 Process 函数方式
async function processAnalysis(context: ChatRunContext): Promise<ProcessAnalysisResult> {
  // 相同的处理逻辑，但返回结果而不是调用 next()
  return result
}
```

## 最佳实践

### 错误处理
```typescript
// 推荐：使用 try-catch 处理错误
try {
  await processAnalysis(context)
} catch (error) {
  console.error('Analysis failed:', error)
  // 根据业务需求决定是否继续执行
}

// 推荐：使用安全包装器
const safeProcess = createSafeProcess(processAnalysis, defaultResult)
```

### 状态管理
```typescript
// 推荐：及时更新状态
Object.assign(context.runtime, {
  rawSentenceID: result.rawSentenceID,
  status: 'processing'
})

// 推荐：读取最新状态
const { chatId, rawSentenceID } = context.runtime
```

### 性能优化
```typescript
// 推荐：并行执行独立的流程
await Promise.all([
  processDataRetrieval(context),
  processQuestionDecomposition(context)
])

// 推荐：条件执行减少不必要的处理
if (context.runtime.rawSentenceID) {
  await processDataRetrieval(context)
}
```

## 类型安全

所有 process 函数都支持泛型，确保类型安全：

```typescript
// 自定义输入类型
interface CustomInput extends ChatSendInput {
  customField: string
}

// 自定义分片类型
interface CustomChunk extends ModelChunk {
  customData: any
}

// 类型化的 process 函数调用
const result = await processAnalysis<CustomInput, CustomChunk>(context)
```

## 调试和监控

### 日志记录
所有 process 函数都包含详细的日志记录：

```typescript
console.log('[processAnalysis] Starting analysis processing')
console.log('[processAnalysis] Analysis processing completed')
```

### 性能监控
可以通过装饰器添加性能监控：

```typescript
const monitoredProcess = withPerformanceMonitoring(processAnalysis)
await monitoredProcess(context)
```

### 错误追踪
错误信息包含完整的上下文：

```typescript
catch (error) {
  console.error('[processAnalysis] Analysis processing failed:', error)
  // 错误对象包含 chatId, rawSentenceID 等上下文信息
}
```

## 总结

重构后的 process 函数提供了：

1. **统一的接口设计** - 与 middleware 保持一致
2. **灵活的执行方式** - 支持顺序、并行、条件执行
3. **完整的类型支持** - 泛型和类型安全
4. **强大的错误处理** - 容错和恢复机制
5. **便捷的工具函数** - 简化常见操作

这种设计既保持了与现有 middleware 系统的兼容性，又提供了更灵活的函数式编程体验。
