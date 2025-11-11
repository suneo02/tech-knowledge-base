import React from 'react'

import { entWebAxiosInstance } from '@/api/entWeb'
import { md } from '@/components/markdown'
import { getWsid, isDev } from '@/utils/env'
import { AIAnswerMarkdownViewer } from 'ai-ui'
import styles from './index.module.less'

interface SummaryItemProps {
  content: string
}

const SummaryItem: React.FC<SummaryItemProps> = (props) => {
  const { content } = props

  const renderMarkdown = () => {
    return (
      <AIAnswerMarkdownViewer
        wsid={getWsid()}
        isDev={isDev}
        entWebAxiosInstance={entWebAxiosInstance}
        md={md}
        content={content}
      />
    )
  }

  return <div className={styles.summaryItem}>{renderMarkdown()}</div>
}

export default React.memo(SummaryItem)
