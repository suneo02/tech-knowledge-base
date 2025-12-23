// 筛选/显示模式类型

import { getCDEFilterResPayload } from 'gel-api'

export type CDEModalMode =
  // 数据筛选
  | 'filter'
  // 订阅预览
  | 'subscribe'

// 模态框组件的属性
export interface CDEFilterPreviewModalProps {
  open: boolean
  close: () => void
  container?: HTMLElement | null
  className?: string
  wrapperClassName?: string
  width?: string
  height?: string

  onFinish: (cdeDescription: string, cdeFilterCondition: getCDEFilterResPayload) => void
  confirmLoading: boolean
  confirmText: string
  defaultCurrent?: number
  defaultViewMode?: CDEModalMode

  canAddCdeToCurrent?: boolean
}
