import React, { useRef, useEffect, useCallback } from 'react'
import type { GroupTaskItem } from 'gel-api'
import { TaskCard } from '../TaskCard'
import styles from './index.module.less'
import { PREFIX } from '../../constants'

interface TaskCardsRowProps {
  tasks: GroupTaskItem[]
  activeTaskId: string
  onTaskSelect: (taskId: string) => void
  onRetry: (taskId: number) => void
  onTerminate: (taskId: number) => void
  onViewDetails: (taskId: number) => void
  operatingTaskId?: string | null
  operationType?: 'retry' | 'terminate' | null
  retryLoading?: boolean
  terminateLoading?: boolean
}

export const TaskCardsRow: React.FC<TaskCardsRowProps> = ({
  tasks,
  activeTaskId,
  onTaskSelect,
  onRetry,
  onTerminate,
  onViewDetails,
  operatingTaskId,
  operationType,
}) => {
  const cardsRowRef = useRef<HTMLDivElement>(null)
  const lastScrolledActiveId = useRef<string>('')

  const handleSelect = useCallback(
    (taskId: number) => {
      onTaskSelect(String(taskId))
    },
    [onTaskSelect]
  )

  // 当 activeTaskId 变化时，将对应卡片平滑滚动到容器视口中间
  useEffect(() => {
    const container = cardsRowRef.current
    if (!container || !activeTaskId) return

    // If we have already scrolled for this activeTaskId, don't do it again just because tasks updated
    // But if we haven't scrolled yet (e.g. initial load or task switch), we proceed
    const card = container.querySelector<HTMLDivElement>(`[data-task-id='${activeTaskId}']`)

    // If card is found and we already scrolled to it, skip
    if (card && lastScrolledActiveId.current === activeTaskId) {
      return
    }

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      const targetCard = container.querySelector<HTMLDivElement>(`[data-task-id='${activeTaskId}']`)
      if (!targetCard) return

      const containerRect = container.getBoundingClientRect()
      const cardRect = targetCard.getBoundingClientRect()

      // Calculate scroll position to center the card
      // We need to account for current scrollLeft because getBoundingClientRect is relative to viewport
      const currentScrollLeft = container.scrollLeft
      const containerCenter = containerRect.width / 2
      const cardCenterRelative = cardRect.left - containerRect.left + cardRect.width / 2

      // Target scroll position = current scroll + (card center relative to container - container center)
      const targetScrollLeft = currentScrollLeft + (cardCenterRelative - containerCenter)

      container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' })

      // Update the ref to indicate we've scrolled for this ID
      lastScrolledActiveId.current = activeTaskId
    })
  }, [activeTaskId, tasks]) // Add tasks dependency to retry scroll when list loads

  return (
    <div
      className={styles[`${PREFIX}-cards-row`]}
      ref={cardsRowRef}
      onWheel={(e) => {
        if (!e.shiftKey && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault()
          const el = cardsRowRef.current
          if (el) {
            el.scrollLeft += e.deltaY
          }
        }
      }}
    >
      {tasks.map((item) => (
        <TaskCard
          key={item.taskId}
          task={item}
          isActive={activeTaskId === String(item.taskId)}
          onSelect={handleSelect}
          onRetry={onRetry}
          onTerminate={onTerminate}
          onViewDetails={onViewDetails}
          retryLoading={operatingTaskId === String(item.taskId) && operationType === 'retry'}
          terminateLoading={operatingTaskId === String(item.taskId) && operationType === 'terminate'}
        />
      ))}
    </div>
  )
}
