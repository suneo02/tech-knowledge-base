import { useIntersection } from '@/utils/intersection'
import { DeleteOutlined } from '@ant-design/icons'
import { Conversations, ConversationsProps } from '@ant-design/x'
import { AddStarO, CheckO, CloseO, PencilO, StarF, StarO } from '@wind/icons'
import { Input, Spin } from '@wind/wind-ui'
import classNames from 'classnames'
import { t } from 'gel-util/intl'
import { memo, useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getGroupableConfig } from '../handle'
import styles from './index.module.less'
import { postPointBuried } from '@/utils/common/bury'

// 编辑输入框组件
const EditingInput = memo(
  ({
    initialValue,
    conversationId,
    onConfirm,
    onCancel,
  }: {
    initialValue: string
    conversationId: string
    onConfirm: (id: string, value: string) => void
    onCancel: () => void
  }) => {
    const [value, setValue] = useState(initialValue)
    const [blurable, setBlurable] = useState(false)

    useEffect(() => {
      // 延迟设置blurable，避免立即失焦
      const timer = setTimeout(() => {
        setBlurable(true)
      }, 100)
      return () => clearTimeout(timer)
    }, [])

    return (
      <>
        <div className={styles['editing-item']}>
          <Input
            autoFocus
            size="small"
            value={value}
            // @ts-expect-error windui
            maxLength={30}
            onChange={(e) => setValue(e.target.value)}
            onBlur={(e) => {
              if (!value) {
                return
              }
              e.preventDefault()
              e.stopPropagation()
              if (blurable) {
                setTimeout(() => {
                  onCancel()
                }, 100)
              }
            }}
            onFocus={() => {
              console.log('onFocus')
            }}
            onPressEnter={() => {
              onConfirm(conversationId, value)
            }}
            style={{ width: '100%' }}
          />
          <CheckO
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            style={{ fontSize: 16, marginLeft: '8px', cursor: 'pointer' }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()

              console.log('🚀 ~ e:', e)
              console.log('🚀 ~ onClick ~ value:', value)
              onConfirm(conversationId, value)
            }}
          />
          <CloseO
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            style={{ fontSize: 16, marginLeft: '8px' }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onCancel()
            }}
          />
        </div>
      </>
    )
  }
)

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
}) => {
  const loadMoreRef = useRef(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [itemsList, setItemsList] = useState<ConversationsProps['items']>([])

  const { observable } = useIntersection(
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
    console.log('🚀 ~ handleRenameConfirm ~ newName:', newName)
    if (!newName.trim() || !onRenameConversation) return

    try {
      const success = await onRenameConversation(conversationId, newName.trim())
      if (success) {
        // 重命名成功后清除编辑状态
        setEditingId(null)
      }
    } catch (error) {
      console.error('重命名处理出错:', error)
    }
  }

  // 当items或editingId变化时，更新itemsList
  useEffect(() => {
    if (!items) {
      setItemsList([])
      return
    }

    // 如果有正在编辑的项，替换为编辑框
    if (editingId) {
      const newItems = items.map((item) => {
        if (item.key === editingId) {
          const initialValue = typeof item.label === 'string' ? item.label : ''
          return {
            ...item,
            label: (
              <EditingInput
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
      setItemsList(newItems)
    } else {
      setItemsList(items)
    }
  }, [items, editingId])

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

  const menuConfig: ConversationsProps['menu'] = (conversation) => ({
    items: [
      {
        label: conversation?.collectFlag ? t('257657', '取消收藏') : t('265408', '收藏'),
        key: 'favorite',
        // @ts-expect-error windui
        icon: conversation?.collectFlag ? <StarF style={{ fontSize: 16 }} /> : <AddStarO style={{ fontSize: 16 }} />,
      },
      {
        label: t('18507', '重命名'),
        key: 'rename',
        // @ts-expect-error windui
        icon: <PencilO style={{ fontSize: 16 }} />,
      },
      {
        label: t('232203', '删除'),
        key: 'delete',
        icon: <DeleteOutlined style={{ fontSize: 16 }} />,
        danger: true,
      },
    ],
    onClick: ({ key, domEvent }) => {
      // 阻止事件冒泡，防止触发 onActiveChange
      console.log('🚀 ~ conversation:', conversation)
      domEvent.stopPropagation()

      if (key === 'delete') {
        if (onDeleteConversation) {
          onDeleteConversation(conversation.key)
          postPointBuried('922610370021')
        } else {
          console.error('onDeleteConversation is not defined')
        }
      }
      if (key === 'rename') {
        if (editingId === conversation.key) {
          return
        }
        postPointBuried('922610370020')
        setEditingId(conversation.key)
      }

      if (key === 'favorite') {
        handleAddFavorite(conversation)
      }
    },
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
          items={itemsList}
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
