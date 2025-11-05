import { requestToSuperlistFcs } from '@/api'
import { createSuperlistRequestFcs } from '@/api/handleFcs'
import { InfiniteScrollConversations } from '@/components/Conversation/InfiniteScrollConversations'
import { processSuperConversations } from '@/components/Conversation/processSuperConversations'
import { useConversationsInfiniteScroll } from '@/hooks/useConversationsInfiniteScroll'
import { ApiResponseForSuperlistWithPage, SuperChatHistoryItem } from 'gel-api'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './style/historyList.module.less'
import { t } from 'gel-util/intl'

const renameFunc = createSuperlistRequestFcs('conversation/renameConversation')

/**
 * 历史会话列表组件
 * 使用 useConversationsInfiniteScroll 实现分页加载历史会话数据
 */
export const HistoryList: React.FC = () => {
  const navigate = useNavigate()

  // 创建请求函数
  const conversationListRequest = createSuperlistRequestFcs('conversation/conversationList')

  /**
   * 使用会话无限滚动 hook 管理历史会话列表
   */
  const {
    list: conversations,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    handleDeleteConversation,
  } = useConversationsInfiniteScroll<SuperChatHistoryItem, ApiResponseForSuperlistWithPage<SuperChatHistoryItem>>({
    // 请求函数
    requestFn: async (params) => {
      return await conversationListRequest(params)
    },
    deleteConversationFn: async (id) => {
      await requestToSuperlistFcs('conversation/delConversation', {
        conversationId: id,
      })
    },
    // 从结果中提取数据列表
    getDataFromResult: (result) => {
      return result?.Data?.list || []
    },
    // 判断是否有更多数据
    hasMoreFn: (result) => {
      const list = result?.Data?.list || []
      const page = result?.Data?.page

      if (!list.length) return false

      // 如果已加载的数据数量小于总数，还有更多数据
      if (page && page.total) {
        return list.length < page.total
      }

      // 如果返回的数据少于 pageSize，说明没有更多数据了
      return list.length >= 20
    },
    // 更新会话列表数据 - 这里不需要管理全局状态，直接使用空函数
    updateConversationsItems: () => {},
    // 请求参数字段配置
    paramConfig: {
      pageNoKey: 'pageNo',
      pageSizeKey: 'pageSize',
      pageSize: 20,
    },
  })

  /**
   * 处理会话项点击事件
   * @param key 会话ID
   */
  const handleItemClick = (key: string) => {
    navigate(`/super/chat/${key}`)
  }

  // 处理会话重命名
  const handleRenameConversation = async (id: string, newName: string): Promise<boolean> => {
    console.log('🚀 ~ handleRenameConversation ~ newName:', newName)
    if (!newName.trim()) {
      message.error(t('', '名称不能为空'))
      return false
    }

    // 否则使用默认实现
    try {
      const response = await renameFunc({
        conversationId: id,
        conversationName: newName.trim(),
      })

      if (response) {
        message.success(t('', '重命名成功'))
        // 重新加载会话列表
        // loadMoreItems()
        return true
      } else {
        message.error(t('', '重命名失败'))
        return false
      }
    } catch (error) {
      console.error('重命名失败:', error)
      message.error(t('', '重命名失败'))
      return false
    }
  }

  // 将SuperChatHistoryItem转换为InfiniteScrollConversations所需的数据格式
  const processedItems = useMemo(() => {
    return processSuperConversations(conversations)
  }, [conversations])

  // 配置菜单项

  return (
    <div className={styles['history-list-container']}>
      <div className={styles['history-list-header']}>
        <span>历史对话</span>
      </div>

      <InfiniteScrollConversations
        conversationClassName={styles['history-list-conversation']}
        items={processedItems}
        hasMore={hasMore}
        loading={loading || loadingMore}
        loadMoreItems={loadMore}
        activeKey="" // 不需要激活任何项
        onActiveChange={handleItemClick}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
      />
    </div>
  )
}
