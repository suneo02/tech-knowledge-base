import { Input } from '@wind/wind-ui'
import React, { useState } from 'react'

import { ChatInputSendBtn, DeepThinkBtn } from 'gel-ui'

import styles from './index.module.less'

const ChatInput: React.FC<{
  placeholder?: string
  onSend?: (value: string, deepthink: boolean) => void
  minRows?: number
  maxRows?: number
}> = ({ placeholder = '', onSend, minRows = 2, maxRows = 2 }) => {
  const [inputValue, setInputValue] = useState('')
  const [deepthink, setDeepthink] = useState(false)

  const handleSend = () => {
    onSend?.(inputValue, deepthink)
    setInputValue('')
  }

  return (
    <div className={styles['input-wrap']}>
      <Input.TextArea
        autosize={{ minRows, maxRows }}
        className={styles['input-comp']}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onPressEnter={handleSend}
        data-uc-id="QnaMT_miGe"
        data-uc-ct="input"
      />
      <div className={styles['btn-wrap']}>
        {/* <DeepThinkBtn deepthink={deepthink} onClick={() => setDeepthink(!deepthink)} /> */}
        <div></div>
        <ChatInputSendBtn
          isActive={!!inputValue.trim()}
          onClick={handleSend}
          data-uc-id="fzUV_jyYzU"
          data-uc-ct="chatinputsendbtn"
        />
      </div>
    </div>
  )
}

export default ChatInput
