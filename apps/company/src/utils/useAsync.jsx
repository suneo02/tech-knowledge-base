import { useCallback, useEffect, useState } from 'react'

/**
 * @deprecated
 * 移步 ts 版
 * 创建一个自定义 Hook，用于处理异步函数的状态。
 * @param {Function} asyncFunction - 需要执行的异步函数。
 * @param {boolean} [immediate=false] - 是否在组件挂载后立即执行异步函数。
 * @returns {Array} 返回一个数组，包含执行函数、数据、加载状态和错误信息。
 * @returns {Function} 返回的执行函数，可以调用异步函数并处理其结果。
 * @returns {any} 返回异步函数执行成功后的结果数据。
 * @returns {boolean} 返回异步函数的加载状态。
 * @returns {boolean} 是否 fetch 过，用来避免第一次的不必要监听
 * @returns {Error} 返回异步函数执行过程中的错误信息。
 *
 */
export function useAsync(asyncFunction, immediate = false) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [hasFetched, setHasFetched] = useState(false)

  // 用于触发异步请求
  const execute = useCallback(async (...args) => {
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
  }, [])

  // 是否在挂载时立即执行
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return [execute, result, loading, hasFetched, error]
}
