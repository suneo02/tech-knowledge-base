# @/scroll

本目录收录了所有与滚动行为相关的 React Hooks。

## 目录

- [`useScrollRestoration`](#useScrollRestoration) - 在视图切换时自动保存和恢复元素的滚动位置。

---

## `useScrollRestoration`

### 作用

一个用于在 React 应用中管理和恢复可滚动容器滚动位置的自定义 Hook。

### 使用场景

在复杂的单页应用中，尤其是在有标签页(Tabs)或侧边菜单(Menu)切换内容的场景下，一个常见的用户体验痛点是：当用户在一个长列表中向下滚动，然后切换到另一个标签页再切回来时，滚动位置会丢失，被重置到列表顶部。这迫使用户重新滚动到之前的位置，非常影响使用体验。

此 Hook 解决了以下核心问题：

1.  **自动保存和恢复滚动位置**：当用户在不同视图（由 `activeKey` 标识）间切换时，能自动记住每个视图的滚动位置，并在用户切回时恢复它。
2.  **解决竞态条件 (Race Condition)**：一个更棘手的问题是，当从一个已滚动的视图切换到一个新视图时，新视图可能会错误地"继承"旧视图的滚动位置。这是因为`scroll`事件的触发和 React 的状态更新之间存在延迟。此 Hook 通过一个短暂的计时器守卫，巧妙地忽略了由程序设置滚动条位置时触发的无效`scroll`事件，确保只保存用户的主动滚动行为。

### 如何使用

```jsx
import { useScrollRestoration } from '@/hooks/scroll'

const MyTabsComponent = ({ activeTab, tabsData }) => {
  // 1. 传入当前激活的 tab key
  const { scrollContainerRef, handleScroll } = useScrollRestoration(activeTab)

  return (
    <div className="tabs-container">
      {/* 2. 将 ref 和 onScroll 处理器绑定到你的滚动容器上 */}
      <div className="tab-content" ref={scrollContainerRef} onScroll={handleScroll}>
        {tabsData[activeTab].map((item) => (
          <div key={item.id} style={{ height: '100px', border: '1px solid #ccc', margin: '10px' }}>
            {item.content}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### API

#### 参数

- `activeKey: string`

  - **必需**
  - 唯一标识当前活动视图的键（例如，菜单项的ID或标签页的key）。当这个 `key` 改变时，Hook 会为新视图恢复滚动位置，并开始监听其滚动事件。

- `shouldRestoreOnMount?: boolean`
  - 可选，默认为 `true`
  - 是否在组件首次挂zat载时恢复滚动位置。

#### 返回值

返回一个包含以下内容的对象：

- `scrollContainerRef: React.RefObject<HTMLDivElement>`

  - 一个 React ref 对象。你需要将它附加到你希望管理其滚动位置的 DOM 元素上（例如 `div`）。

- `handleScroll: (event: React.UIEvent<HTMLDivElement>) => void`

  - 一个滚动事件处理函数。你需要将它传递给你滚动容器的 `onScroll` 属性。它负责在用户滚动时捕获并缓存当前的滚动位置。

- `restoreScrollPosition: () => void`
  - 一个手动触发恢复滚动位置的函数。在大多数情况下你不需要手动调用它，因为 Hook 会在 `activeKey` 改变时自动触发。但在某些特殊场景下，你可能希望手动控制恢复时机。
