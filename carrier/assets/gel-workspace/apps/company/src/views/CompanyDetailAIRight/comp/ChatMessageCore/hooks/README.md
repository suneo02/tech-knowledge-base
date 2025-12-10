# hooks - ChatMessageCore 自定义 Hooks

提供 ChatMessageCore 组件使用的自定义 hooks。

## 目录结构

```
hooks/
├── index.ts                    # hooks 导出
├── usePresetQuestions.ts       # 预设问句展示判定 hook
└── useVirtualChat.ts           # 虚拟滚动 hook
```

## Hooks 说明

### usePresetQuestionsVisible

预设问句展示判定 hook，负责判断预设问句是否应该展示及展示位置。

**功能**:

- 判断预设问句是否应该展示
- 确定预设问句的展示位置（欢迎消息下方 / 历史消息后）
- 基于 `isSentMsg` 状态控制展示逻辑

**展示规则**:

- 用户已发送过消息（`isSentMsg = true`）→ 隐藏
- 无历史消息（`parsedMessages.length === 0`）→ 展示在欢迎消息下方
- 有历史消息但用户未发言（`isSentMsg = false`）→ 展示在历史消息后

**使用示例**:

```tsx
const { shouldShow, position } = usePresetQuestionsVisible(parsedMessages, isSentMsg)

{
  shouldShow && <PresetQuestions position={position} onSend={handleSendMessage} />
}
```

**相关文档**:

- [设计文档](../../../../../docs/specs/chat-message-core-preset-questions/spec-design-v1.md)
- [需求文档](../../../../../docs/specs/chat-message-core-preset-questions/spec-require-v1.md)

### useVirtualChat

虚拟滚动 hook，优化大量消息场景下的渲染性能。

**功能**:

- 计算可视区域消息
- 动态渲染优化
- 滚动位置管理

**使用场景**: 消息列表超过 100 条时启用

> 与 `VirtualBubbleList` 协作约定：传入的 `groupedBubbleItemsWithKeys` 必须保持索引稳定；当分组数组为空时，组件会 fallback 渲染预设问句，避免欢迎态缺失。

## 相关文档

- [ChatMessageCore 组件](../README.md)
- [React 性能优化规范](../../../../../../../docs/rule/react-rule.md#性能优化)
