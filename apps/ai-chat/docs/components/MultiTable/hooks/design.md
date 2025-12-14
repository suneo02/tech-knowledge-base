# useTableEvents Hook 设计文档

## 概述

`useTableEvents` 是一个自定义 React Hook，用于集中管理和处理 MultiTable 组件中 tableInstance 的各种事件监听。它提供了一种结构化的方式来注册、处理和注销表格事件，使代码更加清晰、可维护，并且便于扩展。

## 详细功能说明

`useTableEvents` Hook 主要负责以下功能：

1. **事件注册与注销**：

   - 在组件挂载时自动注册表格事件监听器
   - 在组件卸载时自动注销表格事件监听器，防止内存泄漏
   - 提供手动注册和注销事件的方法

2. **事件处理**：

   - 列头移动事件（change_header_position）：处理列的拖拽移动
   - 列宽调整事件（resize_column_end）：处理列宽的调整
   - 单元格值变更事件（change_cell_value）：处理单元格内容的编辑
   - 下拉菜单点击事件（dropdown_menu_click）：处理表格中下拉菜单的点击

3. **操作记录**：

   - 通过 `onRecordOperation` 回调函数记录用户的操作，便于实现撤销/重做功能
   - 将事件转换为标准的操作记录格式

4. **菜单处理**：
   - 通过 `onMenuClick` 回调函数处理菜单点击事件

## 参数说明

| 参数名            | 类型                                                                             | 描述               |
| ----------------- | -------------------------------------------------------------------------------- | ------------------ |
| tableRef          | MutableRefObject<ListTable \| null>                                              | 表格实例的引用     |
| columns           | ColumnDefine[]                                                                   | 表格列配置         |
| onRecordOperation | (operation: TableOperation) => void                                              | 记录操作的回调函数 |
| onMenuClick       | (menuKey: MenuKey, props: { field: FieldDef; row: number; col: number }) => void | 菜单点击处理函数   |

## 返回值说明

| 返回值           | 类型       | 描述               |
| ---------------- | ---------- | ------------------ |
| registerEvents   | () => void | 手动注册事件的方法 |
| unregisterEvents | () => void | 手动注销事件的方法 |

## 使用示例

```tsx
import { useRef } from 'react'
import { ListTable } from '@visactor/vtable'
import { useTableEvents } from '../hooks/useTableEvents'
import { useTableOperation } from '../hooks/useTableOperation'
import { useColumnMenuOperations } from '../hooks/useColumnMenuOperations'

const MyTableComponent = () => {
  // 表格实例引用
  const tableRef = useRef<ListTable | null>(null)

  // 列配置
  const columns = [
    /* 列配置 */
  ]

  // 表格操作相关 hook
  const { handleRecordOperation } = useTableOperation()

  // 菜单操作相关 hook
  const { handleMenuClick } = useColumnMenuOperations({ tableRef })

  // 使用表格事件 hook
  useTableEvents({
    tableRef,
    columns,
    onRecordOperation: handleRecordOperation,
    onMenuClick: handleMenuClick,
  })

  return <div>{/* 表格组件 */}</div>
}
```

## 注意事项

1. 确保传入的 `tableRef` 是有效的，否则事件监听将不会被注册
2. 在组件卸载时，事件监听器会被自动注销，但如果需要在组件生命周期内手动注销事件，可以调用返回的 `unregisterEvents` 方法
3. 如果表格配置（如列定义）发生变化，事件处理函数会自动更新以反映这些变化

# useAITaskOperation 钩子设计文档

## 概述

useAITaskOperation 是一个自定义 React Hook，封装了表格中 AI 生成内容任务的操作逻辑。它基于 TableAITaskContext 提供的状态管理能力，为表格组件提供了一套简便的 API，用于处理单元格或整列的 AI 内容生成任务。

## 详细功能说明

1. **创建和解析任务标识**：提供方法创建格式为 "columnId,rowId" 的任务标识，以及将标识解析回列ID和行ID的方法。
2. **单元格任务操作**：允许对单个单元格执行 AI 生成任务，并更新单元格 UI 状态。
3. **批量任务操作**：支持对多个单元格同时执行 AI 生成任务，适用于复杂场景。
4. **整列任务操作**：提供整列处理能力，可选择处理所有单元格或仅处理空值单元格。
5. **任务状态监控**：自动根据任务状态更新单元格 UI 显示，如显示等待、生成中、成功或失败状态。
6. **便捷的表格操作**：封装了表格的行列索引获取、单元格值修改等常用操作，使开发更便捷。
7. **错误处理**：实现了完善的错误处理机制，确保在表格 API 调用失败时不会导致整个应用崩溃。

## 参数说明

### 输入参数

| 参数名        | 类型                                      | 描述           |
| ------------- | ----------------------------------------- | -------------- |
| multiTableRef | React.MutableRefObject<ListTable \| null> | 表格实例的引用 |

### 返回值

| 参数名               | 类型                                                    | 描述                                 |
| -------------------- | ------------------------------------------------------- | ------------------------------------ |
| taskMap              | Record<string, AITaskStatus>                            | 当前所有任务及其状态的映射表         |
| createTaskId         | (columnId: string, rowId: string) => string             | 创建任务标识的方法                   |
| parseTaskId          | (taskId: string) => {columnId, rowId}                   | 解析任务标识的方法                   |
| runCellTask          | (columnId: string, rowId: string) => string             | 运行单个单元格的 AI 任务             |
| runMultipleCellTasks | (cells: Array<{columnId, rowId}>) => string[]           | 运行多个单元格的 AI 任务             |
| runColumnTask        | (columnId: string, mode?: 'all'\|'pending') => string[] | 运行整列的 AI 任务                   |
| updateCellContent    | (taskId: string, content: string) => void               | 更新单元格内容                       |
| checkAndUpdateCells  | () => void                                              | 检查所有任务并根据状态更新单元格显示 |

## 使用示例

```tsx
import { useAITaskOperation } from '@/components/MultiTable/hooks'
import { useEffect, useRef } from 'react'
import { ListTable } from '@visactor/vtable'

const AIColumnComponent = ({ columnId }) => {
  // 表格实例引用
  const tableRef = useRef<ListTable>(null)

  // 获取AI任务操作方法
  const { runColumnTask, checkAndUpdateCells, taskMap } = useAITaskOperation({
    multiTableRef: tableRef,
  })

  // 处理点击运行按钮
  const handleRunClick = () => {
    // 运行整列AI生成，仅处理空值单元格
    runColumnTask(columnId, 'pending')
  }

  // 监听任务状态变化并更新UI
  useEffect(() => {
    checkAndUpdateCells()
  }, [taskMap, checkAndUpdateCells])

  return <Button onClick={handleRunClick}>AI 生成列数据</Button>
}
```
