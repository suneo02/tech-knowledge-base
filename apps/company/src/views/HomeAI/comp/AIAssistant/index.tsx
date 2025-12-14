import { t } from 'gel-util/intl'
import React, { useMemo } from 'react'
import ChatInput from '../ChatInput'
import AIHeader from './AIHeader.tsx'
import CommonQuestions from './CommonQuestions.tsx'
import styles from './style/index.module.less'

import { entWebAxiosInstance } from '@/api/entWeb/index.ts'
import { getWebAIChatLinkWithIframe } from '@/handle/link/WebAI'
import { message } from '@wind/wind-ui'
import { postPointBuriedWithAxios } from 'gel-api'

const intlMsg = {
  morning: t('455534', '上午好'),
  noon: t('455515', '中午好'),
  evening: t('455535', '晚上好'),
  question: t('455516', '请问有什么可以帮您?'),
}

export const AIAssistant: React.FC = () => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      return intlMsg.morning
    } else if (hour >= 12 && hour < 18) {
      return intlMsg.noon
    } else {
      return intlMsg.evening
    }
  }, [])

  const handleSend = (inputValue: string, deepthink: boolean) => {
    if (!inputValue.trim()) {
      return message.warning(t('421565', '请输入内容'))
    }
    postPointBuriedWithAxios(entWebAxiosInstance, '922610370001')
    const link = getWebAIChatLinkWithIframe({
      initialMsg: inputValue.trim(),
      initialDeepthink: deepthink ? '1' : undefined,
    })
    window.open(link, '_blank')
  }
  return (
    <div className={styles.aiAssistant}>
      <div className={styles.content}>
        <AIHeader />
        <ChatInput
          placeholder={`${greeting}${window.en_access_config ? ',' : '，'} ${intlMsg.question}`}
          onSend={handleSend}
          data-uc-id="FtHVbJUNj"
          data-uc-ct="chatinput"
        />
      </div>
      <CommonQuestions />
    </div>
  )
}
