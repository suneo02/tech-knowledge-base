import { getWsid } from '@/utils/env'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 支持 SSE POST 请求的 React Hook
 *
 * @param {string} url - SSE 服务端地址
 * @param {Object} options - 配置项
 * @param {Object} [options.headers] - 自定义请求头
 * @param {Object} [options.body] - POST 请求体数据
 * @param {boolean} [options.withCredentials] - 是否发送凭据
 * @param {function} [options.onMessage] - 消息接收回调
 * @param {function} [options.onError] - 错误处理回调
 * @param {function} [options.onOpen] - 连接成功回调
 * @param {function} [options.onClose] - 连接关闭回调
 * @param {number} [options.reconnectInterval] - 重连间隔(毫秒)
 * @param {number} [options.maxReconnectAttempts] - 最大重连次数
 *
 * @returns {Object} - 返回连接状态和控制方法
 */
export const useSSE = (url, options: any = {}) => {
  const {
    headers = {},
    withCredentials = false,
    onMessage = () => {},
    onError = () => {},
    onOpen = () => {},
    onClose = () => {},
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options

  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const eventSourceRef = useRef(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimerRef = useRef(null)

  // 清理函数
  const cleanUp = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
    setConnectionStatus('disconnected')
    onClose()
  }, [onClose])

  // 创建 SSE 连接
  const connect = useCallback(
    (body: any) => {
      // 清理现有连接
      cleanUp()

      try {
        // 因为 EventSource 原生不支持 POST，所以使用 fetch API
        // 但为了支持服务端事件流，我们需要使用自定义的事件源处理
        setConnectionStatus('connecting')

        // 使用 fetch API 创建 SSE 连接
        const fetchSSE = async () => {
          const sessionid = getWsid()
          try {
            const response = await fetch(url, {
              method: body ? 'POST' : 'GET',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'text/event-stream',
                'wind.sessionid': sessionid,
                ...headers,
              },
              body: body ? JSON.stringify(body) : undefined,
            })
            if (!response.ok || !response.body) {
              throw new Error(`Failed to connect to SSE endpoint: ${response.status}`)
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''
            // 创建自定义的事件源对象
            eventSourceRef.current = {
              close: async () => {
                await reader.cancel()
                setConnectionStatus('disconnected')
                onClose()
              },
              dispatchEvent: (event, data) => {
                onMessage({ type: event, data })
              },
            }

            setConnectionStatus('connected')
            onOpen()

            // 处理流数据
            while (true) {
              const res = await reader.read()

              const { value, done } = res
              if (done) break

              // 专门处理 undefined 值
              if (value === undefined) {
                continue
              }

              buffer += decoder.decode(value, { stream: true })

              // 处理 SSE 事件流格式
              const parts = buffer.split('\n\n')
              buffer = parts.pop() || ''

              for (const part of parts) {
                let event = 'message'
                let data = ''
                let id = ''

                // 解析 SSE 事件流
                const lines = part.split('\n')
                for (const line of lines) {
                  if (line.startsWith('event:')) {
                    event = line.substring(6).trim()
                  } else if (line.startsWith('data:')) {
                    data = line.substring(5).trim()
                  } else if (line.startsWith('id:')) {
                    id = line.substring(3).trim()
                  } else if (line.startsWith('retry:')) {
                    // 可以处理重连时间
                  }
                }

                // 处理解析后的数据
                if (data) {
                  try {
                    // 尝试解析为 JSON
                    const parsedData = JSON.parse(data)
                    onMessage({ type: event, data: parsedData, id })
                  } catch (e) {
                    // 非 JSON 数据直接返回
                    onMessage({ type: event, data, id })
                  }
                }
              }
            }

            // 流结束后的清理
            cleanUp()
          } catch (error) {
            handleConnectionError(error, body)
          }
        }

        fetchSSE()
      } catch (error) {
        handleConnectionError(error, body)
      }
    },
    [url, headers, withCredentials, onMessage, onOpen, cleanUp]
  )

  // 处理连接错误
  const handleConnectionError = useCallback(
    (error, body) => {
      console.error('SSE connection error:', error)
      setConnectionStatus('error')
      onError(error)

      // 自动重连逻辑
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1
        reconnectTimerRef.current = setTimeout(() => {
          console.log(`Attempting reconnect (#${reconnectAttemptsRef.current})...`)
          connect(body)
        }, reconnectInterval)
      } else {
        console.error('Max reconnect attempts reached')
        cleanUp()
      }
    },
    [reconnectInterval, maxReconnectAttempts, connect, cleanUp, onError]
  )

  // 手动关闭连接
  const closeConnection = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }
    cleanUp()
  }, [cleanUp])

  // 手动重新连接
  const reconnect = useCallback(
    (body: any) => {
      reconnectAttemptsRef.current = 0
      connect(body)
    },
    [connect]
  )

  // 初始化连接
  useEffect(() => {
    // 组件卸载时清理
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  return {
    connectionStatus,
    reconnect,
    connect,
    close: closeConnection,
  }
}
