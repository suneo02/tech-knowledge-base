import React, { useMemo } from 'react'

import { deleteAiGraphChat, editAiGraphChatTitle } from '@/api/ai-graph'
import styles from './index.module.less'
import { categorizeByTime } from '../utils'
import RecordItem from './record-item'
import { Spin } from '@wind/wind-ui'
import { useAIChartsStore } from '@/views/AICharts/store'
import useChatList from '@/views/AICharts/hooks/useChatList'

interface HistoryRecordsProps {
  handleClick: (chatId: string) => void
  activeHistoryChatId?: string
  isHoverPanel?: boolean
  // hasMore: boolean
}

const HistoryRecords: React.FC<HistoryRecordsProps> = (props) => {
  const { handleClick, activeHistoryChatId, isHoverPanel } = props
  const { historyChatList: list, updateChatTitle, deleteChatByChatId, historyPanelShow } = useAIChartsStore()
  const { listContainerRef, loading } = useChatList(historyPanelShow, handleClick)

  const newList = useMemo(() => {
    if (!list) {
      return {}
    }
    return categorizeByTime(list)
  }, [list])

  async function handleSubmitEdit(chatId: string, title: string) {
    try {
      const res = await editAiGraphChatTitle(chatId, title)
      updateChatTitle(chatId, title)
    } catch (err) {}
  }

  async function handleDeleteChat(chatId: string) {
    try {
      const res = await deleteAiGraphChat(chatId)
      deleteChatByChatId(chatId)
      if (chatId === activeHistoryChatId) {
        handleClick(list.filter((n) => n.chatId !== chatId)[0]?.chatId)
      }
    } catch (err) {}
  }

  return (
    <div className={styles.list} ref={listContainerRef}>
      {list?.length > 0 &&
        Object.keys(newList).map((key) => {
          if (newList[key].list.length === 0) {
            return null
          }
          return (
            <div key={key} className={styles.timeGap} style={isHoverPanel ? { paddingLeft: 16 } : {}}>
              <p className={styles.timeGapTitle}>{newList[key].label}</p>
              {newList[key].list.map((l) => {
                return (
                  <RecordItem
                    key={l.chatId}
                    {...l}
                    handleClick={handleClick}
                    activeHistoryChatId={activeHistoryChatId}
                    handleSubmitEdit={(title: string) => handleSubmitEdit(l.chatId, title)}
                    handleDeleteChat={() => handleDeleteChat(l.chatId)}
                  />
                )
              })}
            </div>
          )
        })}

      {!list?.length && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '200px 0' }}>
          {!loading && list?.length === 0 ? '暂无数据' : ''}
          {loading && <Spin tip="loading" size="small" />}
        </div>
      )}
      {/* {!loading && !hasMore && <div>没有更多数据了</div>} */}
    </div>
  )
}

export default HistoryRecords
