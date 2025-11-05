import React, { useEffect, useState, useRef } from 'react'
import { Progress } from '@wind/wind-ui'
import { useInterval } from 'ahooks'
import styles from './styles.module.less'

export enum FileStatus {
  PENDING = 1,
  RUNNING = 2,
  SUCCESS = 3,
  FAILED = 4,
}

interface SmartProgressProps {
  status: FileStatus
  className?: string
  style?: React.CSSProperties
}

const SmartProgress: React.FC<SmartProgressProps> = ({ status, className, style }) => {
  const [percent, setPercent] = useState(0)
  const [displayStatus, setDisplayStatus] = useState<FileStatus>(status)
  const prevStatusRef = useRef<FileStatus>(status)
  const animationDone = useRef<boolean>(false)

  // 贝塞尔曲线动画函数
  const bezierEasing = (t: number): number => {
    // 使用贝塞尔曲线函数，先快后慢
    const p1 = 0.25
    const p2 = 0.1
    const p3 = 0.25
    const p4 = 1
    return cubic(p1, p2, p3, p4, t)
  }

  // 三次贝塞尔曲线计算函数
  const cubic = (p1: number, p2: number, p3: number, p4: number, t: number): number => {
    const term1 = Math.pow(1 - t, 3) * p1
    const term2 = 3 * Math.pow(1 - t, 2) * t * p2
    const term3 = 3 * (1 - t) * Math.pow(t, 2) * p3
    const term4 = Math.pow(t, 3) * p4
    return term1 + term2 + term3 + term4
  }

  // 动画定时器
  const [delay, setDelay] = useState<number | undefined>(undefined)
  const step = useRef<number>(0)

  useInterval(() => {
    if (displayStatus === FileStatus.PENDING || displayStatus === FileStatus.RUNNING) {
      // 先快后慢，模拟贝塞尔曲线，最高到90%
      step.current += 1
      const t = Math.min(step.current / 100, 1)
      const currentPercent = bezierEasing(t) * 90
      setPercent(currentPercent)
    } else if (displayStatus === FileStatus.SUCCESS && !animationDone.current) {
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

  useEffect(() => {
    // 初始状态设置
    if (status === FileStatus.PENDING || status === FileStatus.RUNNING) {
      setDelay(50) // 启动动画
      step.current = 0
      animationDone.current = false
    } else if (status === FileStatus.FAILED) {
      setDelay(undefined) // 停止动画
      setDisplayStatus(FileStatus.FAILED)
      animationDone.current = true
    } else if (status === FileStatus.SUCCESS) {
      // 如果之前是正在进行中的状态，则需要动画过渡
      if (prevStatusRef.current === FileStatus.PENDING || prevStatusRef.current === FileStatus.RUNNING) {
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
      setDisplayStatus(FileStatus.SUCCESS)
    }

    prevStatusRef.current = status
  }, [status])

  const renderText = () => {
    if (displayStatus === FileStatus.SUCCESS && percent === 100) {
      return <div className={styles.successText}>生成成功</div>
    }
    if (displayStatus === FileStatus.FAILED) {
      return <div className={styles.failedText}>生成失败</div>
    }
    return null
  }

  return (
    <div className={`${styles.smartProgress} ${className || ''}`} style={style}>
      {(displayStatus === FileStatus.PENDING || displayStatus === FileStatus.RUNNING || !animationDone.current) && (
        <Progress percent={percent} showInfo={false} />
      )}
      {renderText()}
    </div>
  )
}

export default SmartProgress
