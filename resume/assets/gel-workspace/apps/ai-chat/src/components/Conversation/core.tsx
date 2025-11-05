import { requestToChat } from '@/api'
import { entWebAxiosInstance } from '@/api/entWeb'
import { postPointBuried } from '@/utils/common/bury'
import { ConversationsProps } from '@ant-design/x'
import { message } from '@wind/wind-ui'
import { AddConversationBtn, LogoSection, MyCollectBtn, useFavorites } from 'ai-ui'
import classNames from 'classnames'
import { t } from 'gel-util/intl'
import styles from './index.module.less'
import { InfiniteScrollConversations } from './InfiniteScrollConversations'

export type ConversationCoreProps = {
  logo?: React.ReactNode
  collapse?: boolean
  roomId: string
  isChating: boolean
  onRoomIdChange: (id: string) => void
  loading?: boolean
  onReload?: () => void
  onDeleteConversation: (id: string) => void
  onRenameConversation?: (id: string, newName: string) => Promise<boolean>
  loadMoreItems: () => void
  hasMore?: boolean
  onAddConversation: () => void
} & Pick<ConversationsProps, 'items'>

export const ConversationCore: React.FC<ConversationCoreProps> = ({
  logo,
  roomId,
  isChating,
  onRoomIdChange,
  loading,
  onReload,
  onDeleteConversation,
  onRenameConversation,
  items,
  hasMore,
  loadMoreItems,
  onAddConversation,
  collapse,
}) => {
  const { setShowFavorites, addFavorite, removeFavorite } = useFavorites()

  // 处理会话切换
  const handleConversationClick = (key: string) => {
    setShowFavorites(false)
    // 如果点击的是当前已激活的会话，不执行任何操作
    if (key === roomId) {
      return
    }

    if (isChating) {
      message.error(t('421523', '请等待当前对话结束'))
    } else {
      postPointBuried('922610370016')
      onRoomIdChange(key)
    }
  }

  // 添加新会话
  const handleAddConversation = () => {
    setShowFavorites(false)
    if (isChating) {
      message.error(t('421523', '请等待当前对话结束'))
    } else {
      postPointBuried('922610370017')
      onAddConversation()
    }
  }

  // 处理会话重命名
  const handleRenameConversation = async (id: string, newName: string): Promise<boolean> => {
    if (isChating) {
      message.error(t('421523', '请等待当前对话结束'))
      return false
    }

    if (!newName.trim()) {
      message.error(t('', '名称不能为空'))
      return false
    }

    // 如果父组件传入了重命名方法，优先使用
    if (onRenameConversation) {
      return onRenameConversation(id, newName)
    }

    // 否则使用默认实现
    try {
      const response = await requestToChat('updateChatGroup', {
        groupId: id,
        title: newName.trim(),
      })

      if (response) {
        message.success(t('', '重命名成功'))
        // 重新加载会话列表
        loadMoreItems()
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

  return (
    <div className={classNames(styles.menu, { [styles['menu--collapse']]: collapse })}>
      {/* 🌟 Logo */}
      {logo || <LogoSection />}
      {!collapse && <span className={styles.description}>{t('424233', 'Hi，我是您的商业数据查询智能助手')}</span>}
      {/* 🌟 添加会话 */}

      {!collapse && (
        <AddConversationBtn loading={loading} style={{ marginBlockEnd: 12 }} onClick={handleAddConversation} />
      )}

      <MyCollectBtn axiosInstanceEntWeb={entWebAxiosInstance} />

      {/* 🌟 会话管理 */}
      {!collapse && (
        <>
          <InfiniteScrollConversations
            items={items}
            hasMore={hasMore}
            loading={loading}
            loadMoreItems={loadMoreItems}
            activeKey={roomId}
            onReload={onReload}
            onActiveChange={handleConversationClick}
            onDeleteConversation={onDeleteConversation}
            onRenameConversation={handleRenameConversation}
            onAddFavorite={addFavorite}
            onRemoveFavorite={removeFavorite}
          />
        </>
      )}
    </div>
  )
}
