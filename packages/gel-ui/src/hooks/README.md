# 自定义 Hooks 模块

提供业务相关的自定义 React Hooks，封装复杂的业务逻辑和状态管理，提升组件的可复用性和可维护性。

## 目录结构

```
hooks/
├── aiChat/                         # AI 对话相关 Hooks
│   ├── useXChat.ts                 # 核心聊天 Hook
│   ├── useChatHistory.ts           # 聊天历史 Hook
│   ├── useStreamProcessor.ts       # 流式处理 Hook
│   ├── useChatConfig.ts            # 聊天配置 Hook
│   ├── useMessageHandler.ts        # 消息处理 Hook
│   └── index.ts                    # AI 对话 Hooks 导出
├── index.ts                        # Hooks 统一导出
├── useLocalStorage.ts              # 本地存储 Hook
├── useDebounce.ts                  # 防抖 Hook
├── useThrottle.ts                  # 节流 Hook
├── useMediaQuery.ts                # 媒体查询 Hook
└── useAsyncState.ts                # 异步状态 Hook
```

## 关键文件说明

- **aiChat/useXChat.ts**: AI 对话的核心 Hook，整合完整的对话流程和状态管理
- **aiChat/useStreamProcessor.ts**: 流式数据处理的专用 Hook
- **aiChat/useChatHistory.ts**: 聊天历史管理 Hook，支持持久化和同步
- **useLocalStorage.ts**: 本地存储的 Hook 封装，提供类型安全的存储操作
- **useAsyncState.ts**: 异步状态管理 Hook，处理加载、错误、成功状态

## 依赖关系

```
hooks/
├── 上游依赖
│   ├── react: React 核心和 Hooks API
│   ├── ahooks: 高质量 React Hooks 库
│   └── zustand: 状态管理库（可选）
├── 内部依赖
│   ├── service: 服务层调用
│   ├── utils: 工具函数使用
│   ├── types: 类型定义支持
│   └── constants: 常量使用
└── 被依赖关系
    ├── biz/ai-chat: 业务组件主要消费方
    ├── 页面组件: 直接使用 Hooks
    └── 其他组件: 复用业务逻辑
```

## 核心 Hooks

### AI 对话 Hooks
- **useXChat**: 完整的 AI 对话 Hook，包含消息发送、接收、状态管理
- **useStreamProcessor**: 专门处理流式数据的 Hook
- **useChatHistory**: 聊天历史的增删改查和持久化
- **useMessageHandler**: 消息的发送、接收、处理逻辑
- **useChatConfig**: 聊天配置的管理和应用

### 通用工具 Hooks
- **useLocalStorage**: 类型安全的本地存储操作
- **useDebounce**: 防抖处理，优化性能
- **useThrottle**: 节流处理，控制执行频率
- **useMediaQuery**: 响应式设计的媒体查询 Hook
- **useAsyncState**: 异步操作的统一状态管理

## 设计原则

### 单一职责
- 每个 Hook 专注于单一的业务功能
- 避免过于复杂的逻辑聚合
- 保持 Hook 的简洁和可测试性

### 可复用性
- 通过参数化支持不同使用场景
- 提供配置选项和回调函数
- 支持组合使用多个 Hook

### 类型安全
- 完整的 TypeScript 类型定义
- 泛型支持灵活的类型扩展
- 返回值类型的精确推断

### 性能优化
- 合理的依赖项管理
- 避免不必要的重渲染
- 使用 useMemo 和 useCallback 优化

## Hook 设计模式

### 状态管理模式
```typescript
// 统一的状态管理模式
const useAsyncState = <T, P>(
  asyncFn: (params: P) => Promise<T>,
  initialParams?: P
) => {
  const [state, setState] = useState<{
    data: T | null
    loading: boolean
    error: Error | null
  }>({
    data: null,
    loading: false,
    error: null
  })
  // ... 实现逻辑
  return { ...state, execute, reset }
}
```

### 资源管理模式
```typescript
// 资源的创建和清理
const useResource = <T>(
  factory: () => T,
  cleanup: (resource: T) => void
) => {
  const resourceRef = useRef<T>()
  useEffect(() => {
    resourceRef.current = factory()
    return () => cleanup(resourceRef.current!)
  }, [])
  return resourceRef.current
}
```

## 相关文档

- [React 规范](../../../docs/rule/react-rule.md) - React 开发指南
- [ahooks 文档](https://ahooks.js.org/) - 高质量 React Hooks 库
- [TypeScript 规范](../../../docs/rule/typescript-rule.md) - TypeScript 开发规范

## 使用示例

```typescript
import { useXChat, useLocalStorage, useDebounce } from '@/hooks'
import type { ChatMessage } from '@/types/ai-chat'

// AI 对话 Hook
const {
  messages,
  isLoading,
  sendMessage,
  regenerateMessage,
  stopGeneration
} = useXChat({
  staticConfig,
  onMessageReceived: handleMessage,
  onError: handleError
})

// 本地存储 Hook
const [settings, setSettings] = useLocalStorage('chat-settings', {
  theme: 'light',
  language: 'zh-CN'
})

// 防抖 Hook
const debouncedSearch = useDebounce(
  (keyword: string) => {
    // 搜索逻辑
  },
  300
)

// 使用示例
const handleSend = async (content: string) => {
  await sendMessage({
    content,
    chatId: currentChatId
  })
}
```