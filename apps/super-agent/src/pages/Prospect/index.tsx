import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from './index.module.less'
import { t } from 'gel-util/locales'
import { Alert, Button, Divider, Skeleton, Progress, Tooltip } from '@wind/wind-ui'
import CountUp from 'react-countup'
import { useNavigate } from 'react-router-dom'
import { CheckCircleO, CloseCircleO, LoadingO, StopCircleO } from '@wind/icons'
import { useRequest } from 'ahooks'
import { getUrlSearchValue } from 'gel-util/common'
import { requestToWFC } from '@/api'
import { TaskStatus } from 'gel-api'
import { getAreaNameByCode } from '@/utils/area'

export interface ProspectProps {
  id?: string
}

const PREFIX = 'prospect'

const STRINGS = {
  TITLE: t('', '正在挖掘客户...'),
  BUTTON: t('', 'Click'),
  BACK: t('', '返回工作台'),
  ALERT: t('', '🔔 挖掘将持续在后台运行。你可以继续其他工作，几分钟后再回来查看结果。'),
  TASK: t('', '挖掘任务'),
  START_TIME: t('', '开始时间'),
  ESTIMATED_COMPLETION: t('', '预估完成'),
  FOUND_ENTERPRISE: t('', '已找到企业'),
  LOG: t('', '实时挖掘日志'),
  OVERVIEW_TITLE: t('', '进度概览'),
  VIEW_DETAIL: t('', '查看详情'),
  RETRY_ALL: t('', '全部重试'),
  QUEUING: t('', '排队中'),
  RUNNING: t('', '运行中'),
  TERMINATED: t('', '已终止'),
} as const

// API 类型
interface TaskLogItem {
  time: string
  content: string
}

interface CurrentTask {
  taskId: number
  taskName: string
  areaCode: string
  status: number
  progress: number
  customerCount: number
  logs: TaskLogItem[]
  createTime: string
}

interface GroupTaskItem {
  taskId: number
  taskName: string
  areaCode: string
  status: number
  progress: number
  customerCount: number
}

const splAgentTaskDetail = (taskId: number) => requestToWFC('operation/get/splAgentTaskDetail', { taskId })

// interface TaskDetailResponse {
//   Data: {
//     currentTask: CurrentTask
//     groupTasks: GroupTaskItem[]
//   }
//   ErrorCode: string
//   ErrorMessage: string
//   Page: Record<string, never>
//   State: number
// }

// 挖掘任务
// 1 · 1 · 2025-09-23 17:41
// 开始时间
// 2025-09-23 17:41
// 预估完成
// 约2-3分钟
// 已找到企业
// 2 家

export const Prospect: React.FC<ProspectProps> = () => {
  const logListRef = useRef<HTMLDivElement | null>(null)
  const cardsRowRef = useRef<HTMLDivElement | null>(null)
  const navigator = useNavigate()
  const taskId = getUrlSearchValue('id')

  const [groupTasks, setGroupTasks] = useState<GroupTaskItem[]>([])
  const [currentTask, setCurrentTask] = useState<CurrentTask>()
  const [activeTaskId, setActiveTaskId] = useState<string>(taskId || '')

  // const progress = useRef(1)

  const { cancel } = useRequest(() => splAgentTaskDetail(Number(activeTaskId)), {
    pollingInterval: 5000,
    pollingErrorRetryCount: 3,
    refreshDeps: [activeTaskId],
    onSuccess: (res) => {
      if (res && res.Data) {
        if (
          res.Data.groupTasks.every(
            (item) =>
              item.status === TaskStatus.SUCCESS ||
              item.status === TaskStatus.FAILED ||
              item.status === TaskStatus.TERMINATED
          )
        ) {
          cancel()
        }
        setGroupTasks(res.Data.groupTasks || [])
        setCurrentTask(res.Data.currentTask)
        if (!res.Data.groupTasks?.some((item) => item.taskId === Number(activeTaskId))) {
          setActiveTaskId(String(res.Data.groupTasks[0].taskId))
        }
      }
      return res
    },
  })

  useEffect(() => {
    // 日志变更时滚动到底部
    const el = logListRef.current
    if (el) {
      setTimeout(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
      }, 200)
    }
  }, [currentTask?.logs?.length])

  const displayedLogs = useMemo(() => {
    if (!currentTask) return [] as { id: number; description: string }[]
    return (currentTask.logs || []).map((log, idx) => ({
      id: idx + 1,
      description: `[${log.time}] ${log.content}`,
    }))
  }, [currentTask])

  const selectedProgress = useMemo(() => {
    if (!currentTask) return 0
    return Number(currentTask.progress || 0)
  }, [currentTask])

  // 当 activeTaskId 变化时，将对应卡片平滑滚动到容器视口中间
  useEffect(() => {
    const container = cardsRowRef.current
    if (!container || !activeTaskId) return
    const card = container.querySelector<HTMLDivElement>(`[data-task-id='${activeTaskId}']`)
    if (!card) return
    const containerRect = container.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()
    const containerCenter = containerRect.left + container.clientWidth / 2
    const cardCenter = cardRect.left + cardRect.width / 2
    const delta = cardCenter - containerCenter
    container.scrollBy({ left: delta, behavior: 'smooth' })
  }, [activeTaskId])

  return (
    <div className={`${styles[`${PREFIX}-container`]}`}>
      <div className={styles[`${PREFIX}-title`]}>
        <h2>
          {STRINGS.TITLE}
          {activeTaskId}
        </h2>
        <Button onClick={() => navigator('/home')}>{STRINGS.BACK}</Button>
      </div>
      <Alert className={styles[`${PREFIX}-alert`]} message={STRINGS.ALERT} type="warning" />
      <div className={styles[`${PREFIX}-progress-bar`]}>
        <h2 className={styles[`${PREFIX}-progress-bar-title`]}>{STRINGS.OVERVIEW_TITLE}</h2>
        {activeTaskId ? (
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
            {groupTasks.map((item) => (
              <div
                key={item.taskId}
                role="button"
                onClick={() => setActiveTaskId(String(item.taskId))}
                data-task-id={item.taskId}
                className={[
                  styles[`${PREFIX}-order-card`],
                  styles[
                    item.status === TaskStatus.SUCCESS
                      ? `${PREFIX}-order-card-success`
                      : item.status === TaskStatus.FAILED
                        ? `${PREFIX}-order-card-error`
                        : item.status === TaskStatus.TERMINATED
                          ? `${PREFIX}-order-card-error`
                          : `${PREFIX}-order-card-pending`
                  ],
                  activeTaskId === String(item.taskId) ? styles[`${PREFIX}-order-card-selected`] : '',
                ].join(' ')}
              >
                <div className={styles[`${PREFIX}-order-card-title`]}>
                  {item.status === TaskStatus.SUCCESS && (
                    <CheckCircleO className={styles[`${PREFIX}-status-icon-success`]} />
                  )}
                  {item.status === TaskStatus.FAILED && (
                    <CloseCircleO className={styles[`${PREFIX}-status-icon-error`]} />
                  )}
                  {item.status === TaskStatus.TERMINATED && (
                    <StopCircleO className={styles[`${PREFIX}-status-icon-error`]} />
                  )}
                  {item.status === TaskStatus.PENDING && <LoadingO />}
                  {item.status === TaskStatus.RUNNING && <LoadingO />}
                  {item.status === TaskStatus.TERMINATED && (
                    <StopCircleO className={styles[`${PREFIX}-status-icon-terminated`]} />
                  )}
                  <Tooltip title={item.taskName} placement="top">
                    <span>
                      {item.taskName} - {getAreaNameByCode(item.areaCode)}
                    </span>
                  </Tooltip>
                </div>
                {item.status === TaskStatus.PENDING ? (
                  <>
                    <Divider className={styles[`${PREFIX}-order-card-divider`]} />
                    <div className={styles[`${PREFIX}-order-card-progress`]}>
                      {typeof item.progress === 'number' && item.progress > 0 ? (
                        <CountUp start={Number(item.progress)} end={Number(item.progress)} separator="," suffix="%" />
                      ) : (
                        STRINGS.QUEUING
                      )}
                    </div>
                  </>
                ) : null}
                {item.status === TaskStatus.RUNNING ? (
                  <>
                    <Divider className={styles[`${PREFIX}-order-card-divider`]} />
                    <div className={styles[`${PREFIX}-order-card-progress`]}>
                      {typeof item.progress === 'number' && item.progress > 0 ? (
                        <CountUp start={Number(item.progress)} end={Number(item.progress)} separator="," suffix="%" />
                      ) : (
                        STRINGS.RUNNING
                      )}
                    </div>
                  </>
                ) : null}
                {item.status === TaskStatus.SUCCESS ? (
                  <>
                    <Divider className={styles[`${PREFIX}-order-card-divider`]} />
                    <Button size="small" type="text">
                      {STRINGS.VIEW_DETAIL}
                    </Button>
                  </>
                ) : null}
                {item.status === TaskStatus.TERMINATED ? (
                  <>
                    <Divider className={styles[`${PREFIX}-order-card-divider`]} />
                    <Button size="small" type="text">
                      {STRINGS.RETRY_ALL}
                    </Button>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className={styles[`${PREFIX}-content`]}>
        {activeTaskId ? (
          <>
            <div className={styles[`${PREFIX}-card-title`]}>{STRINGS.LOG}</div>
            <Progress percent={selectedProgress} className={styles[`${PREFIX}-progress`]} />
            <div
              className={`${styles[`${PREFIX}-card`]} ${styles[`${PREFIX}-log-card`]}`}
              ref={logListRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-atomic="false"
              tabIndex={0}
            >
              <div className={styles[`${PREFIX}-card-list`]}>
                {displayedLogs.map((item) => (
                  <div
                    key={item.id}
                    className={styles[`${PREFIX}-card-list-item`]}
                    style={{ animationDelay: `${Math.min(item.id, 12) * 60}ms` }}
                  >
                    {item.description}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className={styles[`${PREFIX}-content-skeleton`]}>
            <Skeleton animation></Skeleton>
          </div>
        )}
      </div>
    </div>
  )
}
