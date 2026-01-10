---
title: ChatBase Parser Runtime 重构
owner: report-ai-fe
status: drafting
version: v0.1.0
domain: ai-chat
source: /apps/report-ai/docs/dev/prompts.md:55
created_at: 2025-02-14
updated_at: 2025-02-14
---

[↩ 返回 specs 索引](/apps/report-ai/docs/specs/README.md)

## 1. 任务概览

| 项目 | 说明 |
| --- | --- |
| 任务目标 | 让 `packages/ai-ui/src/hooks/useChatBase.tsx` 与 RPOutline 同步最佳实践：parser 纯函数、发送逻辑集中在 Context |
| 范围 | `/packages/ai-ui/src/hooks/*`、`/packages/ai-ui/src/context/*`、`/packages/ai-ui/docs/*`、`/apps/company/src/views/CompanyDetailAIRight/comp/ChatMessageCore/` |
| 相关人 | chat-infra FE、report-ai FE |
| 依赖 | `gel-ui` Footer 组件需要兼容；`apps/company`、`apps/report-ai` 聊天场景需跟进 |

## 2. 背景与现状

- RPOutline 采用 Context 提供 `sendMessage` + `isLastAIMessage`，parser `parseRPOutlineMessage` 已纯化。@see /apps/report-ai/src/components/ChatRPOutline/parsers/messageParser.tsx:42
- `useChatBase` 仍通过 `parserRef` 和工厂函数向 parser 注入 `sendMessage`，并在 `useXChatParserBase` 内把 `sendMessage` 传递给 `AiFooterBase`。@see /packages/ai-ui/src/hooks/useChatBase.tsx:190
- 此模式导致 parser 有副作用，Footer 逻辑无法复用 RPOutline 的上下文判断，阻碍多产品统一。
- 公司业务 (`/apps/company/src/views/CompanyDetailAIRight/comp/ChatMessageCore/index.tsx:136`) 直接依赖 `useChatBase`，需要保证迁移平滑。

## 3. 问题陈述

| 痛点 | 描述 |
| --- | --- |
| Parser 不纯 | `useXChatParserBase` 依赖 `sendMessage`、axios、Footer，无法独立测试，且 `parserRef` 解包不稳定。 |
| 逻辑分散 | `isLastAIMessage`、`sendMessage` 同时在 parser/组件中处理，容易出现和 RPOutline 一样的 bug。 |
| 扩展困难 | 任何 Footer 想要判断「最后一条消息」都要自己维护，无法像 RPOutline 一样共享 Context。 |
| 重试耦合 | `AiFooterBase` 直接拿到 `sendMessage`，后续要添加埋点或策略时需要在多处 patch。 |

## 4. 目标

1. `useXChatParserBase` 输出纯 parser，无副作用。
2. 新增 `ChatInteractionContext`，集中暴露 `sendMessage`、`agentMessages`、`isLastAIMessage`。
3. `useChatBase` 不再维护 `parserRef`，改为直接传纯函数 parser。
4. 向后兼容：业务侧不改 hook 调用，只需在 ChatBase 组件内包裹 Provider。

## 5. 方案设计

### 5.1 Interaction Context

- 新建 `/packages/ai-ui/src/context/ChatInteractionRuntime.tsx`：
  - `ChatInteractionProvider` 接收 `{ sendMessage, agentMessages, isLastAIMessage, isChating }`。
  - 提供 `useChatInteraction()`。
  - `isLastAIMessage` 通过 `isLastAgentMsgAI` （与 RPOutline 相同逻辑）推导，减少重复判断。
- `useChatBase` 计算 `interactionValue` 并返回，同时在 AI UI ChatBase 组件内部包裹 Provider，业务侧透明。

### 5.2 Parser 与 Footer

- `useXChatParserBase` 改写为接受 `{ axiosChat, axiosEntWeb, roleName }`，内部引用 `ChatAIFooterWithRuntime`：

```tsx
const ChatAIFooterWithRuntime = (props) => {
  const { sendMessage, isLastAIMessage, isChating } = useChatInteraction();
  return (
    <AiFooterBase
      {...props}
      sendMessage={sendMessage}
      isLastAIMessage={isLastAIMessage}
      isChating={isChating}
    />
  );
};
```

- Parser 只负责调用 `createAIContentMessage(message, ChatAIFooterWithRuntime)` 等纯函数，确保输出稳定。

### 5.3 Hook 调整

1. `useChatBase` 直接 `const parser = useXChatParser({...})`，并把 parser 传给 `useXChat`，无需 `useRef`。
2. `sendMessage` 逻辑同 RPOutline：自动填充 `chatId`、`status`、`clientType`，并由 Context 唯一暴露。
3. `useChatBase` 返回 `interactionValue`（内部 useMemo），供 ChatBase 组件包裹 Provider：

```tsx
const interactionValue = useMemo(() => ({ sendMessage, agentMessages, isChating, isLastAIMessage }), [...]);
return { ..., interactionValue };
```

4. `apps/company` 中的 `ChatMessageCore` 使用的 `<ChatBase>` 组件负责注入 Provider，不需要拆改页面。

### 5.4 兼容方案

- 暂时保留旧的 `useXChatParserBase` 导出为 `useXChatParserLegacy`，文档提示将在下个 minor 移除。
- 如果第三方业务直接使用 Footer，需要在 README 给出迁移示例（如何包裹 Provider 或使用 Hook）。

## 6. 实施拆解

| 序号 | 子任务 | Owner | 产出 |
| --- | --- | --- | --- |
| 1 | 新建 `ChatInteractionRuntime` 并补充测试/文档 | chat-infra | 新 context、/packages/ai-ui/docs/chat-hooks.md 更新 |
| 2 | 重构 `useChatBase`，引入 `interactionValue`，删除 `parserRef` | chat-infra | /packages/ai-ui/src/hooks/useChatBase.tsx |
| 3 | 调整 `useXChatParserBase`、新增 `ChatAIFooterWithRuntime` | ui-fe | Hook + Footer 包装组件、Storybook demo |
| 4 | 应用侧验证 | report-ai / company | ChatMessageCore、RPOutline 接入自测脚本 |
| 5 | 文档归档 | docs | 更新 README、本 spec 更新记录 |

## 7. 验收标准

- 单元测试：`pnpm --filter ai-ui test` 覆盖 Context、parser 调用。
- Storybook：`pnpm --filter ai-ui storybook` 确认 Footer 交互正常。
- 手动回归：公司聊天页重试、复制、换公司；RPOutline 场景 sendMessage 行为保持一致。
- 代码审查：确认 parser 不再接受 `sendMessage` 参数（搜索无匹配），`useChatBase` 不再使用 `parserRef`。

## 8. 风险与应对

| 风险 | 缓解 |
| --- | --- |
| Provider 嵌套导致性能问题 | `interactionValue` 使用 `useMemo`，必要时拆分 Context 字段。 |
| 业务忘记包裹 Provider | ChatBase 组件默认包裹，且导出 `ChatInteractionProvider` 供特殊场景使用。 |
| `AiFooterBase` 未来 API 变化 | 通过 wrapper 统一注入，减轻后续修改成本。 |

## 9. 更新记录

| 日期 | 更新人 | 内容 |
| --- | --- | --- |
| 2025-02-14 | report-ai-fe | 首版，提出 ChatBase Parser runtime 重构方案 |
