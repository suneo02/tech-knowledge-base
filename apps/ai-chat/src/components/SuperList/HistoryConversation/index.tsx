import { createSuperlistRequestFcs } from '@/api'
import { Empty, List, Pagination } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import classNames from 'classnames'
import { ApiCodeForWfc, ApiPageForSuperlist, SuperChatHistoryItem } from 'gel-api'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConversationItem } from './ConversationItem'
import styles from './style/index.module.less'

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
  const navigate = useNavigate()
  const { run: runRename } = useRequest(renameFunc, {
    onSuccess: (data) => {
      if (data.ErrorCode === ApiCodeForWfc.SUCCESS) {
        message.success('重命名成功')
        onPageChange(page.pageNo, page.pageSize)
      } else {
        message.error('重命名失败')
      }
    },
    onError: () => {
      message.error('重命名失败')
    },
    manual: true,
  })
  const { run: runDelete } = useRequest(deleteFunc, {
    onSuccess: (data) => {
      if (data.ErrorCode === ApiCodeForWfc.SUCCESS) {
        message.success('删除成功')
        onPageChange(page.pageNo, page.pageSize)
      } else {
        message.error('删除失败')
      }
    },
    onError: () => {
      message.error('删除失败')
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
    console.log('🚀 ~ handleRename ~ newName:', newName)
    setEditingId('')
    runRename({
      conversationId: item.conversationId,
      conversationName: newName,
    })
  }

  return (
    <div className={classNames(styles['history-conversation'], className)}>
      <h4 className={styles['history-conversation-title']}>历史对话</h4>

      <List
        className={styles['conversation-list']}
        loading={loading}
        dataSource={conversations}
        locale={{ emptyText: <Empty description="暂无历史对话" /> }}
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
