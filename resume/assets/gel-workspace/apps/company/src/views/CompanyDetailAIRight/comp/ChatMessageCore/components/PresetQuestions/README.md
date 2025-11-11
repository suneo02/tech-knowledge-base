# PresetQuestions 组件

预设问句展示组件，用于在聊天界面中展示常见问题，用户点击后可快速发送消息。

## 功能特性

- 📝 组件内部集成 API 调用，自动加载预设问句
- 🎲 随机选择 3 个问句展示
- 🖱️ 点击问句直接发送消息
- 🎨 悬停效果和点击反馈
- 📱 响应式设计
- 🛡️ 错误降级，不阻塞主流程

## Props

```typescript
interface PresetQuestionsProps {
  /** 展示位置：welcome-欢迎消息下方，after-history-历史消息后 */
  position: 'welcome' | 'after-history'
  /** 点击问句回调 */
  onSend: (message: string) => void
}
```

## 使用示例

```tsx
import { PresetQuestions } from './components/PresetQuestions'
import { usePresetQuestionsVisible } from './hooks'

// 使用 Hook 判定是否展示
const { shouldShow, position } = usePresetQuestionsVisible(parsedMessages, isSentMsg)

// 条件渲染组件
{
  shouldShow && <PresetQuestions position={position} onSend={handleSendMessage} />
}
```

## 架构设计

### 职责分离

- **Hook (`usePresetQuestionsVisible`)**: 只负责判定展示逻辑
- **组件 (`PresetQuestions`)**: 负责数据获取、渲染和交互

### 数据流

1. 组件挂载时调用 `getQuestion` API（`questionsType=1`）
2. 随机打散返回结果并取前 3 条
3. 渲染问句列表，`after-history` 位置时添加分割线
4. 点击问句时调用 `onSend` 回调
5. 错误时降级为空状态，不阻塞主流程

## 样式定制

组件使用 CSS Modules，可通过修改 `PresetQuestions.module.less` 自定义样式。

主要样式类：

- `.presetQuestions` - 容器
- `.divider` - 分割线
- `.questionsContainer` - 问句列表容器
- `.questionItem` - 单个问句项
- `.questionText` - 问句文本

## 性能优化

- 使用 `React.memo` 避免不必要的重渲染
- 使用 `useMemo` 缓存随机选择结果
- 空数据和加载状态下不渲染

## 注意事项

1. 问句数据来自 `getQuestion` API (questionsType: 1)
2. 随机选择逻辑在每次 questions 变化时重新执行
3. 点击问句后会触发 `onSend` 回调
4. 组件会自动处理空数据和加载状态
5. 错误时降级为空状态，不影响聊天主流程

## 相关文档

- [设计文档](../../../../../docs/specs/chat-message-core-preset-questions/spec-design-v1.md)
- [需求文档](../../../../../docs/specs/chat-message-core-preset-questions/spec-require-v1.md)
- [实施计划](../../../../../docs/specs/chat-message-core-preset-questions/spec-implementation-plan-v1.md)
