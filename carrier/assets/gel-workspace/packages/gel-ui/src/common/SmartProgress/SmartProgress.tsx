import { CloseCircleO } from '@wind/icons'
import { Progress } from '@wind/wind-ui'
import { useInterval } from 'ahooks'
import { t } from 'gel-util/intl'
import React, { useEffect, useRef, useState } from 'react'
import styles from './styles.module.less'

export enum SmartProgressStatus {
  PENDING = 1,
  RUNNING = 2,
  SUCCESS = 3,
  FAILED = 4,
}

interface SmartProgressProps {
  status: SmartProgressStatus
  className?: string
  style?: React.CSSProperties
}

const STRINGS = {
  SUCCESS: t('425472', '生成成功'),
  FAILED: t('286684', '生成失败'),
}

export const SmartProgress: React.FC<SmartProgressProps> = ({ status, className, style }) => {
  // 进度条状态
  const [percent, setPercent] = useState(0)
  const [displayStatus, setDisplayStatus] = useState<SmartProgressStatus>(status)
  const prevStatusRef = useRef<SmartProgressStatus>(status)
  const animationDone = useRef<boolean>(false)
  const hasStartedAnimation = useRef<boolean>(false)
  const isInitialized = useRef<boolean>(false)

  // 动画定时器
  const [delay, setDelay] = useState<number | undefined>(undefined)

  // 匀速递增进度条
  useInterval(() => {
    if (displayStatus === SmartProgressStatus.PENDING || displayStatus === SmartProgressStatus.RUNNING) {
      // 匀速递增，最高到90%
      // 3秒内匀速递增到90%，每50ms增加约1.5个百分点
      setPercent((prevPercent) => {
        const nextPercent = prevPercent + 1.5
        return nextPercent > 90 ? 90 : nextPercent
      })
    } else if (displayStatus === SmartProgressStatus.SUCCESS && !animationDone.current) {
      // 成功状态时，快速达到100%
      setPercent((prev) => {
        const nextPercent = prev + (100 - prev) / 3
        if (nextPercent >= 99.5) {
          setDelay(undefined)
          animationDone.current = true
          return 100
        }
        return nextPercent
      })
    }
  }, delay)

  // 组件初始化时确保从0开始
  useEffect(() => {
    if (!isInitialized.current) {
      setPercent(0)
      isInitialized.current = true

      if (status === SmartProgressStatus.PENDING || status === SmartProgressStatus.RUNNING) {
        hasStartedAnimation.current = true
        setDelay(50)
      } else if (status === SmartProgressStatus.SUCCESS || status === SmartProgressStatus.FAILED) {
        setPercent(100)
        animationDone.current = true
      }
    }
  }, [])

  useEffect(() => {
    // 初始状态设置
    if (status === SmartProgressStatus.PENDING || status === SmartProgressStatus.RUNNING) {
      // 只在首次启动动画，或者从成功/失败状态重新开始时重置
      if (
        !hasStartedAnimation.current ||
        prevStatusRef.current === SmartProgressStatus.SUCCESS ||
        prevStatusRef.current === SmartProgressStatus.FAILED
      ) {
        setDelay(50) // 启动动画
        setPercent(0) // 确保从0开始
        animationDone.current = false
        hasStartedAnimation.current = true
      }

      // PENDING 和 RUNNING 状态的处理逻辑相同
      setDisplayStatus(status)
    } else if (status === SmartProgressStatus.FAILED) {
      setDelay(undefined) // 停止动画
      setDisplayStatus(SmartProgressStatus.FAILED)
      animationDone.current = true
    } else if (status === SmartProgressStatus.SUCCESS) {
      // 如果之前是正在进行中的状态，则需要动画过渡
      if (
        prevStatusRef.current === SmartProgressStatus.PENDING ||
        prevStatusRef.current === SmartProgressStatus.RUNNING
      ) {
        setDelay(20) // 加速动画到100%
        // 300ms后完成动画
        setTimeout(() => {
          animationDone.current = true
          setDelay(undefined)
          setPercent(100)
        }, 300)
      } else {
        // 直接设置为成功状态
        setPercent(100)
        animationDone.current = true
      }
      setDisplayStatus(SmartProgressStatus.SUCCESS)
    }

    prevStatusRef.current = status
  }, [status])

  const renderText = () => {
    if (displayStatus === SmartProgressStatus.SUCCESS && percent === 100) {
      return <div className={styles.successText}>{STRINGS.SUCCESS}</div>
    }
    if (displayStatus === SmartProgressStatus.FAILED) {
      return (
        <div className={styles.failedText}>
          {/* @ts-expect-error wind-icon */}
          <CloseCircleO style={{ marginRight: 4, color: 'var(--red-6)' }} /> {STRINGS.FAILED}
        </div>
      )
    }
    return null
  }

  return (
    <div className={`${styles.smartProgress} ${className || ''}`} style={style}>
      {(displayStatus === SmartProgressStatus.PENDING ||
        displayStatus === SmartProgressStatus.RUNNING ||
        !animationDone.current) && <Progress percent={percent} showInfo={false} />}
      {renderText()}
    </div>
  )
}
