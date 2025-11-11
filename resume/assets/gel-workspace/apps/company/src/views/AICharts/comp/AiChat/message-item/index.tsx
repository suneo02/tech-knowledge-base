import React from 'react'

import styles from './index.module.less'
import RobotItem from './robot-item'
import OwnItem from './own-item'

interface MessageItemProps {
  content: string
  role: number
  id: string
  fetching: boolean
  version?: number
  robotIndex: number
  thumbnail?: string // 添加缩略图属性
  handleVersionImgClick: (val: number) => void
  isActiveVersion: boolean
  handleRefreshClick: () => void
  handleLikeClick: () => void
  handleDislikeClick: () => void
  excelFileList?: any[]
  markdownTitle?: string
  markdownText?: string
  attachmentText?: string
  questionSource?: 'user' | 'modify' // 问题来源（用户提问、数据表格编辑修改）
  summarizing?: boolean // 是否是正在总结分析
}

const MessageItem: React.FC<MessageItemProps> = (props) => {
  const {
    content = '',
    role,
    id,
    version,
    isActiveVersion,
    fetching,
    thumbnail, // 添加缩略图属性
    handleVersionImgClick,
    handleRefreshClick,
    handleLikeClick,
    handleDislikeClick,
    excelFileList,
    markdownTitle,
    markdownText,
    attachmentText,
    questionSource,
    summarizing,
  } = props

  return (
    <div className={styles.root}>
      {role === 2 ? (
        <RobotItem
          content={content}
          id={id}
          fetching={fetching}
          handleVersionImgClick={() => handleVersionImgClick(version)}
          isActiveVersion={isActiveVersion}
          version={version}
          thumbnail={thumbnail} // 传递缩略图属性
          handleRefreshClick={handleRefreshClick}
          handleLikeClick={handleLikeClick}
          handleDislikeClick={handleDislikeClick}
          questionSource={questionSource}
          summarizing={summarizing}
          data-uc-id="OFw4qirLO5"
          data-uc-ct="robotitem"
        />
      ) : (
        <OwnItem
          content={content}
          excelFileList={excelFileList}
          markdownText={markdownText}
          markdownTitle={markdownTitle}
          data-uc-id="KUqex_rTXM"
          data-uc-ct="ownitem"
          attachmentText={attachmentText}
        />
      )}
    </div>
  )
}

export default MessageItem
