import React from 'react'
import AIHeader from './AIHeader.tsx'
import ChatInput from './ChatInput.tsx'
import CommonQuestions from './CommonQuestions.tsx'
import styles from './style/index.module.less'

export const AIAssistant: React.FC = () => {
  return (
    <div className={styles.aiAssistant}>
      <AIHeader />
      <div className={styles.content}>
        <ChatInput />
        <CommonQuestions />
      </div>
    </div>
  )
}
