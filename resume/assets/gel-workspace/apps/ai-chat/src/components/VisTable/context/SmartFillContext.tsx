import React, { createContext, useContext, useState, ReactNode } from 'react'
import { AiModelEnum } from 'gel-api'

// SmartFill模板缓存的类型
interface SmartFillTemplate {
  prompt: string
  options: {
    tools?: Record<string, Record<string, never>>
    runType?: string
    aiModel?: AiModelEnum
  }
}

// SmartFill上下文类型
interface SmartFillContextType {
  // 是否打开模态框
  isModalOpen: boolean
  // 当前选中的列ID
  selectedColumnId: string | null
  // 打开模态框方法
  openSmartFillModal: (columnId?: string, clearPrevious?: boolean) => void
  // 关闭模态框方法
  closeSmartFillModal: () => void
  // 保存模板方法
  saveTemplate: (columnId: string, template: SmartFillTemplate) => void
  // 获取模板方法
  getTemplate: (columnId: string) => SmartFillTemplate | undefined
  // 清除特定列的模板
  clearTemplate: (columnId: string) => void
  // 判断是否应该显示模板
  shouldShowTemplate: boolean
}

// 创建上下文
const SmartFillContext = createContext<SmartFillContextType | undefined>(undefined)

// 模板缓存 - 使用Map而非全局变量
const templateCache = new Map<string, SmartFillTemplate>()

// 提供者组件
export const SmartFillProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 模态框状态
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 当前选中的列ID
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null)

  // 是否显示之前的模板
  const [shouldShowTemplate, setShouldShowTemplate] = useState(true)

  // 打开模态框
  const openSmartFillModal = (columnId?: string, clearPrevious = false) => {
    if (clearPrevious && columnId) {
      // 如果需要清除之前的模板，则从缓存中删除
      templateCache.delete(columnId)
      setShouldShowTemplate(false)
    } else if (!columnId) {
      // 新增模式始终不显示模板
      setShouldShowTemplate(false)
    } else {
      // 编辑模式显示模板
      setShouldShowTemplate(true)
    }

    setSelectedColumnId(columnId || null)
    setIsModalOpen(true)
  }

  // 关闭模态框
  const closeSmartFillModal = () => {
    setIsModalOpen(false)
  }

  // 保存模板
  const saveTemplate = (columnId: string, template: SmartFillTemplate) => {
    templateCache.set(columnId, template)
  }

  // 获取模板
  const getTemplate = (columnId: string) => {
    return shouldShowTemplate ? templateCache.get(columnId) : undefined
  }

  // 清除特定列的模板
  const clearTemplate = (columnId: string) => {
    templateCache.delete(columnId)
  }

  // 提供上下文值
  const contextValue: SmartFillContextType = {
    isModalOpen,
    selectedColumnId,
    openSmartFillModal,
    closeSmartFillModal,
    saveTemplate,
    getTemplate,
    clearTemplate,
    shouldShowTemplate,
  }

  return <SmartFillContext.Provider value={contextValue}>{children}</SmartFillContext.Provider>
}

// 自定义钩子，用于访问SmartFill上下文
export const useSmartFill = () => {
  const context = useContext(SmartFillContext)
  if (!context) {
    throw new Error('useSmartFill必须在SmartFillProvider内部使用')
  }
  return context
}
