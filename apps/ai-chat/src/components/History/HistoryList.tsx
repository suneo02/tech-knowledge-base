import { requestToChat } from '@/api'
import { axiosInstance } from '@/api/axios'
import { CloseO, SearchO } from '@wind/icons'
import { Input, Modal, message } from '@wind/wind-ui'
import { useChatRoomContext, useHistory, useHistoryData } from 'ai-ui'
import { t } from 'gel-util/intl'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { groupConversation } from '../Conversation/handle'
import { HistoryContent } from './HistoryContent'
import styles from './HistoryList.module.less'

// 国际化词条统一管理
const intlMsg = {
  'history-title': t('', '历史对话'),
  'search-placeholder': t('', '搜索历史对话...'),
  'no-content': t('', ''),

  // 删除历史对话
  'select-delete-warning': t('', '请先选择要删除的项目'),
  'confirm-delete': t('', '历史对话删除'),
  'confirm-delete-single': t('', '对话删除后将无法恢复，请确认是否仍要删除？'),
  'confirm-delete-batch': t('', '确定要删除选中的 {count} 项历史对话吗？'),
  'delete-success': t('', '删除成功'),
  'delete-failed': t('', '删除失败'),
  'batch-delete-success': t('', '批量删除成功'),
  'batch-delete-failed': t('', '批量删除失败'),

  // 重命名历史对话
  'rename-title': t('', '历史对话标题修改'),
  'rename-placeholder': t('', '请输入新的对话标题'),
  'rename-success': t('', '重命名成功'),
  'rename-failed': t('', '重命名失败'),
  'rename-confirm': t('', '确认'),
  'rename-cancel': t('', '取消'),
}

// 历史对话列表中选中项的类名
const CLASSNAME_ACTIVE_ITEM = 'ant-conversations-item-active'

export const HistoryList: React.FC = () => {
  const {
    setShowHistory,
    selectedHistoryIds,
    setSelectedHistoryIds,
    isSelectionMode,
    setSelectionMode,
    clearSearch,
    clearSelection,
  } = useHistory()

  // 使用新的 useHistoryData hook 获取数据
  const {
    historyItems,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    removeHistory,
    removeHistories,
    refreshHistory,
    searchKeyword,
    setSearchKeyword,
  } = useHistoryData({
    axiosInstance,
    shouldFetch: true,
  })

  // 过滤后的历史对话项
  const filteredHistoryItems = historyItems

  const { updateRoomId } = useChatRoomContext()

  // 防抖相关状态 - 使用本地状态管理输入框显示
  const [inputValue, setInputValue] = useState(searchKeyword)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null)

  // 防抖搜索处理
  const handleSearch = useCallback(
    (value: string) => {
      // 立即更新输入框显示
      setInputValue(value)

      // 清除之前的定时器
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // 设置新的定时器，500ms 后执行搜索
      debounceTimerRef.current = setTimeout(() => {
        setSearchKeyword(value)
      }, 500)
    },
    [setSearchKeyword]
  )

  // 同步 hook 中的搜索关键词到本地状态
  useEffect(() => {
    setInputValue(searchKeyword)
  }, [searchKeyword])

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // 处理历史对话点击
  const handleHistoryClick = useCallback(
    (key: string, index?: number) => {
      updateRoomId(key, index)

      setShowHistory(false)

      // 历史列表滚动到选中项
      requestAnimationFrame(() => {
        const activeItem = document.querySelector(`.${CLASSNAME_ACTIVE_ITEM}`)
        if (activeItem) {
          activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      })
    },
    [updateRoomId, setShowHistory]
  )

  // 当选中项变化时，自动更新选择模式
  useEffect(() => {
    if (selectedHistoryIds.length > 0 && !isSelectionMode) {
      setSelectionMode(true)
    } else if (selectedHistoryIds.length === 0 && isSelectionMode) {
      setSelectionMode(false)
    }
  }, [selectedHistoryIds, isSelectionMode, setSelectionMode])

  // 处理选择项目
  const handleSelectItem = useCallback(
    (groupId: string) => {
      if (selectedHistoryIds.includes(groupId)) {
        setSelectedHistoryIds(selectedHistoryIds.filter((id) => id !== groupId))
      } else {
        setSelectedHistoryIds([...selectedHistoryIds, groupId])
      }
    },
    [selectedHistoryIds, setSelectedHistoryIds]
  )

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedHistoryIds.length === 0) {
      message.warning(intlMsg['select-delete-warning'])
      return
    }

    Modal.confirm({
      title: intlMsg['confirm-delete'],
      content: intlMsg['confirm-delete-batch'].replace('{count}', selectedHistoryIds.length.toString()),
      onOk: async () => {
        await removeHistories(selectedHistoryIds)
      },
    })
  }

  // 处理单个删除
  const handleSingleDelete = useCallback(
    (groupId: string) => {
      Modal.confirm({
        title: intlMsg['confirm-delete'],
        content: intlMsg['confirm-delete-single'],
        onOk: async () => {
          await removeHistory(groupId)
        },
      })
    },
    [removeHistory]
  )

  // 确认重命名
  const handleConfirmRename = useCallback(
    async (groupId: string, newTitle: string) => {
      if (!newTitle.trim()) {
        message.warning(intlMsg['rename-placeholder'])
        return
      }

      try {
        const response = await requestToChat('updateChatGroup', {
          groupId: groupId,
          title: newTitle.trim(),
        })

        if (response) {
          message.success(intlMsg['rename-success'])
          // 重新加载历史对话列表
          await refreshHistory()
        } else {
          message.error(intlMsg['rename-failed'])
        }
      } catch (error) {
        console.error('重命名失败:', error)
        message.error(intlMsg['rename-failed'])
      }
    },
    [refreshHistory]
  )

  // 处理重命名
  const handleRename = useCallback(
    (groupId: string, currentTitle: string) => {
      let inputValue = currentTitle

      Modal.confirm({
        title: intlMsg['rename-title'],
        content: (
          <Input
            placeholder={intlMsg['rename-placeholder']}
            defaultValue={currentTitle}
            onChange={(e) => {
              inputValue = e.target.value
            }}
            onPressEnter={() => {
              handleConfirmRename(groupId, inputValue)
            }}
            autoFocus
          />
        ),
        onOk: () => handleConfirmRename(groupId, inputValue),
        onCancel: () => {},
        okText: intlMsg['rename-confirm'],
        cancelText: intlMsg['rename-cancel'],
      })
    },
    [handleConfirmRename]
  )

  // 重置状态
  const reset = () => {
    setSelectedHistoryIds([])
    setHoveredItemId(null)
    setSelectionMode(false)
    setShowHistory(false)
  }

  // 处理关闭历史搜索
  const handleClose = () => {
    reset()
    clearSearch()
  }

  // 分组处理历史对话项
  const groupedHistoryItems = useMemo(() => {
    return filteredHistoryItems.map((item) => ({
      ...groupConversation(item),
    }))
  }, [filteredHistoryItems])

  // 处理悬浮状态变化
  const handleHoverChange = useCallback((groupId: string | null) => {
    setHoveredItemId(groupId)
  }, [])

  return (
    <div className={styles.history}>
      <div className={styles['history-header']}>
        <div className={styles['history-title-row']}>
          <h2 className={styles['history-title']}>{intlMsg['history-title']}</h2>
          <div className={styles['history-actions']}>
            <CloseO
              style={{ fontSize: 24 }}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onClick={handleClose}
            />
          </div>
        </div>
        <div className={styles['history-search']}>
          <Input
            placeholder={intlMsg['search-placeholder']}
            className={styles['history-search-input']}
            value={inputValue}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={
              <SearchO style={{ fontSize: 20 }} onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />
            }
            allowClear
          />
        </div>
      </div>
      <HistoryContent // @ts-expect-error
        groupedHistoryItems={groupedHistoryItems}
        searchKeyword={searchKeyword}
        loadingState={{
          loading,
          loadingMore,
          hasMore,
        }}
        selectionState={{
          isSelectionMode,
          selectedHistoryIds,
          hoveredItemId,
        }}
        handlers={{
          onHistoryClick: handleHistoryClick,
          onSelectItem: handleSelectItem,
          onSingleDelete: handleSingleDelete,
          onRename: handleRename,
          onHoverChange: handleHoverChange,
          onLoadMore: loadMore,
          onClearSelection: clearSelection,
          onBatchDelete: handleBatchDelete,
        }}
      />
    </div>
  )
}
