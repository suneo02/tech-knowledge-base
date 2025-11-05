import React from 'react'

import { entWebAxiosInstance } from '@/api/entWeb'
import { getWsidDevProd, isDev } from '@/utils/env'
import { createMDIT, Markdown as MarkdownUI } from 'ai-ui'
import { QueryReferenceSuggest, RefTableData } from 'gel-api'
import MarkdownIt from 'markdown-it'

// 配置 markdown-it

interface MarkdownProps {
  content: string
  className?: string
  /** 溯源用 */
  refTable?: RefTableData[]
  refBase?: QueryReferenceSuggest[]
}

export const md: MarkdownIt = createMDIT(isDev)

const Markdown: React.FC<MarkdownProps> = (props) => {
  return (
    <MarkdownUI {...props} wsid={getWsidDevProd()} isDev={isDev} entWebAxiosInstance={entWebAxiosInstance} md={md} />
  )
}

export default Markdown
