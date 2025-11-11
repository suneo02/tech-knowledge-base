# History 组件文档

## 组件架构

```
HistoryList (主组件)
├── HistoryContent (内容组件)
    ├── HistoryItemList (列表组件)
    │   └── HistoryItem (单个项组件)
    └── HistoryFooter (底部操作栏)
```

## 组件说明

### HistoryList

主组件，负责管理历史对话的整体状态和逻辑。

**主要功能：**

- 搜索历史对话（带防抖）
- 选择模式管理
- 批量删除
- 单个删除
- 重命名功能
- 无限滚动加载

### HistoryContent

内容组件，封装了历史列表和底部操作栏，参数已优化为结构化对象。

**Props 接口：**

```typescript
interface HistoryContentProps {
  // 数据
  groupedHistoryItems: HistoryItem[]
  searchKeyword: string

  // 状态对象
  loadingState: LoadingState
  selectionState: SelectionState

  // 事件处理对象
  handlers: EventHandlers
}
```

**状态对象：**

```typescript
// 加载状态
interface LoadingState {
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
}

// 选择状态
interface SelectionState {
  isSelectionMode: boolean
  selectedHistoryIds: string[]
  hoveredItemId: string | null
}

// 事件处理函数
interface EventHandlers {
  onHistoryClick: (groupId: string) => void
  onSelectItem: (groupId: string) => void
  onSingleDelete: (groupId: string) => void
  onRename: (groupId: string, currentTitle: string) => void
  onHoverChange: (groupId: string | null) => void
  onLoadMore: () => void
  onClearSelection: () => void
  onBatchDelete: () => void
}
```

**使用示例：**

```typescript
<HistoryContent
  groupedHistoryItems={groupedHistoryItems}
  searchKeyword={searchKeyword}
  loadingState={{
    loading,
    loadingMore,
    hasMore,
  }}
  selectionState={{
    isSelectionMode,
    selectedHistoryIds,
    hoveredItemId,
  }}
  handlers={{
    onHistoryClick: handleHistoryClick,
    onSelectItem: handleSelectItem,
    onSingleDelete: handleSingleDelete,
    onRename: handleRename,
    onHoverChange: handleHoverChange,
    onLoadMore: loadMore,
    onClearSelection: clearSelection,
    onBatchDelete: handleBatchDelete,
  }}
/>
```

### HistoryItemList

历史项列表组件，负责渲染历史对话列表。

**Props：**

- `groupedHistoryItems`: 分组后的历史对话项
- `isSelectionMode`: 是否处于选择模式
- `selectedHistoryIds`: 选中的历史对话 ID 数组
- `hoveredItemId`: 当前悬浮的历史对话 ID
- 各种事件处理函数

### HistoryItem

单个历史对话项组件，负责渲染单个历史对话。

**Props：**

- `item`: 历史对话项数据
- `isSelected`: 是否被选中
- `isHovered`: 是否处于悬浮状态
- `isSelectionMode`: 是否处于选择模式
- 各种事件处理函数

## 类型定义

### HistoryItem

```typescript
export interface HistoryItem {
  id: number
  groupId: string
  title?: string
  answers?: string
  updateTime?: string
  group?: ConversationTimeGroup
}
```

## 功能特性

### 1. 搜索功能

- 支持关键词搜索历史对话
- 防抖处理，避免频繁请求
- 空状态显示

### 2. 选择模式

- 支持单选和多选
- 批量删除功能
- 选择状态管理

### 3. 重命名功能

- 支持修改历史对话标题
- 实时更新列表

### 4. 无限滚动

- 自动加载更多历史对话
- 加载状态显示
- 性能优化

### 5. 国际化支持

- 所有文本都支持国际化
- 统一的词条管理

## 样式文件

- `index.module.less`: 主要样式文件
- 使用 BEM 命名规范
- 响应式设计

## 使用注意事项

1. **参数优化**: `HistoryContent` 组件已优化参数结构，将相关参数组合成对象，减少参数数量
2. **类型安全**: 所有组件都有完整的 TypeScript 类型定义
3. **性能优化**: 使用 `useCallback` 和 `useMemo` 优化性能
4. **状态管理**: 通过 `useHistory` Hook 统一管理状态
5. **事件处理**: 所有事件处理函数都通过 props 传递，保持组件纯净
