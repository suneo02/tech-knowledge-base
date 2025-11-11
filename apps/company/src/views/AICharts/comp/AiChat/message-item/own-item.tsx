import React, { useState, useEffect } from 'react'
import InnerHtml from '@/components/InnerHtml'
import styles from './index.module.less'
import { FileExcelC, DocumentO } from '@wind/icons'
import { AIGRAPH_SEND_TYPE_KEYS } from '../../../contansts'

interface OwnItemProps {
  content: string
  excelFileList?: any[]
  markdownTitle?: string
  markdownText?: string
  attachmentText?: string
}

const OwnItem: React.FC<OwnItemProps> = (props) => {
  const { content = '请输入关键信息', excelFileList, markdownTitle, attachmentText, markdownText } = props

  const [fileHistory, setFileHistory] = useState([])
  const [markdownHistory, setMarkdownHistory] = useState('')

  useEffect(() => {
    if (attachmentText?.startsWith(AIGRAPH_SEND_TYPE_KEYS.EXCEL)) {
      setFileHistory([{ name: attachmentText?.split(AIGRAPH_SEND_TYPE_KEYS.EXCEL + ':')[1] }])
    } else if (attachmentText?.startsWith(AIGRAPH_SEND_TYPE_KEYS.MARKDOWN)) {
      setMarkdownHistory(attachmentText?.split(AIGRAPH_SEND_TYPE_KEYS.MARKDOWN + ':')[1])
    }
  }, [attachmentText])

  // 将换行符转换为 HTML br 标签，已支持markdown格式
  const formatContent = (text: string) => {
    return text?.replace(/\n/g, '<br>') || ''
  }

  const renderFile = (item: any) => {
    return (
      <div className={styles.chatFileItem}>
        <FileExcelC
          className={styles.chatFileIcon}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        <div className={styles.chatFileName}>{item?.name}</div>
      </div>
    )
  }

  const renderMarkdownTitle = (title: string) => {
    return (
      <div className={styles.chatMarkdownBox} style={{ marginTop: content ? 12 : 0 }}>
        <DocumentO
          className={styles.chatMarkdownIcon}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        <div className={styles.chatMarkdownTitle}>
          <InnerHtml html={formatContent(title)}></InnerHtml>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.ownRoot}>
      <div className={styles.ownContent}>
        <InnerHtml html={formatContent(content)}></InnerHtml>

        {/* 导入Excel文件列表，现在仅支持一个文件 */}
        {excelFileList?.length ? (
          <div className={styles.chatFileBox} style={{ marginTop: content ? 12 : 0 }}>
            {excelFileList.map((item) => renderFile(item))}
          </div>
        ) : null}

        {/* {markdownTitle ? renderMarkdownTitle(markdownTitle) : null} */}
        {markdownText ? renderMarkdownTitle(markdownText) : null}

        {/* 历史对话信息渲染 */}
        {fileHistory.length ? (
          <div className={styles.chatFileBox} style={{ marginTop: content ? 12 : 0 }}>
            {fileHistory.map((item) => renderFile(item))}
          </div>
        ) : null}

        {markdownHistory ? renderMarkdownTitle(markdownHistory) : null}
      </div>
    </div>
  )
}

export default OwnItem
