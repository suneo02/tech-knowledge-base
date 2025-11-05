import { useCallback, useEffect, useState } from 'react'

/**
 * useUrlState 的配置选项
 */
export interface UseUrlStateOptions {
  /** 导航模式：push 或 replace */
  navigateMode?: 'push' | 'replace'
  /** URL 参数名，如果不指定则使用 stateKey 作为参数名 */
  paramName?: string
  /** 状态标识符，用于自动生成参数名 */
  stateKey?: string
}

/**
 * 自定义 useUrlState Hook
 *
 * 仿照 @ahooksjs/use-url-state 的功能，支持字符串类型的 URL 状态管理。
 * 将状态同步到 URL 查询参数中，支持浏览器前进/后退操作。
 * 默认情况下，state 的名称和 URL 中的参数名称会自动同步。
 *
 * @template T - 状态值的类型，必须继承自 string
 * @param {T | (() => T)} [initialState] - 初始状态值或返回初始状态的函数
 * @param {UseUrlStateOptions} [options] - 配置选项
 * @param {('push' | 'replace')} [options.navigateMode='push'] - 导航模式，push 会添加新的历史记录，replace 会替换当前历史记录
 * @param {string} [options.paramName] - URL 查询参数的名称，优先级最高
 * @param {string} [options.stateKey] - 状态标识符，用于自动生成参数名
 *
 * @returns {[T, (value: T | ((prev: T) => T)) => void]} 返回一个元组，包含：
 *   - 当前状态值
 *   - 设置状态的函数，支持直接设置值或基于前一个值的函数
 *
 * @example
 * ```typescript
 * // 基本使用 - 使用 stateKey 作为参数名
 * const [roomId, setRoomId] = useUrlState<string>('default-room-id', { stateKey: 'roomId' })
 * // URL: ?roomId=default-room-id
 *
 * // 自定义参数名
 * const [roomId, setRoomId] = useUrlState<string>('default-room-id', {
 *   paramName: 'chatRoom'
 * })
 * // URL: ?chatRoom=default-room-id
 *
 * // 使用 replace 模式
 * const [roomId, setRoomId] = useUrlState<string>('default-room-id', {
 *   navigateMode: 'replace',
 *   stateKey: 'roomId'
 * })
 *
 * // 使用函数初始化
 * const [roomId, setRoomId] = useUrlState<string>(() => `room-${Date.now()}`, { stateKey: 'roomId' })
 *
 * // 设置状态
 * setRoomId('new-room-id')
 *
 * // 基于前一个值设置状态
 * setRoomId(prev => `${prev}-updated`)
 * ```
 *
 * @since 1.0.0
 * @author AI Assistant
 */
export const useUrlState = <T extends string>(
  initialState?: T | (() => T),
  options: UseUrlStateOptions = {}
): [T, (value: T | ((prev: T) => T)) => void] => {
  const { navigateMode = 'push', paramName, stateKey } = options

  /**
   * 获取参数名
   * 优先级：paramName > stateKey > 'state'
   * @returns {string} 最终使用的参数名
   */
  const getParamName = useCallback((): string => {
    if (paramName) {
      return paramName
    }
    if (stateKey) {
      return stateKey
    }
    return 'state'
  }, [paramName, stateKey])

  /**
   * 从 URL 中解析初始值
   * @returns {T} 解析后的初始值
   */
  const getInitialValue = useCallback((): T => {
    if (typeof initialState === 'function') {
      return (initialState as () => T)()
    }
    return (initialState as T) || ('' as T)
  }, [initialState])

  /**
   * 从 URL 查询参数中获取当前值
   * @returns {T} 从 URL 中解析出的值，如果不存在则返回初始值
   */
  const getValueFromUrl = useCallback((): T => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const currentParamName = getParamName()
      const urlValue = urlParams.get(currentParamName)
      return (urlValue as T) || getInitialValue()
    } catch (error) {
      console.warn('Failed to parse URL state:', error)
      return getInitialValue()
    }
  }, [getParamName, getInitialValue])

  // 状态管理
  const [state, setState] = useState<T>(getValueFromUrl)

  /**
   * 更新 URL 的函数
   * @param {T} newValue - 新的状态值
   */
  const updateUrl = useCallback(
    (newValue: T) => {
      try {
        const url = new URL(window.location.href)
        const urlParams = new URLSearchParams(url.search)
        const currentParamName = getParamName()

        if (newValue) {
          urlParams.set(currentParamName, newValue)
        } else {
          urlParams.delete(currentParamName)
        }

        url.search = urlParams.toString()

        if (navigateMode === 'replace') {
          window.history.replaceState(null, '', url.toString())
        } else {
          window.history.pushState(null, '', url.toString())
        }
      } catch (error) {
        console.warn('Failed to update URL state:', error)
      }
    },
    [navigateMode, getParamName]
  )

  /**
   * 设置状态的函数
   * @param {T | ((prev: T) => T)} value - 新的状态值或基于前一个值的函数
   */
  const setUrlState = useCallback(
    (value: T | ((prev: T) => T)) => {
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(state) : value
      setState(newValue)
      updateUrl(newValue)
    },
    [state, updateUrl]
  )

  // 监听 URL 变化（浏览器前进/后退）
  useEffect(() => {
    const handlePopState = () => {
      const urlValue = getValueFromUrl()
      if (urlValue !== state) {
        setState(urlValue)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [getValueFromUrl, state])

  // 初始化时同步 URL 状态
  useEffect(() => {
    const urlValue = getValueFromUrl()
    if (urlValue !== state) {
      setState(urlValue)
    }
  }, [getValueFromUrl, state])

  return [state, setUrlState]
}

export default useUrlState
