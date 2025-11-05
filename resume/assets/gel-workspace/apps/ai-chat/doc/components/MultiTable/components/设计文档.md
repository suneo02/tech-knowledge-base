# AITaskButtons 组件设计文档

## 概述

AITaskButtons 是一个用于表格中 AI 生成内容操作的按钮组组件。它提供了一组直观的按钮，允许用户快速执行常见的 AI 内容生成任务，如生成单个单元格内容、生成整列内容和填充空白单元格等。

## 详细功能说明

1. **单元格内容生成**：为当前选中的单元格生成 AI 内容，操作简单直观。
2. **整列内容生成**：一键为整列的所有单元格生成 AI 内容，提高批量处理效率。
3. **空值单元格填充**：智能识别并仅为列中的空白单元格生成内容，避免覆盖已有数据。
4. **任务取消功能**：当有任务正在执行时，提供取消所有任务的按钮，方便用户中断不需要的操作。
5. **状态反馈**：通过消息提示反馈操作结果，如成功开始任务、警告无选中单元格等。
6. **错误处理**：完善的错误捕获和处理机制，确保用户操作失败时有明确的反馈。
7. **自动 UI 更新**：监听任务状态变化，并自动更新相关 UI 状态。

## 参数说明

| 参数名           | 类型                                | 必填 | 描述                                           |
| ---------------- | ----------------------------------- | ---- | ---------------------------------------------- |
| multiTableRef    | MutableRefObject<ListTable \| null> | 是   | 表格实例的引用，用于操作表格                   |
| selectedColumnId | string                              | 否   | 指定要操作的列ID，如果未提供则使用当前选中的列 |
| buttonStyle      | React.CSSProperties                 | 否   | 自定义按钮样式，用于调整按钮外观               |

## 返回值说明

该组件不返回值，仅渲染一组按钮 UI 元素。

## 使用示例

```tsx
import { useRef } from 'react'
import { ListTable } from '@visactor/vtable'
import { AITaskButtons } from '@/components/MultiTable/components/AITaskButtons'

const MyTableComponent = () => {
  const tableRef = useRef<ListTable>(null)

  return (
    <div>
      {/* 在表格上方添加 AI 操作按钮 */}
      <AITaskButtons
        multiTableRef={tableRef}
        // 可选：指定要操作的特定列
        selectedColumnId="column1"
        // 可选：自定义按钮样式
        buttonStyle={{ marginRight: 8 }}
      />

      {/* 表格组件 */}
      <div ref={tableContainerRef}>{/* 表格内容 */}</div>
    </div>
  )
}
```

## 内部实现细节

1. **状态管理**：组件内部使用 `useAITaskOperation` 和 `useTableAITask` 钩子管理 AI 任务状态。
2. **选中单元格处理**：通过表格实例的 `getSelectedCellInfos` 方法获取当前选中的单元格。
3. **任务执行流程**：
   - 确认用户选择了有效的单元格/列
   - 调用相应的 AI 任务执行方法（单元格、整列或空值）
   - 显示操作结果反馈
   - 自动更新 UI 以反映任务状态
4. **错误处理**：使用 try-catch 捕获潜在错误，并通过消息组件向用户提供友好的反馈。

## 扩展性

该组件可以通过以下方式扩展：

1. 添加更多按钮支持更多 AI 生成场景
2. 集成任务进度指示器
3. 添加任务历史记录功能
4. 集成自定义 AI 生成参数配置

# AITaskStatusPanel 组件设计文档

## 概述

AITaskStatusPanel 是一个用于展示和监控表格中 AI 生成任务状态的面板组件。它提供了直观的任务队列视图，让用户能够实时了解各个 AI 生成任务的排队和处理状态，包括等待中、生成中、已完成和失败等不同状态的任务。

## 详细功能说明

1. **任务状态实时监控**：实时显示所有 AI 生成任务的当前状态，包括等待中、生成中、已完成和失败。
2. **任务进度统计**：提供任务总数、各状态任务数量以及整体进度的统计信息。
3. **任务列表展示**：列表形式展示所有任务，显示所属列名、当前值和状态。
4. **任务管理功能**：提供清除已完成任务和清除全部任务的操作按钮。
5. **自动折叠控制**：可以根据是否有任务自动控制面板的折叠状态。
6. **系统状态指示**：通过轮询状态指示器展示系统是否正在轮询后端获取任务状态。
7. **任务进度条**：直观显示整体任务完成进度。
8. **标签化状态展示**：使用颜色和图标区分不同状态的任务。

## 参数说明

| 参数名        | 类型                                | 必填 | 描述                                          |
| ------------- | ----------------------------------- | ---- | --------------------------------------------- |
| multiTableRef | MutableRefObject<ListTable \| null> | 是   | 表格实例的引用，用于获取列信息和单元格值      |
| autoCollapse  | boolean                             | 否   | 是否自动折叠面板（当没有任务时），默认为 true |
| style         | React.CSSProperties                 | 否   | 自定义面板样式                                |

## 返回值说明

该组件不返回值，仅渲染一个可折叠的任务状态面板。

## 使用示例

```tsx
import { useRef } from 'react'
import { ListTable } from '@visactor/vtable'
import { AITaskStatusPanel } from '@/components/MultiTable/components/AITaskStatusPanel'

const MyTableComponent = () => {
  const tableRef = useRef<ListTable>(null)

  return (
    <div>
      {/* 在表格上方或下方添加任务状态面板 */}
      <AITaskStatusPanel multiTableRef={tableRef} autoCollapse={true} style={{ marginBottom: 16 }} />

      {/* 表格组件 */}
      <div ref={tableContainerRef}>{/* 表格内容 */}</div>
    </div>
  )
}
```

## 内部实现细节

1. **状态管理**：

   - 使用 `useTableAITask` 钩子获取所有任务的状态映射和相关操作方法
   - 使用 `useAITaskOperation` 钩子获取任务ID解析功能
   - 使用 `useState` 管理面板的折叠状态

2. **任务信息获取**：

   - 从表格中获取列名和单元格值等任务相关信息
   - 通过解析任务ID获取列ID和行ID
   - 从表格的数据源中查找对应的行和列

3. **UI 状态管理**：

   - 根据任务状态动态显示不同的标签和图标
   - 计算和显示任务进度
   - 自动控制面板的折叠状态

4. **异常处理**：
   - 对获取任务信息的过程进行错误捕获和处理
   - 当表格数据不可用时提供默认值

## 扩展性

该组件可以通过以下方式扩展：

1. 添加任务优先级显示
2. 集成任务详情查看功能
3. 添加任务执行时间统计
4. 增加按列或行筛选任务的功能
5. 加入任务重试机制

# AITaskButton 组件设计文档

## 概述

AITaskButton 是一个用于在多表格（MultiTable）中随机设置单元格状态为"pendding"并触发 AI 生成任务的组件。它提供了一种便捷的方式，通过点击按钮随机为表格中的单元格设置待处理状态，并将这些单元格提交给 AI 服务进行内容生成。

## 详细功能说明

1. **随机状态设置**：组件会随机选择表格中的单元格，并将其状态设置为"pendding"。
2. **触发 AI 生成**：对于设置为"pendding"状态的单元格，组件会收集它们的标识符（columnId 和 rowId），并通过 TableAITaskContext 提供的 updateTask 函数触发 AI 生成任务。
3. **可配置性**：
   - 可以设置随机选择单元格的比例（pendingRate）
   - 可以通过 columnIdFilter 限制只处理特定列的单元格
4. **状态可视化**：设置为"pendding"状态的单元格会在 AITaskStatusPanel 中显示其状态

## 参数说明

| 参数名         | 类型                                     | 描述                                   | 是否必须 | 默认值 |
| -------------- | ---------------------------------------- | -------------------------------------- | -------- | ------ |
| multiTableRef  | React.MutableRefObject<VTable.ListTable> | VTable 表格实例的引用                  | 是       | -      |
| pendingRate    | number                                   | 设置为"pendding"状态的单元格比例 (0-1) | 否       | 0.3    |
| columnIdFilter | string[]                                 | 只处理指定列 ID 的过滤器               | 否       | -      |

## 返回值说明

组件渲染一个带有工具提示的按钮，点击按钮会执行随机设置和 AI 任务触发逻辑。

## 使用示例

```tsx
import { AITaskButton } from '@/components/MultiTable/components/AITaskButton'
import * as VTable from '@visactor/vtable'
import { useRef } from 'react'

const MyTableComponent = () => {
  const multiTableRef = useRef<VTable.ListTable>(null)

  return (
    <div>
      {/* VTable 渲染代码 */}
      <div ref={containerRef}>{/* VTable 将在此渲染 */}</div>

      {/* AI 任务按钮 */}
      <AITaskButton multiTableRef={multiTableRef} pendingRate={0.2} columnIdFilter={['name', 'description']} />

      {/* 显示任务状态的面板 */}
      <AITaskStatusPanel multiTableRef={multiTableRef} />
    </div>
  )
}
```

## 相关组件

- **useRandomAITasks**：提供随机设置"pendding"状态并触发 AI 生成任务的 Hook
- **AITaskStatusPanel**：显示 AI 任务状态和进度的面板组件
- **TableAITaskContext**：管理 AI 任务状态和生命周期的上下文

## 数据流图

```
┌─────────────────┐       ┌───────────────────┐       ┌────────────────────┐
│                 │       │                   │       │                    │
│  AITaskButton   │─────▶│ useRandomAITasks  │─────▶│ TableAITaskContext │
│                 │       │                   │       │                    │
└─────────────────┘       └───────────────────┘       └────────────────────┘
                                                              │
                                                              ▼
                                                     ┌────────────────────┐
                                                     │                    │
                                                     │ AITaskStatusPanel  │
                                                     │                    │
                                                     └────────────────────┘
```

## 注意事项

1. 确保在使用该组件时，上层组件树中已包含 `TableAITaskProvider`，以提供任务状态管理功能。
2. 该组件主要用于开发和测试环境，方便模拟 AI 生成任务的触发。
3. 当前实现中，设置为"pendding"状态的单元格会被标记为需要 AI 生成，但实际的生成内容仍依赖于 `TableAITaskContext` 提供的后端服务。
