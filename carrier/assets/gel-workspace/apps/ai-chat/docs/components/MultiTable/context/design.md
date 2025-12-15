# TableAITaskContext 设计文档

## 概述

TableAITaskContext 是一个 React Context，用于管理表格中 AI 生成内容的任务状态及自动轮询逻辑。它提供了一套完整的状态管理解决方案，用于追踪多个单元格 AI 生成任务的状态，并在适当的时候更新 UI 显示。

## 详细功能说明

1. **任务状态管理**：为每个单元格任务维护一个状态映射表，包括 pending（等待）、running（运行中）、success（成功）和 failed（失败）等状态。
2. **自动轮询机制**：当有任务添加到系统时，会自动开始轮询后端 API 以获取任务最新状态，每 5 秒轮询一次。
3. **智能轮询控制**：当所有任务都完成（成功或失败）时，自动停止轮询，减少不必要的网络请求。
4. **任务标识管理**：使用格式为 "columnId,rowId" 的字符串作为任务标识，便于映射到表格中的具体单元格。
5. **批量任务处理**：支持一次添加多个任务，适用于整列填充等场景。
6. **异常处理**：包含了完善的错误处理机制，确保在 API 调用失败时仍能保持稳定运行。

## 参数说明

### TableAITaskProvider

| 参数名   | 类型      | 描述                |
| -------- | --------- | ------------------- |
| children | ReactNode | Provider 内的子组件 |

### useTableAITask Hook 返回值

| 参数名        | 类型                                          | 描述                         |
| ------------- | --------------------------------------------- | ---------------------------- |
| taskMap       | Record<string, AITaskStatus>                  | 当前所有任务及其状态的映射表 |
| isPolling     | boolean                                       | 是否正在轮询中               |
| updateTask    | (list: string[]) => void                      | 更新任务列表并开始轮询       |
| getTaskStatus | (taskId: string) => AITaskStatus \| undefined | 获取指定任务的状态           |
| resetTask     | (taskId: string) => void                      | 重置（删除）指定任务         |
| resetAllTasks | () => void                                    | 重置所有任务                 |

## 返回值说明

useTableAITask hook 返回一个对象，包含任务状态映射表和操作任务的方法，方便在组件中使用。

## 使用示例

```tsx
import { useTableAITask } from '@/components/MultiTable/context'
import { useEffect } from 'react'

const AIColumnButton = ({ columnId }) => {
  const { updateTask, taskMap } = useTableAITask()

  const handleRunColumn = () => {
    // 收集列中所有单元格的标识
    const cellIdentifiers = rows.map((row) => `${columnId},${row.id}`)

    // 添加到任务队列并开始轮询
    updateTask(cellIdentifiers)
  }

  useEffect(() => {
    // 监听任务状态变化
    console.log('当前任务状态:', taskMap)
  }, [taskMap])

  return <Button onClick={handleRunColumn}>运行AI生成</Button>
}
```
