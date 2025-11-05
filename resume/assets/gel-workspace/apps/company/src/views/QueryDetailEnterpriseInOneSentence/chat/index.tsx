import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react'
import './index.less'
import { DeleteOutlined, PlayCircleOutlined, SendOutlined, SyncOutlined } from '@ant-design/icons'
import { parseQueryString } from '@/lib/utils'
import { Button, message as Message, Input } from '@wind/wind-ui'
import { useChatMessages } from '@/views/QueryDetailEnterpriseInOneSentence/useChatMessages'
import CollapsibleInfo from '../components/CollapsibleInfo'
import ChatItem from '../components/ChatItem'
import InputBox from '../components/InputBox'
const { TextArea } = Input
// 定义问答组件类型
interface ChatMessage {
  role: 'user' | 'ai'
  content: string
  id: string
  data?: string[]
}

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
        >
          <DeleteOutlined /> 清空对话
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
                >
                  <path
                    d="M9 17.1A8.1 8.1 0 119 .9a8.1 8.1 0 010 16.2zm0-1.2A6.9 6.9 0 109 2.1a6.9 6.9 0 000 13.8zm-2.9-10h5.8c.11 0 .2.09.2.2v5.8a.2.2 0 01-.2.2H6.1a.2.2 0 01-.2-.2V6.1c0-.11.09-.2.2-.2z"
                    fill-rule="nonzero"
                  ></path>
                </svg>
              </span>
              <span className="text" onClick={() => stopAnswer(chatMessages[chatMessages.length - 1].id)}>
                停止思考
              </span>
            </a>
          </div>
        </div>
      )}
      <InputBox value={inputValue} onChange={(e) => setInputValue(e)} onSubmit={handleSubmit}></InputBox>
      {/* <div className="input-box">
        <div className="input-box-content-wrap">
          <div className="input-mian">
            <TextArea
              className="w-input-chat"
              placeholder="有什么可以帮你？（Shift + Enter 换行）"
              rows={2}
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  handleSubmit(e)
                }
              }}
              style={{ height: '56px' }}
            />
          </div>
        </div>
        <div className="input-left-action">
          <span></span>
          <div className="alice-deepthink-wrap">
            <div>
              <a className="alice-deepmode-btn-active">
                <span className="icon">
                  <span role="img" aria-label="deep-think" className="wicon-svg wicon-deep-think-o">
                    <svg
                      viewBox="0 0 18 18"
                      focusable="false"
                      className=""
                      data-icon="deep-think"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        d="M15.45 2.57c1.23 1.23.69 3.75-1.12 6.44 1.8 2.68 2.35 5.2 1.12 6.43-1.23 1.23-3.75.69-6.43-1.12-2.69 1.8-5.2 2.35-6.44 1.12-1.23-1.23-.69-3.75 1.12-6.43-1.8-2.69-2.35-5.2-1.12-6.44 1.23-1.23 3.75-.69 6.44 1.12 2.68-1.8 5.2-2.35 6.43-1.12zm-1.88 7.48l-.18.22a21.14 21.14 0 01-3.33 3.29c2.02 1.28 3.84 1.74 4.54 1.03.7-.7.25-2.51-1.03-4.54zm-9.1 0l-.09.14c-1.21 1.96-1.64 3.71-.95 4.4.7.7 2.52.25 4.54-1.03a21 21 0 01-3.5-3.5zm4.55-4.87l-.11.08a19.08 19.08 0 00-3.72 3.75 19.02 19.02 0 003.83 3.83A19.02 19.02 0 0012.85 9a19.11 19.11 0 00-3.83-3.83zm.2 2.4l1.23 1.23c.12.12.12.3 0 .41l-1.22 1.23a.29.29 0 01-.41 0L7.59 9.22a.29.29 0 010-.41L8.8 7.58c.12-.11.3-.11.41 0zM3.43 3.42c-.7.7-.24 2.52 1.03 4.54a21 21 0 013.29-3.33l.22-.17C5.95 3.18 4.14 2.7 3.43 3.42zm6.99.82l-.23.13-.13.09a20.92 20.92 0 013.5 3.5c1.29-2.02 1.75-3.83 1.04-4.54-.66-.66-2.3-.3-4.18.82z"
                        fill-rule="nonzero"
                      ></path>
                    </svg>
                  </span>
                </span>
                <span className="name">深度思考(R1)</span>
              </a>
            </div>
            <div className="shortcuts"></div>
          </div>
        </div>
        <div className="input-right-action">
          <a
            id="btnSearch"
            className={`btn-search ${focus && inputValue.trim() ? 'btn-search-focus' : 'btn-search-noFocus'}`}
            title="请输入你的问题"
            onClick={handleSubmit}
          >
            <svg className="send-icon" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <g id="发送图标" stroke="none" stroke-width="1" fill-rule="evenodd">
                <path
                  d="M9.04725812,2.10320803 L8.97687695,2.10066883 L8.90849682,2.11433541 C8.86419061,2.12870648 8.82305902,2.15345565 8.78878324,2.18773142 L3.90148178,7.07287341 L3.85350882,7.13711248 C3.78768628,7.26572296 3.80926233,7.40577674 3.90146615,7.49798057 L4.46880651,8.06532092 L4.53303933,8.11327778 L4.61109434,8.14241226 C4.71573292,8.16763717 4.82010431,8.13909281 4.89387185,8.06535847 L8.298,4.6629156 L8.29956572,15.5518736 L8.30763322,15.6185224 C8.34595106,15.7611756 8.46400707,15.8524429 8.60014436,15.8524429 L9.40249922,15.8524429 L9.47788889,15.8412133 L9.5580022,15.8049857 L9.6211215,15.7527663 C9.67541161,15.696086 9.70309311,15.6267925 9.70307635,15.5518131 L9.702,4.6569156 L13.2165837,8.09696458 L13.2800533,8.14415931 C13.4086547,8.20995864 13.5486835,8.18838826 13.6408857,8.09621024 L14.2082446,7.5288513 L14.256202,7.46462786 C14.3220245,7.33601738 14.3004485,7.19596359 14.2082446,7.10375977 L9.21331362,2.18717468 L9.14965134,2.13977409 L9.0623598,2.10675181 L9.04725812,2.10320803 Z"
                  id="路径"
                  fillRule="nonzero"
                ></path>
              </g>
            </svg>
          </a>
        </div>
      </div> */}
      <div className="input-right-action-text">内容由AI生成，投资有风险，请检查数据和信息的正确性</div>
    </div>
  )
}

export default Chat
