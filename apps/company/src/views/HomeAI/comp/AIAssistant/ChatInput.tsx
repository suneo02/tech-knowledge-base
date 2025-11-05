import { MyIcon } from '@/components/Icon'
import { getWebAIChatLink } from '@/handle/link/WebAI'
import { Input } from '@wind/wind-ui'
import React, { useMemo, useState } from 'react'
import { setChatInitialMessage } from '../../handle'
import styles from './style/ChatInput.module.less'

const ChatInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('')

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      return '上午好'
    } else if (hour >= 12 && hour < 18) {
      return '中午好'
    } else {
      return '晚上好'
    }
  }, [])

  const handleSend = () => {
    setChatInitialMessage(inputValue.trim())
    const link = getWebAIChatLink()
    window.open(link, '_blank')
    setInputValue('') // Clear input after sending
  }

  return (
    <Input
      className={styles.inputComp}
      placeholder={`${greeting}，请问有什么可以帮您?`}
      size="large"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      suffix={<MyIcon name="AISearchJump" className={styles.sendIcon} onClick={handleSend} />}
      onPressEnter={handleSend}
    />
  )
}

export default ChatInput
