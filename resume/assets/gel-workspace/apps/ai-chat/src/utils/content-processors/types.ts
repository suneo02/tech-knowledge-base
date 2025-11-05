import { ReactNode } from 'react'

/**
 * 内容处理器接口
 * 用于定义各种类型内容（如表格、图表等）的处理器
 */
export interface ContentProcessor {
  /** 处理器名称，用于标识不同的处理器 */
  name: string
  /** 检查函数，判断文本是否可以被该处理器处理 */
  check: (text: string) => boolean
  /** 处理函数，将文本转换为对应的 React 组件 */
  process: (text: string) => ProcessResult | null
}

/**
 * 处理结果接口
 * 定义内容处理后的返回结果
 */
export interface ProcessResult {
  /** 处理后的 React 组件内容 */
  content: ReactNode
  /** 处理前的文本内容 */
  beforeText: string
  /** 处理后的剩余文本内容 */
  afterText: string
}
