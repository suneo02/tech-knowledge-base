import { tableProcessor } from './table'
import type { ContentProcessor } from './types'

/**
 * 注册所有处理器
 */
export const contentProcessors: ContentProcessor[] = [
  tableProcessor,
  // chartProcessor,
  // 这里可以添加更多处理器
  // latexProcessor,
  // codeBlockProcessor,
]
