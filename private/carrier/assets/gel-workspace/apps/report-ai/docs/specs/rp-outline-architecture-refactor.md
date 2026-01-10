# RPOutline 架构重构规范

## 概述

本次重构优化了 RPOutline 聊天模块的架构设计，通过统一的 Context 管理、纯函数 Parser 和组件内部状态判断，实现了更清晰的关注点分离和更高的代码复用性。

## 核心问题

### 问题 1：消息类型冗余

- 存在 `outlineEditor` 和 `outlinePreview` 两种消息类型
- Parser 需要提前判断是否为最后一条消息来决定创建哪种类型
- 使用 `useRef` 避免闭包陷阱，代码复杂

### 问题 2：逻辑分散

- `isLastMessage` 判断逻辑在多个组件中重复实现
- `sendMessage` 需要在每次调用时手动传入 `clientType`
- Parser 依赖外部参数，不是纯函数

## 解决方案

### 1. 统一消息类型

**合并为单一 `outline` 消息类型**

```typescript
// 之前：两种类型
type OutlineEditorMessage = { role: 'outlineEditor'; ... }
type OutlinePreviewMessage = { role: 'outlinePreview'; ... }

// 现在：统一类型
type OutlineMessage = {
  role: 'outline';
  content?: ReportOutlineData & { rawSentenceID?: string };
}
```

### 2. Context 统一封装

**在 RPOutlineContext 中提供统一的业务逻辑**

```typescript
export type RPOutlineCtx = {
  sendMessage: (input: RPOutlineSendInput) => void
  agentMessages: MessageInfo<RPOutlineAgentMsg>[]
  isLastAIMessage: (msg: RPOutlineAgentMsgAI) => boolean // 新增
  // ...
}
```

**实现要点：**

- `sendMessage` 自动添加 `clientType: 'aireport'`
- `isLastAIMessage` 封装判断逻辑，避免组件重复实现

### 3. 纯函数 Parser

**从工厂函数改为静态导出函数**

```typescript
// 之前：工厂函数
export function createRPOutlineMessageParser(sendMessage) {
  return (msg) => {
    /* ... */
  }
}

// 现在：纯函数
export const parseRPOutlineMessage = (msg: RPOutlineAgentMsg) => {
  // 无需任何参数，直接解析
  return [...parsedMessages]
}
```

### 4. 组件从 Context 获取状态

**AIFooter 和 OutlineRoleMessage 都从 Context 读取**

```typescript
const { sendMessage, isLastAIMessage } = useRPOutlineContext()
const isLastMessage = isLastAIMessage(agentMessage)
```

## 架构对比

### 之前

```
Parser(sendMessage, getIsLastMessage)
  → 创建不同类型消息
  → 组件接收 props
```

### 现在

```
Parser(纯函数)
  → 统一消息类型
  → 组件从 Context 获取状态
  → 动态判断展示模式
```

## 核心优势

1. **单一数据源**：所有状态和逻辑集中在 Context
2. **纯函数 Parser**：无副作用，易测试，零运行时开销
3. **代码复用**：`isLastAIMessage` 只实现一次
4. **关注点分离**：Parser 负责转换，Context 负责状态，组件负责展示
5. **易于维护**：修改业务逻辑只需改 Context 一处

## 修改文件清单

- `apps/report-ai/src/types/chat/parsedMsg.ts` - 合并消息类型
- `apps/report-ai/src/context/RPOutline.tsx` - 添加 `isLastAIMessage` 方法
- `apps/report-ai/src/hooks/RPOutline/useRPOutlineChat.ts` - 封装 `clientType`
- `apps/report-ai/src/components/ChatRPOutline/parsers/` - 改为纯函数
- `apps/report-ai/src/components/ChatCommon/ChatRoles/outline.tsx` - 统一 role 组件
- `apps/report-ai/src/components/ChatRPOutline/AIFooter/` - 使用 Context

## 最佳实践

1. **Context 封装业务规则**：默认值、判断逻辑等
2. **Parser 保持纯函数**：只做数据转换，不依赖外部状态
3. **组件最小化 props**：优先从 Context 获取
4. **避免重复逻辑**：相同逻辑统一封装到 Context
