import { DeleteO, RetreatO } from '@wind/icons'
import { Button, Empty, Spin } from '@wind/wind-ui'
import { useDebounceFn, useInViewport } from 'ahooks'
import { ConversationTimeGroup } from 'gel-ui'
import { t } from 'gel-util/intl'
import React, { useEffect, useRef } from 'react'
import styles from './HistoryContent.module.less'
import { HistoryItemList } from './HistoryItemList'

// 国际化词条统一管理
const intlMsg = {
  'no-search-results': t('', '未找到相关历史对话'),
  'no-history': t('', '暂无历史对话'),
  'scroll-load-more': t('', '滚动加载更多'),
  'cancel-button': t('', '取消'),
  'delete-count': t('', '删除({count})'),
  'search-results': t('', '搜索结果'),
}

// 历史项数据类型
export interface HistoryItem {
  id: number
  groupId: string
  title?: string
  answers?: string
  updateTime?: string
  group?: ConversationTimeGroup
  index?: number // 添加索引字段
}

// 加载状态
interface LoadingState {
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
}

// 选择状态
interface SelectionState {
  isSelectionMode: boolean
  selectedHistoryIds: string[]
  hoveredItemId: string | null
}

// 事件处理函数
interface EventHandlers {
  onHistoryClick: (groupId: string, index?: number) => void
  onSelectItem: (groupId: string) => void
  onSingleDelete: (groupId: string) => void
  onRename: (groupId: string, currentTitle: string) => void
  onHoverChange: (groupId: string | null) => void
  onLoadMore: () => void
  onClearSelection: () => void
  onBatchDelete: () => void
}

interface HistoryContentProps {
  // 数据
  groupedHistoryItems: HistoryItem[]
  searchKeyword: string

  // 状态
  loadingState: LoadingState
  selectionState: SelectionState

  // 事件处理
  handlers: EventHandlers
}

export const HistoryContent: React.FC<HistoryContentProps> = ({
  groupedHistoryItems,
  searchKeyword,
  loadingState,
  selectionState,
  handlers,
}) => {
  const { loading, loadingMore, hasMore } = loadingState
  const { isSelectionMode, selectedHistoryIds, hoveredItemId } = selectionState
  const {
    onHistoryClick,
    onSelectItem,
    onSingleDelete,
    onRename,
    onHoverChange,
    onLoadMore,
    onClearSelection,
    onBatchDelete,
  } = handlers

  // 滚动容器引用
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // 使用 ahooks 的 useInViewport 监听加载更多元素
  const [inViewport] = useInViewport(loadingRef, {
    threshold: 0.1,
  })

  // 使用防抖函数防止重复触发
  const { run: debouncedLoadMore } = useDebounceFn(
    () => {
      if (hasMore && !loadingMore) {
        onLoadMore()
      }
    },
    { wait: 300 }
  )

  // 当加载更多元素进入视口时触发防抖加载
  useEffect(() => {
    if (inViewport) {
      debouncedLoadMore()
    }
  }, [inViewport, debouncedLoadMore])

  return (
    <>
      {searchKeyword.trim() && <div className={styles['history-list-results-title']}>{intlMsg['search-results']}</div>}
      <div className={styles['history-list']} ref={scrollContainerRef}>
        {loading && (
          <div className={styles['history-list-loading']}>
            <Spin />
          </div>
        )}
        {groupedHistoryItems.length === 0 && searchKeyword.trim() ? (
          <div className={styles['history-empty']}>
            <Empty style={{ width: '100%' }} description={intlMsg['no-search-results']} />
          </div>
        ) : groupedHistoryItems.length === 0 ? (
          <div className={styles['history-empty']}>
            <Empty description={intlMsg['no-history']} />
          </div>
        ) : (
          <>
            <HistoryItemList
              groupedHistoryItems={groupedHistoryItems}
              searchKeyword={searchKeyword}
              isSelectionMode={isSelectionMode}
              selectedHistoryIds={selectedHistoryIds}
              hoveredItemId={hoveredItemId}
              onHistoryClick={onHistoryClick}
              onSelectItem={onSelectItem}
              onSingleDelete={onSingleDelete}
              onRename={onRename}
              onHoverChange={onHoverChange}
            />
            {hasMore && (
              <div className={styles['history-load-more']} ref={loadingRef}>
                {loadingMore ? <Spin size="small" /> : <Spin size="small" />}
              </div>
            )}
          </>
        )}
      </div>
      {isSelectionMode && (
        <div className={styles['history-footer']}>
          <div className={styles['history-footer-actions']}>
            <Button
              type="text"
              onClick={onClearSelection}
              icon={<RetreatO onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />}
            >
              {intlMsg['cancel-button']}
            </Button>
            {selectedHistoryIds.length > 0 && (
              <Button
                type="text"
                onClick={onBatchDelete}
                icon={<DeleteO onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />}
              >
                {intlMsg['delete-count'].replace('{count}', selectedHistoryIds.length.toString())}
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
