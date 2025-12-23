import { useCallback, useState } from 'react'

/**
 * 创建一个自定义 Hook，用于处理异步函数的状态。
 * @param asyncFunction 需要执行的异步函数。
 * @returns 返回一个数组，包含执行函数、数据、加载状态和错误信息：
 * - 执行函数：可以调用异步函数并处理其结果；
 * - 数据：异步函数执行成功后的结果数据；
 * - 加载状态：当前是否正在加载中；
 * - 是否 fetch 过，用来避免第一次的不必要监听；
 * - 错误信息：在异步函数执行过程中出现的错误信息。
 */
export function useAsync<T extends any[], R = undefined>(
  asyncFunction: (...args: T) => Promise<R> | null
): [
  execute: (...args: T) => Promise<void>,
  result: R | null,
  loading: boolean,
  hasFetched: boolean,
  error?: Error | null,
] {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [result, setResult] = useState<R | null>(null)
  const [hasFetched, setHasFetched] = useState(false)

  // useCallback 缓存 execute 函数实例
  // 可以避免每次重新渲染时都创建新的实例导致无法正确地更新 state 的问题
  const execute = useCallback(
    async (...args: T) => {
      if (!asyncFunction) {
        return
      }
      setHasFetched(true)
      setLoading(true)
      setError(null)

      try {
        const result = await asyncFunction(...args)
        setResult(result)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    },
    [asyncFunction]
  )

  return [execute, result, loading, hasFetched, error]
}
