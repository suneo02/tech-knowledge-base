import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Spin, message } from '@wind/wind-ui'
import styles from './index.module.less'
import MessageItem from './message-item'
import {
  getAiGraphHistoryGraph,
  getAiGraphHistoryMessage,
  giveLikeOrDislike,
  cancelAiGraphChat,
  getAiGraphThumbnail,
  exploreAiGraphAgent,
} from '@/api/ai-graph'
import { useUpdateEffect } from 'ahooks'
import { InitialMsgList } from './constant'
import NoData from '@/components/common/noData/NoData'
import { AIGRAPH_EXCEL_SHEET_KEYS } from '../../types'
import FeedbackModal from './feedback-modal'
import { Sender } from './sender'
import HistoryPanelWrapper from './history-panel-wrapper'
import { useAIGraph } from '../../context'
import { t } from 'gel-util/intl'
import useGenerateGraph from '../../hooks/useGenerateGraph'
import { useAIChartsStore } from '../../store'
import { localStorageManager } from '@/utils/storage'
import { AI_GRAPH_TYPE } from '../../contansts'
import { getUrlSearchValue } from 'gel-util/common'
import { AI_GRAPH_ENTITY_TYPE, AI_GRAPH_ENTITY_TYPE_QUESTION } from '../../contansts'

interface AiChatProps {
  handleCancelSummary?: () => void
}

const AiChat: React.FC<AiChatProps> = (props) => {
  const { handleCancelSummary } = props
  const { setUpdateMessageThumbnail } = useAIGraph()
  const msgListRef = useRef<HTMLDivElement>()
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false)
  const dislikeInfo = useRef({ answer: '', requestId: '' })
  const [modalVisible, setModalVisible] = useState(false)
  const [messageListFetching, setMessageListFetching] = useState(false)
  const tempHiddenSender = true // 第一版AI图谱暂时隐藏文本输入框
  const chatIdFromAgent = getUrlSearchValue('chatid')
  const entityType = getUrlSearchValue('entityType')
  const entityId = getUrlSearchValue('entityId')
  const entityName = encodeURIComponent(getUrlSearchValue('entityName'))

  const {
    historyPanelShow,
    fetchingStatus,
    currentVersion,
    activeChatId,
    setActiveChatId,
    getCurrentChartData,
    chatMessageList,
    setChatMessageList,
    setTotalVersionCount,
    setCurrentVersion,
    setFetchingStatus,
    handleUpdateChartDataMap,
    resetAiChatStatus,
    setAiGraphRightActiveTabKey,
    updateChatMessageThumbnail,
  } = useAIChartsStore()
  const {
    chatInputVal,
    setChatInputVal,
    markdownTitle,
    markdownTaskId,
    markdownText,
    excelTaskId,
    excelFileList,
    deleteExcelFile,
    deleteMarkdownFile,
    handleGenerateGraph,
    handleCancelFetch,
    handleUploadModalConfirm,
  } = useGenerateGraph()

  // 设置更新消息缩略图的回调函数
  useEffect(() => {
    const updateMessageThumbnail = (messageId: string, thumbnail: string, chatId: string, version: number) => {
      updateChatMessageThumbnail(messageId, thumbnail)
    }
    setUpdateMessageThumbnail(updateMessageThumbnail)

    // 清理函数
    return () => {
      setUpdateMessageThumbnail(null)
    }
  }, [])

  // 从入口页发送消息跳转过来，自动请求数据
  useEffect(() => {
    const localData = localStorageManager.get('gel_ai_graph_content')
    const parsedLocalData = localData ? JSON.parse(localData) : null
    const senderInfo = parsedLocalData?.[AI_GRAPH_TYPE.AI_GRAPH_SENDER]
    if (senderInfo) {
      handleGenerateGraph(senderInfo)
      localStorageManager.remove('gel_ai_graph_content')
    }
  }, [])

  useEffect(() => {
    if (chatIdFromAgent) {
      handleHistoryClick(chatIdFromAgent)
    }
  }, [chatIdFromAgent])

  useEffect(() => {
    if (entityType && entityId) {
      handleExploreAiGraphAgent(entityType, entityId)
    }
  }, [entityType, entityId])

  useUpdateEffect(() => {
    const currentChartData = getCurrentChartData()
    if (currentVersion && !currentChartData) {
      getHistoryGraph(activeChatId, currentVersion)
    }
  }, [currentVersion, getCurrentChartData])

  // 初始在消息顶部，当消息更新时自动滚动到底部
  useUpdateEffect(() => {
    if (msgListRef.current) {
      // 使用 requestAnimationFrame 确保渲染完成
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (msgListRef.current) {
            // 使用滚动到最后一个子元素
            const lastChild = msgListRef.current.lastElementChild
            if (lastChild) {
              lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' })
            }
          }
        })
      })
    }
  }, [chatMessageList, markdownTitle, excelFileList])

  async function handleExploreAiGraphAgent(entityType: string, entityId: string) {
    // const res = await exploreAiGraphAgent({
    //   entityType,
    //   entityId,
    //   question: entityName + AI_GRAPH_ENTITY_TYPE_QUESTION[entityType],
    // })
  }

  // 对话消息
  async function getHistoryMessageList(historyChatId: string) {
    setMessageListFetching(true)
    try {
      const res = await getAiGraphHistoryMessage(historyChatId)
      setMessageListFetching(false)
      if (!res.data) {
        return
      }
      const records = res?.data?.records || []
      // 获取图谱缩略图
      // 等所有 getAiGraphThumbnail 请求都处理完再 setMsgList
      const thumbnailPromises = records.map(async (item) => {
        if (item?.role === 2 && item?.thumbnailKey) {
          try {
            const thumbRes = await getAiGraphThumbnail({
              resourceId: item.thumbnailKey,
              resourceName: item?.thumbnailName,
            })
            const thumbnail = thumbRes?.data?.data
            if (thumbnail?.startsWith('data:image')) {
              item.thumbnail = thumbnail
            } else {
              item.thumbnail = 'data:image/jpeg;base64,' + thumbnail
            }
          } catch (e) {
            item.thumbnail = undefined
          }
        }
        return item
      })

      await Promise.all(thumbnailPromises)
      setChatMessageList([...InitialMsgList, ...records])

      // 点击历史chat，默认展示最后一个版本数据
      const lastVersion = res.data.latestVersion
      setTotalVersionCount(lastVersion)
      setCurrentVersion(lastVersion)
    } catch (err) {
      setMessageListFetching(false)
    }
  }

  async function getHistoryGraph(historyChatId: string, version: number) {
    try {
      setFetchingStatus({
        value: true,
      })
      const res = (await getAiGraphHistoryGraph(historyChatId, version)) as any
      setFetchingStatus({
        value: false,
      })
      if (!res) {
        return
      }
      handleUpdateChartDataMap(historyChatId, version, res)
    } catch (err) {
      setFetchingStatus({
        value: false,
      })
    }
  }

  const handleAddNewChat = useCallback(() => {
    if (fetchingStatus.value) {
      return
    }
    resetAiChatStatus()
  }, [fetchingStatus])

  function handleRefreshClick(requestId: string, basedVersion?: number) {
    handleGenerateGraph({ requestId, basedVersion })
  }

  function handleSendChatMessage() {
    if (fetchingStatus.value) {
      return
    }
    if (!chatInputVal.trim() && !excelTaskId && !markdownTaskId) {
      return
    }
    handleGenerateGraph({ chatInputVal, excelTaskId, excelFileList, markdownTaskId, markdownTitle, markdownText })
  }

  async function handleLikeClick(answer: string, requestId: string) {
    const question = chatMessageList.find((msg) => msg.role === 1 && msg.requestId === requestId)?.content
    try {
      const res = (await giveLikeOrDislike({
        answer,
        question,
        appraise: '赞',
        detailedFeedback: '无',
        feedbackType: '无',
      })) as unknown as { message: string; success: boolean }
      if (res.success) {
        message.success(res.message)
      }
    } catch (err) {
      message.error('反馈失败')
    }
  }

  function handleDislikeClick(answer: string, requestId: string) {
    dislikeInfo.current.answer = answer
    dislikeInfo.current.requestId = requestId
    setFeedbackModalVisible(true)
  }

  async function handleSubmitFeedback(feedbackVal: string, feedbackType: string) {
    const { answer, requestId } = dislikeInfo.current
    const question = chatMessageList.find((msg) => msg.role === 1 && msg.requestId === requestId)?.content
    setFeedbackModalVisible(false)
    try {
      const res = (await giveLikeOrDislike({
        answer,
        question,
        appraise: '踩',
        detailedFeedback: feedbackVal || '无',
        feedbackType: feedbackType || '无',
      })) as unknown as { message: string; success: boolean }
      console.log(res)
      if (res.success) {
        message.success(res.message)
      }
    } catch (err) {
      message.error('反馈失败')
    }
  }

  const handleHistoryClick = useCallback(
    (id: string) => {
      if (!id) {
        resetAiChatStatus()
        return
      }
      setActiveChatId(id)
      setAiGraphRightActiveTabKey(AIGRAPH_EXCEL_SHEET_KEYS.GRAPH)

      if (fetchingStatus.value) {
        setFetchingStatus({ value: false })
      }
      handleCancelFetch()
      getHistoryMessageList(id)
      setCurrentVersion(0) // 初始化版本号
    },
    [fetchingStatus]
  )

  function handleCancelFetchClick() {
    if (fetchingStatus.type === 'summary') {
      handleCancelSummary()
      return
    }
    handleCancelFetch()
    cancelAiGraphChat()
  }

  function renderHistoryPanel(position: 'left' | 'top') {
    return (
      <HistoryPanelWrapper
        key={position}
        handleAddNewChat={handleAddNewChat}
        handleHistoryClick={handleHistoryClick}
        position={position}
      />
    )
  }

  const handleModalCancel = useCallback(() => {
    setModalVisible(false)
  }, [])

  const handleModalVisible = useCallback((bol) => {
    setModalVisible(bol)
  }, [])

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {renderHistoryPanel('left')}

      {activeChatId && (
        <div className={styles.chatMessageRoot}>
          {/* {!historyPanelShow && renderHistoryPanel('top')} */}
          <div className={styles.chatBox}>
            {!messageListFetching && chatMessageList.length > 0 && (
              <div className={styles.recordsBox} ref={msgListRef}>
                {chatMessageList.map((item, index) => {
                  return (
                    <MessageItem
                      key={`${item.id}-${item.requestId}-${item.role}`}
                      {...item}
                      fetching={fetchingStatus.value}
                      isActiveVersion={currentVersion === item.version}
                      thumbnail={item.thumbnail} // 传递缩略图属性
                      handleVersionImgClick={(version) => setCurrentVersion(version)}
                      handleRefreshClick={() => handleRefreshClick(item.requestId, item.baseVersion)}
                      handleLikeClick={() => handleLikeClick(item.content, item.requestId)}
                      handleDislikeClick={() => handleDislikeClick(item.content, item.requestId)}
                    />
                  )
                })}
              </div>
            )}
            {messageListFetching && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '200px 0' }}>
                <Spin tip="loading" size="small" />
              </div>
            )}
          </div>
          {!tempHiddenSender && (
            <Sender
              value={chatInputVal}
              onChange={(val) => setChatInputVal(val)}
              onSend={handleSendChatMessage}
              onCancel={handleCancelFetchClick}
              fetching={fetchingStatus.type && fetchingStatus.type !== 'modify' && fetchingStatus.value}
              onModalConfirm={(data) => {
                handleUploadModalConfirm(data)
                setModalVisible(false)
              }}
              onModalCancel={handleModalCancel}
              modalVisible={modalVisible}
              onModalVisible={handleModalVisible}
              excelTaskId={excelTaskId}
              excelFileList={excelFileList}
              markdownTaskId={markdownTaskId}
              markdownTitle={markdownTitle}
              disabled={!!markdownTitle || !!excelFileList?.length}
              onDeleteExcelFile={deleteExcelFile}
              onDeleteMarkdown={deleteMarkdownFile}
              fileUpload={true}
            />
          )}
          <div className={styles.AiTips}>{t('453642', '内容由AI生成，请核查重要信息')}</div>
        </div>
      )}

      <FeedbackModal
        visible={feedbackModalVisible}
        handleClose={() => setFeedbackModalVisible(false)}
        handleSubmit={handleSubmitFeedback}
      />
    </div>
  )
}

export default AiChat
