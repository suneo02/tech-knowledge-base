import React from 'react'
import { Button, Divider, Tooltip, message } from '@wind/wind-ui'
import CountUp from 'react-countup'
import { TaskStatus } from 'gel-api'
import type { GroupTaskItem } from 'gel-api'
import styles from './index.module.less'
import { PREFIX } from '../../constants'
import { getTaskStatusInfo } from '../../utils/taskUtils'
import { formatTaskName } from '@/utils/area'
import { t } from 'gel-util/intl'

interface TaskCardProps {
  task: GroupTaskItem
  isActive: boolean
  onSelect: (taskId: number) => void
  onRetry: (taskId: number) => void
  onTerminate: (taskId: number) => void
  onViewDetails: (taskId: number) => void
  retryLoading: boolean
  terminateLoading: boolean
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isActive,
  onSelect,
  onRetry,
  onViewDetails,
  retryLoading,
}) => {
  const statusInfo = getTaskStatusInfo(task.status)
  const STRINGS = {
    VIEW_DETAIL: t('481504', '查看名单'),
    RETRY: t('313393', '重试'),
    QUEUING: t('481501', '排队中'),
    // TERMINATE: t('481529', '终止任务'),
    PENDING_TIP: t('482243', '当前任务正在排队中，请稍候...'),
  } as const

  // Helper to get card status style class
  const getCardStatusStyle = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.SUCCESS:
        return `${PREFIX}-order-card-success`
      case TaskStatus.FAILED:
        // case TaskStatus.TERMINATED:
        return `${PREFIX}-order-card-error`
      default:
        return `${PREFIX}-order-card-pending`
    }
  }

  const renderCardContent = () => {
    switch (task.status) {
      case TaskStatus.PENDING:
      case TaskStatus.RUNNING:
        return (
          <>
            <Divider className={styles[`${PREFIX}-order-card-divider`]} />
            <div className={styles[`${PREFIX}-order-card-progress`]}>
              <div>
                {typeof task.progress === 'number' && task.progress > 0 ? (
                  <CountUp start={Number(task.progress)} end={Number(task.progress)} separator="," suffix="%" />
                ) : (
                  STRINGS.QUEUING
                )}
              </div>
              {/* <Button
                  size="small"
                  type="text"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTerminate(task.taskId)
                  }}
                  loading={terminateLoading}
                >
                  {STRINGS.TERMINATE}
                </Button> */}
            </div>
          </>
        )
      case TaskStatus.SUCCESS:
        return (
          <>
            <Divider className={styles[`${PREFIX}-order-card-divider`]} />
            <Button
              size="small"
              type="text"
              onClick={(e) => {
                e.stopPropagation()
                onViewDetails(task.taskId)
              }}
            >
              {STRINGS.VIEW_DETAIL}
            </Button>
          </>
        )
      case TaskStatus.FAILED:
      case TaskStatus.TERMINATED:
        return (
          <>
            <Divider className={styles[`${PREFIX}-order-card-divider`]} />
            <Button
              size="small"
              type="text"
              onClick={(e) => {
                e.stopPropagation()
                onRetry(task.taskId)
              }}
              loading={retryLoading}
            >
              {STRINGS.RETRY}
            </Button>
          </>
        )
      default:
        return null
    }
  }

  const StatusIcon = statusInfo.icon

  const handleCardClick = (e: React.MouseEvent) => {
    if (task.status === TaskStatus.PENDING) {
      e.stopPropagation()
      message.warning(STRINGS.PENDING_TIP)
      return
    }
    onSelect(task.taskId)
  }

  return (
    <div
      role="button"
      onClick={handleCardClick}
      data-task-id={task.taskId}
      className={[
        styles[`${PREFIX}-order-card`],
        styles[getCardStatusStyle(task.status)],
        isActive ? styles[`${PREFIX}-order-card-selected`] : '',
        task.status === TaskStatus.PENDING ? styles[`${PREFIX}-order-card-disabled`] : '',
      ].join(' ')}
    >
      <div className={styles[`${PREFIX}-order-card-title`]}>
        {StatusIcon && (
          <StatusIcon className={statusInfo.className ? styles[`${PREFIX}-${statusInfo.className}`] : ''} />
        )}
        <Tooltip title={formatTaskName(task.areaCode, task.taskName)} placement="top">
          <span>{formatTaskName(task.areaCode, task.taskName)}</span>
        </Tooltip>
      </div>
      {renderCardContent()}
    </div>
  )
}
