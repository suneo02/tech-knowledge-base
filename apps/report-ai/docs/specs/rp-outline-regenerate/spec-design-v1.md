---
title: 报告大纲重新生成 - 方案设计
version: v1
status: ✅ 已完成
---

# 方案设计 v1

[← 返回任务概览](/docs/specs/rp-outline-regenerate/README.md)

## 设计目标

实现 `handleRegenerate` 函数，使其能够重新发送最后一次的用户消息，生成新的大纲。

## 技术方案

### 核心流程

用户点击"重新生成"按钮 → 获取最后发送的消息 → 调用 sendMessage 重新发送

### 方案要点

1. **复用现有的 inputRef**

   - `inputRef` 由 `useRPOutlineXAgent` 管理，通过 `runtime:updated` 事件自动同步
   - 通过 `useRPOutlineChat` → `RPOutlineProvider` 暴露
   - Context 提供 `getLastSendInput()` 方法访问

2. **chatId 自动处理**

   - `sendMessage` 内部已经处理 chatId（从 ChatRoomContext 获取）
   - `handleRegenerate` 无需关心 chatId，直接调用 `sendMessage` 即可
   - ChatRoomContext 是 chatId 的唯一数据源

3. **保留完整历史**

   - 不清除任何消息
   - 新的响应追加到消息列表
   - 用户可以看到多次生成的结果对比

4. **状态管理**
   - 依赖现有的 `isChating` 状态
   - 按钮禁用逻辑已实现
   - 无需额外状态管理

### 实现步骤

1. **Context 层**

   - 暴露 `getLastSendInput()` 方法
   - 返回 `inputRef.current`

2. **Hook 层**
   - 调用 `getLastSendInput()` 获取最后的输入
   - 直接调用 `sendMessage(lastInput)`
   - 添加边界情况处理（input 为 null）

### 关键设计

**为什么不需要处理 chatId？**

`sendMessage` 内部已经处理：

```typescript
const sendMessage = useCallback(
  (messageInput) => {
    onRequest({
      role: 'user',
      think: 0,
      status: 'finish',
      chatId, // 自动使用 ChatRoomContext 的最新 chatId
      ...messageInput,
    })
  },
  [onRequest, chatId]
)
```

**数据流**：

```
handleRegenerate
  ↓
getLastSendInput() → inputRef.current
  ↓
sendMessage(lastInput)
  ↓
内部合并: { chatId, ...lastInput }
  ↓
发送请求
```

### 依赖关系

- `useRPOutlineContext`：提供 `sendMessage` 和 `getLastSendInput`
- `useChatRoomContext`：提供 `chatId`（由 `sendMessage` 内部使用）
- `inputRef`：由 `useRPOutlineXAgent` 管理，通过 `runtime:updated` 事件同步

@see apps/report-ai/src/context/RPOutline.tsx
@see apps/report-ai/src/hooks/RPOutline/useRPOutlineChat.ts
@see apps/report-ai/src/components/ChatRPOutline/OperationArea/hooks/useOperationActions.ts

## 技术选型

### 方案对比

| 方案                    | 优点               | 缺点             | 选择 |
| ----------------------- | ------------------ | ---------------- | ---- |
| 方案 1：复用 inputRef   | 极简，复用现有逻辑 | 需要暴露 ref     | ✅   |
| 方案 2：从消息列表查找  | 无需修改 Context   | 性能差，逻辑复杂 | ❌   |
| 方案 3：清除历史重发    | 简单直接           | 丢失历史，体验差 | ❌   |
| 方案 4：手动管理 chatId | 显式控制           | 重复逻辑，易出错 | ❌   |

**选择理由**：

- 方案 1 最简洁，只需 5 行核心代码
- 复用现有的 `sendMessage` 逻辑，避免重复
- chatId 管理集中在一处，易于维护
- 符合 DRY 原则

## 边界情况处理

| 场景             | 处理方式              |
| ---------------- | --------------------- |
| inputRef 为 null | 早期返回，输出警告    |
| 并发操作         | 依赖 `isChating` 状态 |

## 性能考虑

- **时间复杂度**：O(1)，直接读取 ref
- **空间复杂度**：O(1)，仅存储一个消息引用
- **优化点**：无需遍历消息列表，无需手动管理 chatId

## 相关文档

- [需求分析 v1](/docs/specs/rp-outline-regenerate/spec-requirements-v1.md)
- [实施计划 v1](/docs/specs/rp-outline-regenerate/spec-implementation-v1.md)
- [TypeScript 规范](/docs/rule/code-typescript-style-rule.md)
- [React 规范](/docs/rule/code-react-component-rule.md)
