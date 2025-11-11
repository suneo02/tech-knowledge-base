import { useTableOperations } from '@/contexts/SuperChat/tableActions'
import VisTableTemplate from '@/pages/ProgressGuardDemo/Right/Template'
import { useEffect } from 'react'
import { useTableAITask } from './context/TableAITaskContext'
import { TaskStatusItem } from './context/ai-task/types'
import { useCellPopover } from './hooks/useCellPopover'
import { useETableSetup } from './hooks/useETableSetup'
import styles from './index.module.less'

const PREFIX = 'e-table'

const ETable = ({ tabKey, height }: { tabKey: string; height?: number }) => {
  const { registerOnTasksCompleted, unregisterOnTasksCompleted, updateTask, addTasksOnly } = useTableAITask()
  const { updateRunTaskRecords } = useTableOperations(tabKey)
  const { openCellPopover, CellPopover } = useCellPopover()

  const { containerRef, loading, noData } = useETableSetup(tabKey, {
    onCellClick: openCellPopover,
    updateTask,
    addTasksOnly,
  })

  useEffect(() => {
    const handleTasksCompleted = (completedTasks: TaskStatusItem[]) => {
      console.log('ETable ~ handleTasksCompleted ~ completedTasks:', completedTasks)
      updateRunTaskRecords(completedTasks)
    }

    registerOnTasksCompleted(handleTasksCompleted)
    return () => {
      unregisterOnTasksCompleted(handleTasksCompleted)
    }
  }, [registerOnTasksCompleted, unregisterOnTasksCompleted, updateRunTaskRecords])

  if (!loading && noData) {
    return (
      <div
        className={styles[`${PREFIX}-container`]}
        data-id="super-chat-right"
        style={{ height: `calc(${height}px - 40px - 20px)` }}
      >
        <VisTableTemplate />
      </div>
    )
  }
  return (
    <div className={styles[`${PREFIX}-container`]} data-id="super-chat-right">
      <div
        ref={containerRef}
        className={styles[`${PREFIX}-container-content`]}
        style={{ height: `calc(${height}px - 40px - 20px)` }}
      />
      {CellPopover}
    </div>
  )
}

export default ETable
