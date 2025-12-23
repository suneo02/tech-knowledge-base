import React, { createContext, useContext, useState, ReactNode, useRef, useCallback } from 'react'
import { uploadAiGraphThumbnail } from '@/api/ai-graph'
import { useAIChartsStore } from '../store'

/**
 * @description AI图谱上下文状态接口
 */
interface AIGraphContextState {
  companyCode: string
  companyName: string
}

/**
 * @description AI图谱上下文方法接口
 */
interface AIGraphContextMethods {
  setCompanyCode: (code: string) => void
  setCompanyName: (name: string) => void
  onChartThumbnailsChange: (img: string, messageId?: string, chatId?: string, version?: number) => void
  setUpdateMessageThumbnail: (
    callback: ((messageId: string, thumbnail: string, chatId: string, version: number) => void) | null
  ) => void
}

/**
 * @description AI图谱上下文接口
 */
interface AIGraphContextType extends AIGraphContextState, AIGraphContextMethods {}

/**
 * @description AI图谱上下文默认值
 */
const defaultContextValue: AIGraphContextType = {
  companyCode: '',
  companyName: '',
  setCompanyCode: () => {},
  setCompanyName: () => {},
  onChartThumbnailsChange: () => {},
  setUpdateMessageThumbnail: () => {},
}

/**
 * @description AI图谱上下文
 */
const AIGraphContext = createContext<AIGraphContextType>(defaultContextValue)

/**
 * @description AI图谱Provider属性接口
 */
interface AIGraphProviderProps {
  children: ReactNode
  initialCompanyCode?: string
  initialCompanyName?: string
}

/**
 * @description AI图谱Provider组件
 * @author bcheng<bcheng@wind.com.cn>
 */
export const AIGraphProvider: React.FC<AIGraphProviderProps> = ({
  children,
  initialCompanyCode = '',
  initialCompanyName = '',
}) => {
  const [companyCode, setCompanyCode] = useState(initialCompanyCode)
  const [companyName, setCompanyName] = useState(initialCompanyName)
  const { chatMessageList, setChatMessageList } = useAIChartsStore()

  // 添加一个回调函数来更新消息缩略图
  const [updateMessageThumbnail, setUpdateMessageThumbnail] = useState<
    ((messageId: string, thumbnail: string, chatId: string, version: number) => void) | null
  >(null)

  // 使用 useRef 来存储最新的 updateMessageThumbnail 回调，避免闭包问题
  const updateMessageThumbnailRef = useRef<
    ((messageId: string, thumbnail: string, chatId: string, version: number) => void) | null
  >(null)

  // 使用 useCallback 稳定 setUpdateMessageThumbnail 的引用
  const stableSetUpdateMessageThumbnail = useCallback(
    (callback: ((messageId: string, thumbnail: string, chatId: string, version: number) => void) | null) => {
      updateMessageThumbnailRef.current = callback // 同时更新 ref
      setUpdateMessageThumbnail(callback)
    },
    []
  )
  // 使用 useCallback 确保 onChartThumbnailsChange 能够访问到最新的 updateMessageThumbnail 值
  const onChartThumbnailsChange = useCallback(
    (img: string, messageId?: string, chatId?: string, version?: number) => {
      // 使用 ref 中的最新值，避免闭包问题
      const currentUpdateMessageThumbnail = updateMessageThumbnailRef?.current
      // 如果有消息ID和更新函数，则更新对应消息的缩略图
      if (messageId && currentUpdateMessageThumbnail) {
        currentUpdateMessageThumbnail(messageId, img, chatId, version)
        uploadAiGraphThumbnail({ chatId, thumbnail: img, version }) // 上传缩略图

        chatMessageList?.length &&
          setChatMessageList(
            chatMessageList.map((item) => (item.role === messageId ? { ...item, thumbnail: img } : item))
          )
      }
    },
    [chatMessageList]
  )

  const value = {
    companyCode,
    companyName,
    setCompanyCode,
    setCompanyName,
    onChartThumbnailsChange,
    setUpdateMessageThumbnail: stableSetUpdateMessageThumbnail, // 使用稳定的引用
  }

  return <AIGraphContext.Provider value={value}>{children}</AIGraphContext.Provider>
}

/**
 * @description 使用AI图谱上下文的Hook
 */
export const useAIGraph = () => {
  const context = useContext(AIGraphContext)
  if (!context) {
    throw new Error('useAIGraph must be used within an AIGraphProvider')
  }
  return context
}

interface AIChartContextType {
  chatMessageIdRef: React.MutableRefObject<number>
  abortControllerRef: React.MutableRefObject<any>
}

const AIChartContext = createContext<AIChartContextType | null>(null)

export const AIChartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const chatMessageIdRef = useRef(0)
  const abortControllerRef = useRef(null)

  return (
    <AIChartContext.Provider
      value={{
        chatMessageIdRef,
        abortControllerRef,
      }}
    >
      {children}
    </AIChartContext.Provider>
  )
}

export const useAIChartContext = () => {
  const context = useContext(AIChartContext)
  if (!context) {
    throw new Error('useAIChartContext must be used within an AIChartProvider')
  }
  return context
}
