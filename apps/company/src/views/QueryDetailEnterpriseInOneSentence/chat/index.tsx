import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react'
import './index.less'
import { DeleteOutlined, PlayCircleOutlined, SendOutlined, SyncOutlined } from '@ant-design/icons'
import { parseQueryString } from '@/lib/utils'
import { Button, message as Message, Input } from '@wind/wind-ui'
import { useChatMessages } from '@/views/QueryDetailEnterpriseInOneSentence/useChatMessages'
import ChatItem from '../components/ChatItem'
import InputBox from '../components/InputBox'
import { t, isEn } from 'gel-util/intl'

export const AI_AVATAR =
  'data:image/png;base64,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'
export const USER_AVATAR =
  'data:image/png;base64,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'

const Chat = (props: { getCropInfo: (data: string[]) => void; clean: () => void }) => {
  const {
    chatMessages,
    inputValue,
    isLoading,
    messagesEndRef,
    data,
    setInputValue,
    scrollToBottom,
    sendMessage,
    handleClearChat,
    handleSubmit,
    handleCopyMessage,
    handleRetry,
    setIsInterrupted,
    stopAnswer,
  } = useChatMessages()
  const [focus, setFocus] = useState(false)

  // 初始化查询参数
  useEffect(() => {
    const qsParam = parseQueryString()
    const question = qsParam.question

    if (question) {
      sendMessage(question)
    }
  }, [sendMessage])

  // 监听消息变化,滚动到底部
  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, isLoading, scrollToBottom])

  useEffect(() => {
    if (!data || data.length === 0) {
      props.clean()
    } else {
      props.getCropInfo(data)
    }
  }, [data])

  return (
    <div className="chat-container">
      <div className="chat-toolbar">
        <button
          className="toolbar-button clear-button"
          onClick={handleClearChat}
          disabled={isLoading || chatMessages.length === 0}
          data-uc-id="XEPyF6WdO"
          data-uc-ct="button"
        >
          <DeleteOutlined /> {isEn() ? 'Clear' : '清空对话'}
        </button>
      </div>
      <div className="chat-messages">
        <ChatItem
          isLoading={isLoading}
          chatMessages={chatMessages}
          handleCopyMessage={handleCopyMessage}
          handleRetry={handleRetry}
        ></ChatItem>
        <div ref={messagesEndRef} />
      </div>
      {isLoading && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', backgroundColor: '#fff' }}>
          <div className="abort-btn chat-page-abort" style={{ bottom: '127px' }}>
            <a title="" className="wui-alice-btn">
              <span role="img" aria-label="stop-circle" className="wicon-svg wicon-stop-circle-o">
                <svg
                  viewBox="0 0 18 18"
                  focusable="false"
                  data-icon="stop-circle"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                  data-uc-id="8RkGgFgLJe"
                  data-uc-ct="svg"
                >
                  <path
                    d="M9 17.1A8.1 8.1 0 119 .9a8.1 8.1 0 010 16.2zm0-1.2A6.9 6.9 0 109 2.1a6.9 6.9 0 000 13.8zm-2.9-10h5.8c.11 0 .2.09.2.2v5.8a.2.2 0 01-.2.2H6.1a.2.2 0 01-.2-.2V6.1c0-.11.09-.2.2-.2z"
                    fill-rule="nonzero"
                  ></path>
                </svg>
              </span>
              <span
                className="text"
                onClick={() => stopAnswer(chatMessages[chatMessages.length - 1].id)}
                data-uc-id="XIG_ZZmR0a"
                data-uc-ct="span"
              >
                {isEn() ? 'Stop' : '停止思考'}
              </span>
            </a>
          </div>
        </div>
      )}
      <InputBox
        value={inputValue}
        onChange={(e) => setInputValue(e)}
        onSubmit={handleSubmit}
        data-uc-id="ghRJObjYLx"
        data-uc-ct="inputbox"
      ></InputBox>
      <div className="input-right-action-text">{t('437625', '内容由AI生成，投资有风险，请检查数据和信息的正确性')}</div>
    </div>
  )
}

export default Chat
