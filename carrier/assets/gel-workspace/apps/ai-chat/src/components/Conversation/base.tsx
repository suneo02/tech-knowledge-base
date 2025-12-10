import { requestToChat } from '@/api'
import { entWebAxiosInstance } from '@/api/entWeb'
import { createChatRequest } from '@/api/handle'
import { useConversationsInfiniteScroll } from '@/hooks/useConversationsInfiniteScroll'
import { postPointBuried } from '@/utils/common/bury'
import { ConversationsProps } from '@ant-design/x'
import { message } from '@wind/wind-ui'
import {
  AddConversationBtn,
  HistoryBtn,
  MyCollectBtn,
  initRandomRoomId,
  useChatRoomContext,
  useConversationsBase,
  useFavorites,
  useHistory,
} from 'ai-ui'
import classNames from 'classnames'
import { AIChatHistory, ApiResponseForWFC } from 'gel-api'
import { LogoSection } from 'gel-ui'
import { t } from 'gel-util/intl'
import { useMemo } from 'react'
import { groupConversation } from './handle'
import styles from './index.module.less'
import { InfiniteScrollConversations } from './InfiniteScrollConversations'

/**
 * 处理 base conversations 的渲染
 */

const processConversations = (conversations: AIChatHistory[]): ConversationsProps['items'] => {
  return conversations.map((conversation) => {
    return {
      ...groupConversation(conversation),
      key: conversation.groupId,
      label: conversation.questions || `对话 ${conversation.groupId}`,
    }
  })
}

// 创建请求函数
const requestFunc = createChatRequest('selectChatAIConversation')

export const ChatConversationBase: React.FC = () => {
  const { roomId, updateRoomId, isChating } = useChatRoomContext()

  // 先获取context中的方法和数据，避免闭包问题
  const { updateConversationsItems, conversationsItems } = useConversationsBase()
  const { setShowFavorites, addFavorite, removeFavorite } = useFavorites()
  const { setShowHistory } = useHistory()

  /**
   * 使用统一的会话无限滚动 hook 处理加载和删除逻辑
   */
  const { loading, loadingMore, hasMore, loadMore, handleDeleteConversation, reload } = useConversationsInfiniteScroll<
    AIChatHistory,
    ApiResponseForWFC<AIChatHistory[]>
  >({
    // 请求函数
    requestFn: async (params) => {
      return await requestFunc(params)
    },
    deleteConversationFn: async (id) => {
      await requestToChat('delChatGroup', { groupIds: [id] })
    },
    // 从结果中提取数据
    getDataFromResult: (result) => result?.Data || [],
    // 判断是否有更多数据
    hasMoreFn: (result) => {
      const list = result?.Data || []
      const total = result?.Page?.Records || 0

      if (!list.length) return false

      // 如果已加载的数据数量小于总数，还有更多数据
      return list.length < total
    },
    // 更新 context 中的会话列表数据
    updateConversationsItems,
    // 当前选中的会话 ID
    currentId: roomId,
    // 当需要更新选中的会话 ID 时的回调函数
    onCurrentIdChange: updateRoomId,
    // 当会话列表为空时创建新会话的函数
    createNewConversation: () => {
      updateRoomId(initRandomRoomId())
    },
    // 请求参数字段配置
    paramConfig: {
      pageNoKey: 'pageIndex',
      pageSizeKey: 'pageSize',
      pageSize: 20,
    },
  })

  // 处理重命名逻辑
  const handleRenameConversation = async (id: string, newName: string): Promise<boolean> => {
    try {
      const response = await requestToChat('updateChatGroup', {
        groupId: id,
        title: newName.trim(),
      })

      if (response) {
        message.success(t('', '重命名成功'))
        // 重新加载会话列表
        await reload()

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

  const processedItems = useMemo(() => {
    return processConversations(conversationsItems)
  }, [conversationsItems])

  // 点击会话
  const handleConversationClick = (key: string) => {
    setShowFavorites(false)
    setShowHistory(false)
    if (key === roomId) return
    if (isChating) {
      message.error(t('421523', '请等待当前对话结束'))
      return
    }
    postPointBuried('922610370016')
    updateRoomId(key)
  }

  // 添加会话
  const handleAddConversation = () => {
    setShowFavorites(false)
    setShowHistory(false)
    if (isChating) {
      message.error(t('421523', '请等待当前对话结束'))
      return
    }
    postPointBuried('922610370017')
    updateRoomId(initRandomRoomId())
  }

  // 重命名包装（校验 + 复用已有实现）
  const handleRenameWithGuard = async (id: string, newName: string): Promise<boolean> => {
    if (isChating) {
      message.error(t('421523', '请等待当前对话结束'))
      return false
    }
    if (!newName.trim()) {
      message.error(t('', '名称不能为空'))
      return false
    }
    return await handleRenameConversation(id, newName)
  }

  return (
    <div className={classNames(styles.menu)}>
      <LogoSection logoText={t('466895', '万得企业库Alice')} />
      <span className={styles.description}>{t('453645', 'Hi，我是您的商业查询智能助手')}</span>
      <AddConversationBtn
        loading={loading || loadingMore}
        style={{ marginBlockEnd: 12 }}
        onClick={handleAddConversation}
      />
      <MyCollectBtn loading={isChating} axiosInstanceEntWeb={entWebAxiosInstance} />
      <HistoryBtn loading={isChating} style={{ marginBlockStart: 4 }} axiosInstanceEntWeb={entWebAxiosInstance} />
      <>
        <InfiniteScrollConversations
          items={processedItems}
          hasMore={hasMore}
          loading={loading || loadingMore}
          loadMoreItems={loadMore}
          activeKey={roomId}
          onReload={reload}
          onActiveChange={handleConversationClick}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameWithGuard}
          onAddFavorite={addFavorite}
          onRemoveFavorite={removeFavorite}
        />
      </>
    </div>
  )
}
