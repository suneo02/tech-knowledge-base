import ErrorBoundary from '@/components/ErrorBoundary'
import { CloseCircleO, LoadingO } from '@wind/icons'
import { Alert, Skeleton } from '@wind/wind-ui'
import { TaskStatus } from 'gel-api'
import { getUrlSearchValue } from 'gel-util/common'
import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProspectHeader } from './components/ProspectHeader'
import { TaskCardsRow } from './components/TaskCardsRow'
import { TaskLog } from './components/TaskLog/index'
import { PREFIX } from './constants'
import { useTaskOperations } from './hooks/useTaskOperations'
import { useTaskPolling } from './hooks/useTaskPolling'
import styles from './index.module.less'
import { t } from 'gel-util/intl'

export interface ProspectProps {
  id?: string
}

const ProspectContent: React.FC<ProspectProps> = () => {
  const STRINGS = {
    ALERT: t('481527', '挖掘将持续在后台运行。你可以继续其他工作，几分钟后再回来查看结果。'),
    LOG: t('481506', '实时挖掘日志'),
    OVERVIEW_TITLE: t('481528', '进度概览'),
    NO_LOG: t('482244', '暂无挖掘日志'),
    EMPTY_PENDING_DESC: t('482256', '当前名单正在排队中，系统正在为您分配资源，请耐心等待...'),
    EMPTY_ERROR_DESC: t('482257', '当前名单挖掘遇到异常，如需继续请尝试点击“重试”按钮。'),
  } as const
  const navigator = useNavigate()
  const taskId = getUrlSearchValue('id')
  const [activeTaskId, setActiveTaskId] = useState<string>(taskId || '')
  const [operatingTaskId, setOperatingTaskId] = useState<string | null>(null)
  const [operationType, setOperationType] = useState<'retry' | 'terminate' | null>(null)

  const {
    currentTask,
    groupTasks,
    isLoading: isLoadingTask,
    isPolling,
    startPolling, // Need to expose startPolling
  } = useTaskPolling(activeTaskId, (tasks) => {
    // If the current active task is not in the list, switch to the first one
    if (activeTaskId && tasks.length > 0 && !tasks.some((item) => String(item.taskId) === activeTaskId)) {
      setActiveTaskId(String(tasks[0].taskId))
    }
    // If no active task, set to first one
    if (!activeTaskId && tasks.length > 0) {
      setActiveTaskId(String(tasks[0].taskId))
    }
  })

  const { retryRun, terminateRun, handleBuriedAction } = useTaskOperations(() => {
    // When retry succeeds, restart polling
    // ahooks run/runAsync arguments are passed to the service function
    // But here startPolling is the 'run' from useRequest(splAgentTaskDetail), which takes no arguments in its definition context?
    // Wait, splAgentTaskDetail takes taskId.
    // Let's check useTaskPolling definition.
    // useTaskPolling calls useRequest(() => splAgentTaskDetail(Number(taskId)))
    // So the service function inside useRequest has no arguments (it's a closure).
    // So startPolling (which is run) takes whatever arguments the service function takes... wait.
    // If useRequest service is () => Promise, then run takes no args.
    startPolling()
  })

  const selectedProgress = useMemo(() => {
    if (!currentTask) return 0
    return Number(currentTask.progress || 0)
  }, [currentTask])

  const isErrorStatus = useMemo(() => {
    return currentTask?.status === TaskStatus.FAILED || currentTask?.status === TaskStatus.TERMINATED
  }, [currentTask])

  const isSuccessStatus = useMemo(() => {
    return currentTask?.status === TaskStatus.SUCCESS
  }, [currentTask])

  const isPendingStatus = useMemo(() => {
    return currentTask?.status === TaskStatus.PENDING && !selectedProgress
  }, [currentTask, selectedProgress])

  const displayedLogs = useMemo(() => {
    if (!currentTask) return [] as { id: number; description: string }[]
    return (currentTask.logs || []).map((log, idx) => ({
      id: idx + 1,
      description: `[${log.time}] ${log.content}`,
    }))
  }, [currentTask])

  const handleTaskSelect = useCallback((id: string) => {
    setActiveTaskId((prev) => (prev !== id ? id : prev))
  }, [])

  const handleBack = () => {
    handleBuriedAction('back')
    navigator('/home')
  }

  return (
    <div className={`${styles[`${PREFIX}-container`]}`}>
      <ProspectHeader onBack={handleBack} />

      <Alert className={styles[`${PREFIX}-alert`]} message={STRINGS.ALERT} />

      <div className={styles[`${PREFIX}-progress-bar`]}>
        <h3 className={styles[`${PREFIX}-progress-bar-title`]}>
          {STRINGS.OVERVIEW_TITLE}
          {isLoadingTask && <LoadingO className={styles[`${PREFIX}-loading-icon`]} />}
        </h3>

        {activeTaskId ? (
          <TaskCardsRow
            tasks={groupTasks}
            activeTaskId={activeTaskId}
            onTaskSelect={handleTaskSelect}
            onRetry={async (id) => {
              // Prevent multiple clicks if this task is already operating
              if (operatingTaskId === String(id) && operationType === 'retry') return
              handleBuriedAction('retry', id)
              setOperatingTaskId(String(id))
              setOperationType('retry')
              try {
                retryRun(id)
                await new Promise((resolve) => setTimeout(resolve, 3000))
              } finally {
                setOperatingTaskId(null)
                setOperationType(null)
              }
            }}
            onTerminate={async (id) => {
              // Prevent multiple clicks if this task is already operating
              if (operatingTaskId === String(id) && operationType === 'terminate') return
              handleBuriedAction('stop', id)
              setOperatingTaskId(String(id))
              setOperationType('terminate')
              try {
                terminateRun(id)
                await new Promise((resolve) => setTimeout(resolve, 3000))
              } finally {
                setOperatingTaskId(null)
                setOperationType(null)
              }
            }}
            onViewDetails={(id) => {
              handleBuriedAction('view', id)
              console.log(id)
              navigator(`/company-directory?selected=${id}`)
            }}
            operatingTaskId={operatingTaskId}
            operationType={operationType}
          />
        ) : null}
      </div>

      <div className={styles[`${PREFIX}-content`]}>
        {activeTaskId ? (
          isLoadingTask || operatingTaskId ? (
            <div className={styles[`${PREFIX}-content-skeleton`]}>
              <Skeleton animation></Skeleton>
            </div>
          ) : !displayedLogs?.length ? (
            isPendingStatus ? (
              <div className={styles[`${PREFIX}-empty-state`]}>
                <LoadingO className={`${styles[`${PREFIX}-state-icon`]} ${styles[`${PREFIX}-state-icon-loading`]}`} />
                <div>{STRINGS.EMPTY_PENDING_DESC}</div>
              </div>
            ) : isErrorStatus ? (
              <div className={styles[`${PREFIX}-empty-state`]}>
                <CloseCircleO className={`${styles[`${PREFIX}-state-icon`]} ${styles[`${PREFIX}-state-icon-error`]}`} />
                <div>{STRINGS.EMPTY_ERROR_DESC}</div>
              </div>
            ) : isPolling ? (
              <div className={styles[`${PREFIX}-content-skeleton`]}>
                <Skeleton animation></Skeleton>
              </div>
            ) : (
              <div className={styles[`${PREFIX}-empty-state`]}>
                <div>{STRINGS.NO_LOG}</div>
              </div>
            )
          ) : (
            <TaskLog
              logs={displayedLogs}
              progress={selectedProgress}
              isError={isErrorStatus}
              title={STRINGS.LOG}
              status={currentTask?.status}
              isSuccess={isSuccessStatus}
            />
          )
        ) : (
          <div className={styles[`${PREFIX}-content-skeleton`]}>
            <Skeleton animation></Skeleton>
          </div>
        )}
      </div>
    </div>
  )
}

export const Prospect: React.FC<ProspectProps> = (props) => (
  <ErrorBoundary>
    <ProspectContent {...props} />
  </ErrorBoundary>
)
