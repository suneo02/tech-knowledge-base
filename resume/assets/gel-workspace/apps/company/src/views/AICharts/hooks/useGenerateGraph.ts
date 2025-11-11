import { useCallback, useEffect, useRef, useState } from 'react'
import { getRandomId, getSaveModifiedGraphParams, getSaveModifiedGraphQuestion } from '../utils'
import { AIGRAPH_SEND_TYPE_KEYS } from '../contansts'
import { t } from 'gel-util/intl'
import { useAIChartsStore } from '../store'
import {
  createAiGraphChat,
  getAiGraphChatResponse,
  postAiGraphChatPoint,
  postAiGraphMessage,
  saveModifiedGraph,
} from '@/api/ai-graph'
import useCancelFetch from './useCancelFetch'
import { useAIChartData } from './useChartData'
import { ROBOT_LONG_WAIT_MESSAGE_ID, ROBOT_THINKING_MESSAGE_ID } from '../comp/AiChat/constant'
import { AIGRAPH_EXCEL_SHEET_KEYS } from '../types'

const useGenerateGraph = () => {
  const { abortControllerRef, chatMessageIdRef } = useAIChartData()
  const {
    activeChatId,
    setActiveChatId,
    currentVersion,
    setCurrentVersion,
    setTotalVersionCount,
    fetchingStatus,
    setFetchingStatus,
    chatMessageList,
    replaceLastChatMessage,
    addChatMessageItems,
    handleUpdateChartDataMap,
    handleRefreshHistoryChatListAfterChatResponse,
    setEditMode,
    changedTableValueMap,
    getCurrentChartData,
    setAiGraphRightActiveTabKey,
  } = useAIChartsStore()
  const { handleStartFetch, handleCancelFetch } = useCancelFetch()
  const pollingChatResIntervalRef = useRef<NodeJS.Timeout>()

  const [chatInputVal, setChatInputVal] = useState('')

  // 导入Excel相关
  const [excelTaskId, setExcelTaskId] = useState('')
  const [excelFileList, setExcelFileList] = useState([])

  // 导入Markdown相关
  const [markdownTaskId, setMarkdownTaskId] = useState('')
  const [markdownTitle, setMarkdownTitle] = useState('')
  const [markdownText, setMarkdownText] = useState('')

  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [])

  const handleUploadMarkdownConfirm = (data: any) => {
    setMarkdownTaskId(data.markdownTaskId || '')
    setMarkdownTitle(data.markdownTitle || '')
    setMarkdownText(data.markdownText || '')
    setExcelTaskId('')
    setExcelFileList([])
  }

  const handleUploadExcelConfirm = (data: any) => {
    setExcelTaskId(data.taskId || '')
    setExcelFileList(data.fileList || [])
    setChatInputVal('')
    setMarkdownTaskId('')
    setMarkdownTitle('')
  }

  // 上传文件modal点击确定,isGenerateDirectly表示是否直接生成图谱（否表示先上传到输入框中，点击发送再生成）
  const handleUploadModalConfirm = useCallback((data: any, isGenerateDirectly?: boolean) => {
    if (data.type === AIGRAPH_SEND_TYPE_KEYS.MARKDOWN) {
      if (isGenerateDirectly) {
        handleGenerateGraph({
          markdownTaskId: data.markdownTaskId,
          markdownTitle: data.markdownTitle,
          markdownText: data.markdownText,
        })
        return
      }
      handleUploadMarkdownConfirm(data)
    } else if (data.type === AIGRAPH_SEND_TYPE_KEYS.EXCEL) {
      if (isGenerateDirectly) {
        handleGenerateGraph({
          excelTaskId: data.taskId,
          excelFileList: data.fileList,
        })
        return
      }
      handleUploadExcelConfirm(data)
    }
  }, [])

  const clearUploadFileModalData = useCallback(() => {
    setExcelTaskId('')
    setExcelFileList([])
    setMarkdownTaskId('')
    setMarkdownTitle('')
    setChatInputVal('')
    setMarkdownText('')
  }, [])

  const deleteExcelFile = useCallback(() => {
    setExcelTaskId('')
    setExcelFileList([])
  }, [])

  const deleteMarkdownFile = useCallback(() => {
    setMarkdownTaskId('')
    setMarkdownTitle('')
  }, [])

  // 发送对话的问题
  const getQuestion = (msgList: any[], chatInputVal: string, requestId?: string, taskId?: string) => {
    let question = requestId
      ? msgList.find((msg) => msg.requestId === requestId && msg.role === 1)?.content
      : chatInputVal
    // 上传文件没有输入文本内容时给默认的对话文本
    question = taskId ? question || t('', '请根据我上传的文件内容生成图谱') : question
    return question
  }

  async function createChat() {
    if (activeChatId) {
      return activeChatId
    }
    try {
      const res = await createAiGraphChat()
      if (res.data) {
        setActiveChatId(res.data.id)
        return res.data.id
      }
    } catch (err) {
      return ''
    }
  }

  const handleChatResponse = (res: any, chatId: string, currentRequestId: string, questionSource?: string) => {
    const version = res?.version

    if (version) {
      handleUpdateChartDataMap(chatId, version, res)
      setCurrentVersion(version)
      setTotalVersionCount(version)
    }

    handleRefreshHistoryChatListAfterChatResponse(chatId, version)
    handleUpdateRobotMessage({
      content: res.reply,
      chatId,
      version,
      requestId: currentRequestId,
      questionSource,
    })
  }

  // 当获取图谱生成信息过长（超过1min网关会504）
  const handlePollingChatResponse = (chatId: string, requestId: string, questionSource: string) => {
    const newChatItem = {
      id: ROBOT_LONG_WAIT_MESSAGE_ID,
      role: 2,
    }
    replaceLastChatMessage(newChatItem)

    pollingChatResIntervalRef.current = setInterval(() => {
      getAiGraphChatResponse(chatId, requestId)
        .then((res) => {
          if (res.data.status === 'completed') {
            handleChatResponse(res.data.data, chatId, requestId, questionSource)
            setFetchingStatus({
              type: 'user',
              value: false,
            })
            stopPolling()
          }
        })
        .catch((err) => {
          stopPolling()
        })
    }, 3000)
  }

  // 停止轮询,清除定时器
  const stopPolling = () => {
    if (pollingChatResIntervalRef.current) {
      clearInterval(pollingChatResIntervalRef.current)
      pollingChatResIntervalRef.current = null
    }
  }

  const handleUpdateRobotMessage = ({
    content,
    chatId,
    version,
    requestId,
    questionSource,
  }: {
    content: string
    chatId: string
    version?: number
    requestId?: string
    questionSource?: string
  }) => {
    const newItem = {
      chatId,
      role: 2,
      content,
      id: `msg_${++chatMessageIdRef.current}`, // 使用字符串ID确保唯一性
      version,
      requestId,
      thumbnail: '', // 初始化缩略图为空字符串
      questionSource,
    }
    replaceLastChatMessage(newItem)
  }

  // 文本框对话、文件上传(markdown、excel)
  // requestId和basedVersion存在，表示重新生成之前回答失败的问题
  const handleGenerateGraph = useCallback(
    async ({
      requestId,
      basedVersion,

      chatInputVal,
      excelTaskId,
      excelFileList,
      markdownTaskId,
      markdownTitle,
      markdownText,
    }: {
      requestId?: string
      basedVersion?: number

      chatInputVal?: string
      excelTaskId?: string
      excelFileList?: any[]
      markdownTaskId?: string
      markdownTitle?: string
      markdownText?: string
    }) => {
      handleStartFetch()

      const currentRequestId = getRandomId()
      let taskId = ''
      let attachmentText = ''
      if (excelTaskId) {
        taskId = excelTaskId
        attachmentText = AIGRAPH_SEND_TYPE_KEYS.EXCEL + ':' + excelFileList.map((item) => item.name).join(',')
      } else if (markdownTaskId) {
        taskId = markdownTaskId
        attachmentText = AIGRAPH_SEND_TYPE_KEYS.MARKDOWN + ':' + markdownText
      }
      const question = getQuestion(chatMessageList, chatInputVal, requestId, taskId)

      clearUploadFileModalData()
      setFetchingStatus({
        type: taskId ? 'upload' : 'user',
        value: true,
      })
      const questionSource = !!taskId ? 'upload' : 'user'
      try {
        const chatId = await createChat()
        addChatMessageItems([
          {
            id: ++chatMessageIdRef.current,
            role: 1,
            content: question,
            requestId: currentRequestId,
            excelFileList,
            markdownTitle,
            markdownText,
          },
          {
            id: ROBOT_THINKING_MESSAGE_ID,
            role: 2,
          },
        ])
        postAiGraphChatPoint('提问', question)
        const res = await postAiGraphMessage({
          chatId: chatId,
          content: question,
          abortSignal: abortControllerRef.current?.signal,
          version: basedVersion || currentVersion, // 重新生成时，基于的version并不一定是currentVersion
          requestId: currentRequestId,
          taskId,
          attachmentText,
        })
        setFetchingStatus({
          type: taskId ? 'upload' : 'user',
          value: false,
        })
        if (res) {
          postAiGraphChatPoint('回答', JSON.stringify(res))
          handleChatResponse(res, chatId, currentRequestId, questionSource)
        }
      } catch (err) {
        // 请求超时，重新发起轮询请求，请求答复
        if (err.code === 'ECONNABORTED' && (err.message || '').includes('timeout')) {
          handlePollingChatResponse(activeChatId, currentRequestId, questionSource)
          return
        }
        setFetchingStatus({
          type: taskId ? 'upload' : 'user',
          value: false,
        })
        if (err.name === 'CanceledError') {
          handleUpdateRobotMessage({
            content: t('', '智能助手已停止回答。如有需要，请随时重新提问'),
            chatId: activeChatId,
            requestId: currentRequestId,
            questionSource,
          })
        }
      } finally {
        // 只有最后一个活动的控制器需要清除
        // if (abortControllerRef.current === abortController) {
        //   abortControllerRef.current = null
        // }
      }
    },
    [chatMessageList, currentVersion]
  )

  // 数据表格编辑保存更新图谱
  const handleModifyChartSheetData = useCallback(async () => {
    setEditMode(false)
    const currentChartData = getCurrentChartData()
    try {
      const question = getSaveModifiedGraphQuestion(changedTableValueMap)
      const params = getSaveModifiedGraphParams(currentChartData, changedTableValueMap)
      addChatMessageItems([
        {
          id: ++chatMessageIdRef.current,
          role: 1,
          content: question,
        },
        {
          id: ROBOT_THINKING_MESSAGE_ID,
          role: 2,
        },
      ])
      setFetchingStatus({
        type: 'modify',
        value: true,
      })
      handleStartFetch()
      const res = await saveModifiedGraph({
        chatId: activeChatId,
        version: currentVersion,
        question,
        // abortSignal: abortControllerRef.current?.signal,
        ...params,
      })
      setFetchingStatus({
        type: 'modify',
        value: false,
      })
      if (res.data) {
        handleChatResponse(res.data, activeChatId, undefined, 'modify')
        setAiGraphRightActiveTabKey(AIGRAPH_EXCEL_SHEET_KEYS.GRAPH)
      }
    } catch (err) {
      console.log('err', err)
      if (err.name === 'CanceledError') {
        handleUpdateRobotMessage({
          content: '智能助手已停止回答。如有需要，请随时重新提问',
          chatId: activeChatId,
          questionSource: 'modify',
        })
      }
      setFetchingStatus({
        type: 'modify',
        value: false,
      })
    }
  }, [getCurrentChartData, changedTableValueMap, activeChatId, currentVersion])

  const handleGenerateChartByMarkdown = useCallback(() => {}, [])

  return {
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
    handleModifyChartSheetData,
    handleCancelFetch,

    handleUploadModalConfirm,
  }
}

export default useGenerateGraph
