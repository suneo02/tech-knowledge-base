import { isDev } from '@/utils/env'
import { createStockCodeAwareMarkdownRenderer } from 'ai-ui'

// 配置 markdown-it

export const md = createStockCodeAwareMarkdownRenderer(isDev)
