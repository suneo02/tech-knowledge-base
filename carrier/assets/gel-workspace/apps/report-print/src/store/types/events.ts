/**
 * 事件数据类型定义
 * 为事件总线中的事件数据提供类型安全
 */

/**
 * 节点可见性变更事件数据
 */
export interface VisibilityChangedEventData {
  /** 节点ID */
  nodeId: string
  /** 是否可见 */
  isVisible: boolean
}

/**
 * 节点选中事件数据
 */
export interface NodeSelectedEventData {
  /** 节点ID */
  nodeId: string
  /** 节点层级路径 */
  path?: string[]
}

/**
 * 标题点击事件数据
 */
export interface HeadingClickedEventData {
  /** 节点ID */
  nodeId?: string
  /** 序号数组 */
  numbers: number[]
  /** 标题文本 */
  title?: string
  /** 额外数据 */
  [key: string]: any
}

/**
 * 数据加载事件数据
 */
export interface DataLoadedEventData {
  /** 数据源 */
  source: string
  /** 加载是否成功 */
  success: boolean
  /** 加载的数据 */
  data?: any
  /** 错误信息 */
  error?: string
}

/**
 * 加载状态变更事件数据
 */
export interface LoadingChangedEventData {
  /** 是否加载中 */
  loading: boolean
  /** 加载资源标识 */
  resource?: string
  /** 加载消息 */
  message?: string
}

/**
 * 模态框事件数据
 */
export interface ModalEventData {
  /** 模态框ID */
  modalId: string
  /** 模态框标题 */
  title?: string
  /** 传递的数据 */
  data?: any
}

/**
 * 提示消息事件数据
 */
export interface ToastEventData {
  /** 消息内容 */
  message: string
  /** 消息类型 */
  type?: 'success' | 'error' | 'warning' | 'info'
  /** 显示时长（毫秒） */
  duration?: number
}

/**
 * 事件数据类型映射
 */
export interface EventDataMap {
  'state:visibilityChanged': VisibilityChangedEventData
  'tree:nodeSelected': NodeSelectedEventData
  'content:nodeSelected': NodeSelectedEventData
  'section:headingClicked': HeadingClickedEventData
  'app:dataLoaded': DataLoadedEventData
  'report:dataLoaded': DataLoadedEventData
  'report:dataLoadFailed': { error: string; source?: string }
  'state:loadingChanged': LoadingChangedEventData
  'ui:modalShow': ModalEventData
  'ui:modalHide': ModalEventData
  'ui:toastShow': ToastEventData
  'ui:globalSearch': { query: string }

  // 可以继续添加更多事件数据类型映射
  [key: string]: any
}

/**
 * 获取特定事件名称的数据类型
 */
export type EventData<T extends keyof EventDataMap> = EventDataMap[T]
