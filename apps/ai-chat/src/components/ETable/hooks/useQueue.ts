import { useState, useEffect, useCallback, useRef } from 'react'
import { isCanceledError } from 'gel-ui'

/**
 * 异步任务处理器
 * @param item - 队列中的单个任务项
 * @param signal - AbortSignal，用于中止任务
 * @returns - 返回一个 Promise，该 Promise resolve 时为任务结果
 */
type Processor<T, R> = (item: T, signal: AbortSignal) => Promise<R>

interface UseQueueOptions<T, R> {
  processor: Processor<T, R>
  maxConcurrency?: number
}

interface Result<R> {
  status: QueueStatus
  value?: R
  reason?: unknown
}

export enum QueueStatus {
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}

export const useQueue = <T, R>({ processor, maxConcurrency = 3 }: UseQueueOptions<T, R>) => {
  const [queue, setQueue] = useState<T[]>([])
  const [running, setRunning] = useState<Map<T, AbortController>>(new Map())
  const [results, setResults] = useState<Map<T, Result<R>>>(new Map())

  const processorRef = useRef(processor)
  processorRef.current = processor

  const runningRef = useRef(running)
  runningRef.current = running

  const add = useCallback((item: T) => {
    setQueue((prev) => [...prev, item])
  }, [])

  const clear = useCallback(() => {
    runningRef.current.forEach((controller) => controller.abort())
    setQueue([])
    setRunning(new Map())
    setResults(new Map())
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clear()
    }
  }, [clear])

  useEffect(() => {
    if (running.size >= maxConcurrency || queue.length === 0) {
      return
    }

    const [itemToProcess, ...remainingQueue] = queue
    setQueue(remainingQueue)

    const controller = new AbortController()
    setRunning((prev) => new Map(prev).set(itemToProcess, controller))

    processorRef
      .current(itemToProcess, controller.signal)
      .then((value) => {
        setResults((prev) => new Map(prev).set(itemToProcess, { status: QueueStatus.FULFILLED, value }))
      })
      .catch((reason) => {
        if (!isCanceledError(reason)) {
          setResults((prev) => new Map(prev).set(itemToProcess, { status: QueueStatus.REJECTED, reason }))
        }
      })
      .finally(() => {
        setRunning((prev) => {
          const newRunning = new Map(prev)
          newRunning.delete(itemToProcess)
          return newRunning
        })
      })
  }, [queue, running, maxConcurrency])

  const isLoading = queue.length > 0 || running.size > 0

  return {
    add,
    clear,
    isLoading,
    queue,
    running: Array.from(running.keys()),
    results,
  }
}

export default useQueue
