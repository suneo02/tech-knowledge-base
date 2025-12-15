# VirtualBubbleList 组件

虚拟滚动消息列表组件，负责渲染聊天消息列表并集成预设问句。

## 功能特性

- 🚀 虚拟滚动优化，支持大量消息渲染
- 💬 集成预设问句展示
- 📜 支持滚动事件处理
- 🎨 使用分组渲染优化性能

## 数据流与依赖

VirtualBubbleList 不直接负责拆分消息，而是消费上游 `ChatMessageCore` 产出的分组数据，并结合虚拟滚动器渲染：

1. `useBubbleItems` 将原始 `parsedMessages` 转换成气泡项数组。
2. `groupedBubbleItems` 按「用户消息 + AI 回复」维度对气泡项进行分组，同时在没有历史数据时注入欢迎消息分组。
3. `groupedBubbleItemsWithKeys` 为每个分组绑定稳定的 `key`，保障虚拟滚动测量准确。
4. `useVirtualChat` 基于分组数量创建虚拟行（`virtualItems`），驱动 VirtualBubbleList 按需渲染。

> ⚠️ 关键约束：虚拟行索引与 `groupedBubbleItemsWithKeys` 一一对应，任何对分组顺序的修改都必须保持索引稳定，否则会导致定位错乱。

## Props

```typescript
interface VirtualBubbleListProps {
  chatContainerRef: React.RefObject<HTMLDivElement> // 聊天容器引用
  rowVirtualizer: Virtualizer<HTMLDivElement, Element> // 虚拟滚动器实例
  groupedBubbleItemsWithKeys: Array<{ key: string; items: any[] }> // 分组消息数据
  roles: RolesTypeCore // 角色配置
  shouldShowPresetQuestions: boolean // 是否显示预设问句
  presetQuestionsPosition: 'welcome' | 'after-history' // 预设问句位置
  handlePresetQuestionClick: (question: string) => void // 预设问句点击回调
  handleScroll: () => void // 滚动事件回调
}
```

## 使用示例

```tsx
import { VirtualBubbleList } from './components/VirtualBubbleList'
;<VirtualBubbleList
  chatContainerRef={chatContainerRef}
  rowVirtualizer={rowVirtualizer}
  groupedBubbleItemsWithKeys={groupedBubbleItemsWithKeys}
  roles={roles}
  shouldShowPresetQuestions={shouldShowPresetQuestions}
  presetQuestionsPosition={presetQuestionsPosition}
  handlePresetQuestionClick={handlePresetQuestionClick}
  handleScroll={handleScroll}
/>
```

## 预设问句渲染策略

| 场景                           | 数据特征                               | 渲染位置             |
| ------------------------------ | -------------------------------------- | -------------------- |
| 欢迎态（无历史分组）           | `groupedBubbleItemsWithKeys.length=0`  | 列表尾部兜底渲染     |
| 有历史消息且用户未发言         | 分组包含至少一个历史分组               | 最后一组后紧邻展示   |
| 用户已发言或 Hook 判定为隐藏态 | `shouldShowPresetQuestions = false`    | 不渲染               |

当虚拟列表为空时（仅展示欢迎气泡），`rowVirtualizer` 不会返回虚拟项。组件通过 `hasNoGroups` 兜底将 `PresetQuestions` 渲染在容器结尾，确保欢迎场景仍能展示预设问句。

## 架构设计

### 职责

1. 渲染虚拟滚动的消息列表
2. 在最后一组消息后显示预设问句
3. 处理滚动事件

### 性能优化

- 使用 `React.memo` 避免不必要的重渲染
- 虚拟滚动只渲染可见区域的消息
- 分组渲染减少虚拟滚动计算量

## 相关组件

- [PresetQuestions](../PresetQuestions/README.md) - 预设问句组件
- [useVirtualChat](../../hooks/useVirtualChat.ts) - 虚拟滚动 Hook

## 注意事项

1. 组件使用 `React.memo` 包裹，确保传入的 props 引用稳定
2. `rowVirtualizer` 由 `useVirtualChat` Hook 提供
3. 预设问句只在最后一组消息后显示
4. 滚动事件用于触发加载更多历史消息
5. 若需要修改消息分组策略，需同步更新 `groupedBubbleItems` 与 `groupedBubbleItemsWithKeys` 的结构说明，以免破坏虚拟滚动与预设问句的对齐关系
