import React from 'react'

import { entWebAxiosInstance } from '@/api/entWeb'
import { getWsidDevProd, isDev } from '@/utils/env'
import { AIAnswerMarkdownViewer, createStockCodeAwareMarkdownRenderer } from 'ai-ui'
import { WithDPUList, WithRAGList } from 'gel-api'
import MarkdownIt from 'markdown-it'

// 配置 markdown-it

interface MarkdownProps extends Partial<WithDPUList>, Partial<WithRAGList> {
  content: string
  className?: string
}

export const md: MarkdownIt = createStockCodeAwareMarkdownRenderer(isDev)

const Markdown: React.FC<MarkdownProps> = (props) => {
  return (
    <AIAnswerMarkdownViewer
      {...props}
      wsid={getWsidDevProd()}
      isDev={isDev}
      entWebAxiosInstance={entWebAxiosInstance}
      md={md}
    />
  )
}

export default Markdown
