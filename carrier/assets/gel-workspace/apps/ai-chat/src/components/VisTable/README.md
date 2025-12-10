# VisTable 组件使用指南

VisTable 是一个通用的可视化表格组件，支持各种表格操作和事件处理。通过 `onOperation` 回调函数，可以统一处理所有表格操作。

## 基本用法

```tsx
import { VisTable, OperationType } from '@/components/VisTable'

const MyComponent = () => {
  // 定义操作处理函数
  const handleOperation = (operationType, value) => {
    console.log(`操作类型: ${operationType}`, value)

    // 根据操作类型执行不同的逻辑
    switch (operationType) {
      case OperationType.CELL_CLICK:
        // 处理单元格点击事件
        break
      case OperationType.CELL_CHANGE:
        // 处理单元格值变化事件
        break
      // 处理其他操作类型...
    }
  }

  return <VisTable sheetId="sheet1" onOperation={handleOperation} />
}
```

## 操作类型

VisTable 通过 `OperationType` 枚举定义了所有支持的操作类型，包括：

### 数据操作相关

- `SET_RECORDS`: 设置表格数据
- `ADD_RECORD`: 添加单条数据记录
- `ADD_RECORDS`: 添加多条数据记录
- `DELETE_RECORDS`: 删除数据记录
- `UPDATE_RECORDS`: 更新数据记录

### 表格操作相关

- `REFRESH`: 刷新表格
- `REFRESH_WITH_RECREATE_CELLS`: 重新创建单元格并刷新表格
- `SET_CELL_VALUE`: 设置单元格值
- `GET_CELL_VALUE`: 获取单元格值
- `GET_RECORD_BY_CELL`: 根据单元格位置获取记录

### 事件相关

- `CELL_CLICK`: 单元格点击
- `CELL_CHANGE`: 单元格值变化
- `CELL_SELECTED`: 单元格选中
- `RESIZE_COLUMN`: 列宽调整
- `CHANGE_HEADER_POSITION`: 表头位置变化
- `DROPDOWN_MENU_CLICK`: 下拉菜单点击
- `KEYDOWN`: 键盘事件
- `ICON_CLICK`: 图标点击

### 自定义操作

- `CUSTOM_OPERATION`: 自定义操作，可用于扩展功能

## 高级用法

如果不提供 `onOperation` 回调，组件会使用默认的操作处理逻辑。默认逻辑会执行基本的表格操作，如数据修改、刷新等。

如果提供了 `onOperation` 回调，则会优先调用用户提供的回调函数，用户可以完全自定义操作处理逻辑。

```tsx
// 使用默认操作逻辑，同时处理特定事件
const handleOperationWithDefault = (operationType, value) => {
  // 对特定操作类型进行自定义处理
  if (operationType === OperationType.CELL_CLICK) {
    // 自定义单元格点击逻辑
    console.log('单元格点击:', value)

    // 执行更多操作...

    // 注意: 如果不调用默认操作，需要自行实现所有必要的表格操作
  }

  // 使用默认操作处理逻辑
  // 不需要显式调用，组件内部会处理
}
```

## 操作值类型

不同的操作类型有不同的值结构。例如：

- 单元格事件相关的操作值通常包含 `col`、`row`、`value` 等字段
- 数据操作相关的操作值通常包含 `records`、`recordIndex` 等字段

具体的操作值结构可以查看代码注释或控制台输出进行了解。

# VisTable 表格操作日志功能

## 功能概述

VisTable 操作日志功能允许开发者记录表格的所有操作，包括单元格编辑、列操作、行操作等，并提供撤销/重做功能。这个功能模块使用了与 Redux 类似的状态管理模式，通过 Context API 实现，使得操作日志可以在组件树中共享。

## 主要特性

- 自动记录表格操作
- 提供撤销/重做功能
- 支持与后端同步操作
- 操作日志可视化
- 灵活的配置选项

## 使用方法

### 基本用法

1. 首先，在应用中包装 `VisTableOperationProvider`：

```jsx
import { VisTableContextProvider, VisTableOperationProvider } from '@/components/VisTable'

function App() {
  return (
    <VisTableContextProvider>
      <VisTableOperationProvider tableId="my-table-id">
        <YourTableComponent />
      </VisTableOperationProvider>
    </VisTableContextProvider>
  )
}
```

2. 在组件中使用带操作日志的表格操作方法：

```jsx
import { useTableActionsWithLog } from '@/components/VisTable'

function YourTableComponent() {
  // 获取带操作日志的表格操作方法
  const tableActions = useTableActionsWithLog({
    enableUndoRedo: true,
    onSyncOperation: (operation, tableId, operationNo) => {
      // 这里实现与后端同步的逻辑
      return api.syncOperation(operation, tableId, operationNo)
    },
  })

  // 现在可以使用这些方法操作表格，操作会自动记录
  const handleCellChange = (col, row, value) => {
    tableActions.setCellValue(col, row, value)
  }

  // 撤销/重做
  const handleUndo = () => {
    if (tableActions.canUndo) {
      tableActions.undo()
    }
  }

  const handleRedo = () => {
    if (tableActions.canRedo) {
      tableActions.redo()
    }
  }

  return (
    <div>
      {/* 表格组件 */}
      <button onClick={handleUndo} disabled={!tableActions.canUndo}>
        撤销
      </button>
      <button onClick={handleRedo} disabled={!tableActions.canRedo}>
        重做
      </button>
    </div>
  )
}
```

### 高级用法

如果需要更细粒度的控制，可以直接使用 `useVisTableOperationState` 钩子：

```jsx
import { useVisTableOperationState } from '@/components/VisTable'

function OperationLogViewer() {
  const { operations, operationLogs, undo, redo, canUndo, canRedo } = useVisTableOperationState()

  return (
    <div>
      <h3>操作日志</h3>
      <ul>
        {operationLogs.map((log) => (
          <li key={log.id}>
            {log.timestamp}: {log.description}
            {log.syncStatus === 'FAILED' && <span className="error">(同步失败: {log.error})</span>}
          </li>
        ))}
      </ul>
      <div>
        <button onClick={undo} disabled={!canUndo}>
          撤销
        </button>
        <button onClick={redo} disabled={!canRedo}>
          重做
        </button>
      </div>
    </div>
  )
}
```

## API 参考

### 组件

#### `VisTableOperationProvider`

表格操作日志的上下文提供者。

**属性：**

| 属性名   | 类型      | 必填 | 默认值 | 说明                 |
| -------- | --------- | ---- | ------ | -------------------- |
| children | ReactNode | 是   | -      | 子组件               |
| tableId  | string    | 否   | ''     | 表格ID，用于后端同步 |

### 钩子

#### `useTableActionsWithLog`

提供带操作日志功能的表格操作方法。

**参数：**

| 参数名  | 类型                    | 必填 | 默认值 | 说明     |
| ------- | ----------------------- | ---- | ------ | -------- |
| options | WithOperationLogOptions | 否   | -      | 配置选项 |

**WithOperationLogOptions 类型：**

```typescript
interface WithOperationLogOptions {
  tableId?: string // 表格ID
  enableUndoRedo?: boolean // 是否启用撤销/重做功能
  onSyncOperation?: (operation: VisTableOperation, tableId: string, operationNo: number) => Promise<void> // 同步操作回调
}
```

**返回值：**

返回包含以下方法和属性的对象：

- 所有 `useTableActions` 的方法
- `undo` - 撤销操作的方法
- `redo` - 重做操作的方法
- `canUndo` - 是否可以撤销
- `canRedo` - 是否可以重做
- `operations` - 所有操作记录
- `operationLogs` - 操作日志

#### `useVisTableOperationState`

直接访问操作日志状态和方法。

**参数：**

| 参数名  | 类型                 | 必填 | 默认值 | 说明     |
| ------- | -------------------- | ---- | ------ | -------- |
| options | SyncOperationOptions | 否   | -      | 配置选项 |

**SyncOperationOptions 类型：**

```typescript
interface SyncOperationOptions {
  onSyncOperation?: (operation: VisTableOperation, tableId: string, operationNo: number) => Promise<void> // 同步操作回调
}
```

**返回值：**

返回包含以下方法和属性的对象：

- `recordOperation` - 记录操作的方法
- `undo` - 撤销操作的方法
- `redo` - 重做操作的方法
- `clearHistory` - 清空历史记录的方法
- `setTableId` - 设置表格ID的方法
- `canUndo` - 是否可以撤销
- `canRedo` - 是否可以重做
- `operations` - 所有操作记录
- `operationLogs` - 操作日志
- `currentIndex` - 当前操作索引
- `isUndoRedoInProgress` - 是否正在执行撤销/重做操作
