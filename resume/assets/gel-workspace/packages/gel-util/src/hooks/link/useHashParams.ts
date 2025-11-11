import { useCallback, useEffect, useState } from 'react'

/**
 * 用于管理 URL hash 参数的 Hook
 * @param paramName 参数名称
 * @param defaultValue 默认值
 * @returns [参数值, 设置参数值的函数]
 */
export const useHashParams = <T extends string>(paramName: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      // 获取完整的 hash 部分
      const hash = window.location.hash
      // 找到最后一个 ? 的位置
      const lastQuestionMarkIndex = hash.lastIndexOf('?')
      if (lastQuestionMarkIndex === -1) return defaultValue

      // 提取查询参数部分
      const queryString = hash.slice(lastQuestionMarkIndex + 1)
      const params = new URLSearchParams(queryString)
      return (params.get(paramName) as T) || defaultValue
    } catch {
      return defaultValue
    }
  })

  const updateHash = useCallback(
    (newValue: T) => {
      try {
        const hash = window.location.hash
        const lastQuestionMarkIndex = hash.lastIndexOf('?')

        if (lastQuestionMarkIndex === -1) {
          // 如果没有查询参数，直接添加
          window.location.hash = `${hash}?${paramName}=${newValue}`
        } else {
          // 更新现有参数
          const basePath = hash.slice(0, lastQuestionMarkIndex)
          const queryString = hash.slice(lastQuestionMarkIndex + 1)
          const params = new URLSearchParams(queryString)
          params.set(paramName, newValue)
          window.location.hash = `${basePath}?${params.toString()}`
        }
        setValue(newValue)
      } catch (e) {
        console.error('Failed to update hash:', e)
      }
    },
    [paramName]
  )

  // 初始化时设置默认值
  useEffect(() => {
    try {
      const hash = window.location.hash
      const lastQuestionMarkIndex = hash.lastIndexOf('?')
      if (lastQuestionMarkIndex === -1 || !hash.slice(lastQuestionMarkIndex + 1).includes(paramName)) {
        updateHash(defaultValue)
      }
    } catch (e) {
      console.error('Failed to check hash:', e)
    }
  }, [defaultValue, paramName, updateHash])

  // 监听 hash 变化
  useEffect(() => {
    const handleHashChange = () => {
      try {
        const hash = window.location.hash
        const lastQuestionMarkIndex = hash.lastIndexOf('?')
        if (lastQuestionMarkIndex === -1) return

        const queryString = hash.slice(lastQuestionMarkIndex + 1)
        const params = new URLSearchParams(queryString)
        const newValue = params.get(paramName) as T
        if (newValue) {
          setValue(newValue)
        }
      } catch (e) {
        console.error('Failed to handle hash change:', e)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [paramName])

  return [value, updateHash] as const
}
