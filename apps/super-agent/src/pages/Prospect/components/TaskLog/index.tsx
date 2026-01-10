import { Progress } from '@wind/wind-ui'
import { TaskStatus } from 'gel-api'
import React, { useEffect, useRef } from 'react'
import { PREFIX } from '../../constants'
import styles from './index.module.less'

interface TaskLogProps {
  logs: Array<{ id: number; description: string }>
  progress: number
  title: string
  status?: TaskStatus
  isError?: boolean
  isSuccess?: boolean
}

export const TaskLog: React.FC<TaskLogProps> = ({ logs, progress, title, isError, isSuccess }) => {
  const logListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 日志变更时滚动到底部
    const el = logListRef.current
    if (el) {
      setTimeout(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
      }, 100)
    }
  }, [logs.length])

  return (
    <>
      <h3 className={styles[`${PREFIX}-card-title`]}>{title}</h3>

      <Progress
        percent={isError ? 100 : progress}
        className={styles[`${PREFIX}-progress`]}
        status={isError ? 'error' : isSuccess ? 'success' : 'active'}
      />

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
          {logs.map((item) => (
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
  )
}
