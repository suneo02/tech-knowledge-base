import { createSuperlistRequestFcs } from '@/api'
import { Empty, List, Pagination } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import classNames from 'classnames'
import { ApiCodeForWfc, ApiPageForSuperlist, SuperChatHistoryItem } from 'gel-api'
import React, { useState } from 'react'
import { useNavigateWithLangSource } from '@/hooks/useLangSource'
import { ConversationItem } from './ConversationItem'
import styles from './style/index.module.less'
import { t } from 'gel-util/intl'

const STRINGS = {
  HISTORY_TITLE: t('421520', '历史对话'),
  HISTORY_EMPTY_TEXT: t('421521', '暂无历史对话'),
  RENAME_SUCCESS: t('464210', '重命名成功'),
  RENAME_FAILED: t('464222', '重命名失败'),
  DELETE_SUCCESS: t('416956', '删除成功'),
  DELETE_FAILED: t('315910', '删除失败'),
}

export interface HistoryConversationProps {
  className?: string
  conversations?: SuperChatHistoryItem[]
  page: ApiPageForSuperlist
  loading: boolean
  onPageChange: (pageNo: number, pageSize: number) => void
}

const renameFunc = createSuperlistRequestFcs('conversation/renameConversation')
const deleteFunc = createSuperlistRequestFcs('conversation/delConversation')

export const HistoryConversation: React.FC<HistoryConversationProps> = ({
  page,
  onPageChange,
  loading,
  conversations,
  className,
}) => {
  const navigate = useNavigateWithLangSource()
  const { run: runRename } = useRequest(renameFunc, {
    onSuccess: (data) => {
      if (data.ErrorCode === ApiCodeForWfc.SUCCESS) {
        message.success(STRINGS.RENAME_SUCCESS)
        onPageChange(page.pageNo, page.pageSize)
      } else {
        message.error(STRINGS.RENAME_FAILED)
      }
    },
    onError: () => {
      message.error(STRINGS.RENAME_FAILED)
    },
    manual: true,
  })
  const { run: runDelete } = useRequest(deleteFunc, {
    onSuccess: (data) => {
      if (data.ErrorCode === ApiCodeForWfc.SUCCESS) {
        message.success(STRINGS.DELETE_SUCCESS)
        onPageChange(page.pageNo, page.pageSize)
      } else {
        message.error(STRINGS.DELETE_FAILED)
      }
    },
    onError: () => {
      message.error(STRINGS.DELETE_FAILED)
    },
    manual: true,
  })
  const [editingId, setEditingId] = useState<string>('')

  const handleItemClick = (item: SuperChatHistoryItem) => {
    navigate(`/super/chat/${item.conversationId}`)
  }

  const handleMenuClick = (key: string, item: SuperChatHistoryItem) => {
    if (key === 'rename') {
      setEditingId(item.conversationId)
    } else if (key === 'delete') {
      runDelete({
        conversationId: item.conversationId,
      })
    }
  }

  const handleRename = (item: SuperChatHistoryItem, newName: string) => {
    // console.log('🚀 ~ handleRename ~ newName:', newName)
    setEditingId('')
    runRename({
      conversationId: item.conversationId,
      conversationName: newName,
    })
  }

  return (
    <div className={classNames(styles['history-conversation'], className)}>
      <h4 className={styles['history-conversation-title']}>{STRINGS.HISTORY_TITLE}</h4>

      <List
        className={styles['conversation-list']}
        loading={loading}
        dataSource={conversations}
        locale={{ emptyText: <Empty description={STRINGS.HISTORY_EMPTY_TEXT} /> }}
        renderItem={(item) => (
          <List.Item key={item.conversationId}>
            <ConversationItem
              item={item}
              editingId={editingId}
              onItemClick={handleItemClick}
              onMenuClick={handleMenuClick}
              onRename={handleRename}
              onEditingChange={setEditingId}
            />
          </List.Item>
        )}
      />

      {page.total > 0 && (
        <div className={styles['pagination-container']}>
          <Pagination
            current={page.pageNo + 1}
            pageSize={page.pageSize}
            total={page.total}
            onChange={onPageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total) => `共 ${total} 条`}
          />
        </div>
      )}
    </div>
  )
}
