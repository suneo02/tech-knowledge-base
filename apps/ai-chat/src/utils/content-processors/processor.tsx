import React from 'react'
import type { ContentProcessor, ProcessResult } from './types'

/**
 * 创建内容处理器
 * @param options 处理器配置
 * @returns 内容处理器实例
 */
export function createProcessor<T>({
  name,
  check,
  parse,
  render,
}: {
  /** 处理器名称 */
  name: string
  /** 检查函数，判断是否可以处理该内容 */
  check: (text: string) => boolean
  /** 解析函数，将文本解析为特定数据结构 */
  parse: (text: string) => { data: T; position: { start: number; end: number } } | null
  /** 渲染函数，将解析后的数据渲染为 React 组件 */
  render: (data: T) => React.ReactNode
}): ContentProcessor {
  return {
    name,
    check,
    process: (text: string): ProcessResult | null => {
      const result = parse(text)

      if (result) {
        const { data, position } = result
        const beforeText = text.substring(0, position.start)
        const afterText = text.substring(position.end)

        return {
          content: <>{render(data)}</>,
          beforeText,
          afterText,
        }
      }

      return null
    },
  }
}
