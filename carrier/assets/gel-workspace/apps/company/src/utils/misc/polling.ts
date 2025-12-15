import { useEffect, useState } from 'react'

/**
 * 通用的轮询 Hook
 * @param callback 轮询每次执行的函数
 * @param interval 轮询间隔时间（默认为 3000 毫秒）
 * @param onComplete 轮询结束时的回调函数
 */
export const usePolling = (callback: () => Promise<void>, interval: number = 3000, onComplete?: () => void) => {
  const [isPolling, setIsPolling] = useState(false)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)

  const startPolling = () => {
    if (pollingInterval) return // 防止重复启动

    setIsPolling(true)
    const intervalId = setInterval(async () => {
      try {
        await callback()
      } catch (e) {
        console.error(e)
      }
    }, interval)
    setPollingInterval(intervalId)
  }

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      setPollingInterval(null)
    }
    setIsPolling(false)
    if (onComplete) {
      onComplete() // 调用 onComplete 回调
    }
  }

  useEffect(() => {
    return () => stopPolling() // 组件卸载时清理
  }, [pollingInterval])

  return {
    startPolling,
    stopPolling,
    isPolling,
  }
}
