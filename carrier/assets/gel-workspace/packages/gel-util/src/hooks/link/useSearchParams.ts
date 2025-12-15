import { useCallback, useEffect, useState } from 'react'

/**
 * 用于管理 URL 查询参数的 Hook
 * @param paramName 参数名称
 * @param defaultValue 默认值
 * @returns [参数值, 设置参数值的函数]
 */
export const useSearchParams = <T extends string>(paramName: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      return (params.get(paramName) as T) || defaultValue
    } catch {
      return defaultValue
    }
  })

  const updateSearchParams = useCallback(
    (newValue: T) => {
      try {
        const params = new URLSearchParams(window.location.search)
        params.set(paramName, newValue)

        const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`
        window.history.pushState({}, '', newUrl)
        setValue(newValue)
      } catch (error) {
        console.error('Failed to update search params:', error)
      }
    },
    [paramName]
  )

  // 初始化时设置默认值
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if (!params.has(paramName)) {
        updateSearchParams(defaultValue)
      }
    } catch (error) {
      console.error('Failed to check search params:', error)
    }
  }, [defaultValue, paramName, updateSearchParams])

  // 监听 popstate 事件（浏览器前进后退）
  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const newValue = params.get(paramName) as T
        if (newValue) {
          setValue(newValue)
        } else {
          setValue(defaultValue)
        }
      } catch (error) {
        console.error('Failed to handle popstate:', error)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [paramName, defaultValue])

  return [value, updateSearchParams] as const
}
