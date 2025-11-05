import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Input, Button } from '@wind/wind-ui'
import { StopCircleO, InputF, TimesequenceO, PlusO } from '@wind/icons'
import styles from './index.module.less'
import MessageItem from './message-item'
import { InitialMsgList } from './mock'
import { createAiGraphChat, getAiGraphHistoryGraph, getAiGraphHistoryMessage, postAiGraphMessage } from '../../../api/ai-graph'
import { cloneDeep } from 'lodash'
import { parseSSEEvent } from '../../../api/ai-graph/stream'
import { useUpdateEffect } from 'ahooks'
import { ROBOT_THING_MESSAGE_ID } from './constant'
import HistoryRecords from './history-records'
import classNames from 'classnames'
import { useAIChartData } from '../../AICharts/hooks/useChartData'

const { TextArea } = Input

interface AiChartProps {
  chatId?: string // 历史记录chartId
}

const AiChart: React.FC<AiChartProps> = (props) => {
  const [chatInputVal, setChatInputVal] = useState('')
  const [msgList, setMsgList] = useState<any[]>(InitialMsgList)
  const msgListRef = useRef<HTMLDivElement>()
  const msgIdRef = useRef(0)
  const abortControllerRef = React.useRef(null)
  const [historyRecordsShow, setHistoryRecordsShow] = useState(false)

  const { fetching, setFetching, chatData, setChatData, chatId, setChatId, historyChatId, setHistoryChatId } = useAIChartData()

  // 1. 监听 props.chatId 变化，优先同步到 context
  useEffect(() => {
    if (props.chatId) {
      setChatId(props.chatId)
    }
  }, [props.chatId, setChatId])

  // 2. 如果没有 chatId（props 和 context 都没有），自动创建
  // TODO 自动创建的逻辑要替换成输入消息回车后创建chat
  useEffect(() => {
    if (!props.chatId && !chatId) {
      createChat()
    }
  }, [props.chatId, chatId])

  useEffect(() => {
    if (historyChatId) {
      getHistoryMessageList(historyChatId)
      getHistoryGraph(historyChatId)
    }
  }, [historyChatId])

  async function getHistoryMessageList(historyChatId: string) {
    try {
      const res = await getAiGraphHistoryMessage(historyChatId)
      if (!res.data) {
        return
      }
      setMsgList(res.data.records)
      // setChatId(res.data.ID)
    } catch (err) { }
  }

  async function getHistoryGraph(historyChatId: string) {
    try {
      const res = (await getAiGraphHistoryGraph(historyChatId)) as any
      console.log('getHistoryGraph', res)
      if (!res?.config) {
        return
      }
      setChatData(res)
      console.log('getHistoryGraph', res)
      // setChatId(res.data.ID)
    } catch (err) { }
  }

  async function createChat() {
    try {
      const res = await createAiGraphChat({
        userId: '6535663',
      })
      if (!res.data) {
        return
      }
      setChatId(res.data.id)
    } catch (err) { }
  }

  function handleChange(e) {
    setChatInputVal(e.target.value)
  }

  function processEventCb(text) {
    if (text === 'ABORT') {
      setMsgList((prev) => {
        const copyData = cloneDeep(prev)
        const lastItem = copyData[copyData.length - 1]
        const chartItem = {
          ...lastItem,
          content: '智能助手已停止回答。如有需要，请随时重新提问',
          id: ++msgIdRef.current,
        }
        copyData[copyData.length - 1] = chartItem
        return copyData
      })
      setFetching(false)
      return
    }
    const sseData: any = parseSSEEvent(text)
    if (sseData.event === 'data') {
      console.log('sseData', sseData.data.data)
      setChatData(sseData.data.data)
    }

    if (sseData.event === 'message') {
      const cont = sseData.data.message.content
      // if (sseData.data.message.done) {
      //   setFetching(false)
      //   return
      // }
      setMsgList((prev) => {
        const copyData = cloneDeep(prev)
        const lastItem = copyData[copyData.length - 1]
        const chartItem = {
          ...lastItem,
          content: cont,
          id: ++msgIdRef.current,
        }
        copyData[copyData.length - 1] = chartItem
        return copyData
      })

      setFetching(false)
    }
  }

  async function handleSend() {
    if (!chatInputVal) {
      return
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    setChatInputVal('')

    setMsgList((prev) => {
      const copyData = cloneDeep(prev)
      return [
        ...copyData,
        {
          id: ++msgIdRef.current,
          chatId: chatId,
          role: 1,
          content: chatInputVal,
          createdAt: '2025-05-31',
        },
        {
          id: ROBOT_THING_MESSAGE_ID,
          chatId: chatId,
          role: 2,
          createdAt: '2025-05-31',
        },
      ]
    })
    setFetching(true)
    try {
      const res = await postAiGraphMessage({
        chatId: chatId,
        userId: '6535663',
        content: chatInputVal,
        processEventCb,
        abortSignal: abortController.signal,
      })
    } catch (err) {
      setFetching(false)
    } finally {
      // 只有最后一个活动的控制器需要清除
      // if (abortControllerRef.current === abortController) {
      //   abortControllerRef.current = null
      // }
    }
  }

  const cancelFetch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  // 初始在消息顶部，当消息更新时自动滚动到底部
  useUpdateEffect(() => {
    if (msgListRef.current) {
      msgListRef.current.scrollTo({
        top: msgListRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [msgList])

  const handleKeyDown = (e) => {
    // 检查是否按下Enter键，且没有同时按下Shift键
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // 阻止默认换行行为
      handleSend() // 触发发送
    }
  }

  function handleAddNewChat() {
    setChatId('')
    setHistoryChatId('')
    setMsgList(InitialMsgList)
  }

  function handleHistoryClick(id: string) {
    setHistoryChatId(id)
    setHistoryRecordsShow(false)
  }

  return (
    <div className={styles.root}>
      <div className={styles.chatBox}>
        <div className={styles.topBox}>
          <div
            className={styles.historyBox}
            onMouseEnter={() => {
              setHistoryRecordsShow(true)
            }}
            onMouseLeave={() => {
              setHistoryRecordsShow(false)
            }}
          >
            <Button
              type="text"
              icon={<TimesequenceO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            />
            <div
              className={classNames(styles.historyList, historyRecordsShow ? styles.historyOpen : styles.historyClose)}
            >
              <HistoryRecords handleClick={handleHistoryClick} />
            </div>
          </div>
          <Button
            icon={<PlusO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            className={styles.addBtn}
            onClick={handleAddNewChat}
          >
            新建对话
          </Button>
        </div>
        <div className={styles.recordsBox} ref={msgListRef}>
          {msgList.map((item) => (
            <MessageItem key={item.id} {...item} fetching={fetching} />
          ))}
        </div>
      </div>
      <div className={styles.chatInputBox}>
        <TextArea
          placeholder="描述您想要生成的企业相关图片，支持上传数据生成图谱"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={3}
          value={chatInputVal}
          style={{ height: 109 }}
          className={styles.input}
        />

        {fetching && (
          <div className={styles.stopBox}>
            <Button
              type="text"
              icon={<StopCircleO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              onClick={cancelFetch}
            >
              停止思考
            </Button>
          </div>
        )}
        <Button
          type="text"
          icon={<InputF onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          disabled={!chatInputVal}
          className={styles.sendBtn}
          onClick={handleSend}
        />
      </div>
    </div>
  )
}

export default AiChart
