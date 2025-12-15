import { entWebAxiosInstance } from '@/api/entWeb'
import { postPointBuried } from '@/utils/common/bury'
import { Conversations, ConversationsProps } from '@ant-design/x'
import { Spin } from '@wind/wind-ui'
import classNames from 'classnames'
import { ConversavionEditingInput, getConversationMenu, getGroupableConfig } from 'gel-ui'
import { createIntersectionObserver } from 'gel-util/common'
import { useEffect, useMemo, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from './index.module.less'

interface InfiniteScrollConversationsProps {
  items?: ConversationsProps['items']
  hasMore?: boolean
  loading?: boolean
  loadMoreItems: () => void
  activeKey: string
  onReload?: () => void
  onActiveChange: (key: string) => void
  onDeleteConversation?: (id: string) => void
  onRenameConversation?: (id: string, newName: string) => Promise<boolean>
  onAddFavorite?: (id: number) => Promise<boolean>
  onRemoveFavorite?: (id: number) => Promise<boolean>
  menu?: ConversationsProps['menu']
  className?: string
  conversationClassName?: string
  infiniteScrollClassName?: string
  enableFavorite?: boolean
  enableRename?: boolean
}

export const InfiniteScrollConversations: React.FC<InfiniteScrollConversationsProps> = ({
  items,
  hasMore,
  loading,
  loadMoreItems,
  activeKey,
  onActiveChange,
  menu,
  onReload,
  onDeleteConversation,
  onRenameConversation,
  onAddFavorite,
  onRemoveFavorite,
  className,
  conversationClassName,
  infiniteScrollClassName,
  enableFavorite,
  enableRename,
}: InfiniteScrollConversationsProps) => {
  const loadMoreRef = useRef(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [itemsList, setItemsList] = useState<ConversationsProps['items']>([])

  const { observable } = createIntersectionObserver(
    () => {
      loadMoreItems?.()
    },
    undefined,
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    }
  )

  // 处理重命名确认
  const handleRenameConfirm = async (conversationId: string, newName: string) => {
    if (!newName.trim() || !onRenameConversation) {
      setEditingId(null)
      return
    }

    try {
      const success = await onRenameConversation(conversationId, newName.trim())
      if (success) {
        // 重命名成功后,乐观更新UI
        setItemsList((prev) =>
          (prev || []).map((item) => (item.key === conversationId ? { ...item, label: newName.trim() } : item))
        )
      }
    } catch (error) {
      console.error('重命名处理出错:', error)
    } finally {
      setEditingId(null)
    }
  }

  // 当items变化时，更新itemsList
  useEffect(() => {
    setItemsList(items)
  }, [items])

  // 使用 useMemo 生成最终渲染的列表
  const renderedItems = useMemo(() => {
    if (!editingId) return itemsList

    return (itemsList || []).map((item) => {
      if (item.key === editingId) {
        const initialValue = typeof item.label === 'string' ? item.label : ''
        return {
          ...item,
          label: (
            <ConversavionEditingInput
              initialValue={initialValue}
              conversationId={editingId}
              onConfirm={handleRenameConfirm}
              onCancel={() => setEditingId(null)}
            />
          ),
        }
      }
      return item
    })
  }, [itemsList, editingId])

  // 处理添加收藏
  const handleAddFavorite = async (conversation: {
    key: string
    id?: number
    label?: React.ReactNode
    content?: string
    collectFlag?: boolean
  }) => {
    try {
      // 尝试获取会话内容，如果有自定义方法，优先使用
      if (conversation?.collectFlag) {
        await onRemoveFavorite?.(Number(conversation.id))
        postPointBuried('922610370024')
      } else {
        // 使用上下文中的通用方法
        await onAddFavorite?.(Number(conversation.id))
        postPointBuried('922610370023')
      }
      onReload?.()
    } catch (error) {
      console.error('添加收藏失败:', error)
    }
  }

  const menuConfig = getConversationMenu({
    onDelete: onDeleteConversation,
    editingId: editingId ?? undefined,
    onRename: setEditingId,
    onAddFavorite: handleAddFavorite,
    entWebAxiosInstance,
    enableFavorite,
    enableRename,
  })

  useEffect(() => {
    if (loadMoreRef.current) {
      observable.observe(loadMoreRef.current)
    }
    return () => {
      if (loadMoreRef.current) observable.unobserve(loadMoreRef.current)
    }
  }, [loading])

  return (
    <div className={classNames(styles.scrollContainer, className)} id="scrollableDiv">
      <InfiniteScroll
        className={infiniteScrollClassName}
        style={{ height: '100%' }}
        next={loadMoreItems}
        hasMore={hasMore ?? false}
        dataLength={itemsList?.length ?? 0}
        loader={
          <div ref={loadMoreRef} style={{ textAlign: 'center' }}>
            <Spin size="small" />
          </div>
        }
        scrollableTarget="scrollableDiv"
      >
        <Conversations
          items={renderedItems}
          className={classNames(styles.conversations, conversationClassName)}
          activeKey={activeKey}
          onActiveChange={onActiveChange}
          menu={menu || menuConfig}
          groupable={getGroupableConfig()}
          style={{
            color: '#333',
          }}
          styles={{
            item: {
              color: '#333',
            },
          }}
        />
      </InfiniteScroll>
    </div>
  )
}
