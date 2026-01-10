/**
 * Home Reducer 类型定义
 */

// ======== Action 类型定义 ========

interface BaseAction<T extends string, P = any> {
  type: T
  data: P
}

export type SetGlobalModalAction = BaseAction<'SET_GLOBAL_MODAL', any>

export type ClearGlobalModalAction = BaseAction<'CLEAR_GLOBAL_MODAL', undefined>

export type SetLanguageAction = BaseAction<
  'SET_LANGUAGE',
  {
    language: string
  }
>

export type GlobalAction = SetGlobalModalAction | ClearGlobalModalAction | SetLanguageAction

// ======== Payload 与 State 类型定义 ========

export interface GlobalModalProps {
  className?: string
  width?: number
  height?: number
  visible?: boolean
  title?: React.ReactNode | string
  content?: React.ReactNode
  footer?: React.ReactNode[]
  onCancel?: () => void
  onOk?: () => void | Promise<void>
  type?: string
  maskClosable?: boolean
  closable?: boolean
  zIndex?: number
  okText?: string
  cancelText?: string
}

export interface GlobalState {
  globalModalProps: GlobalModalProps | null
  language: string
  en_access_config?: boolean
}
