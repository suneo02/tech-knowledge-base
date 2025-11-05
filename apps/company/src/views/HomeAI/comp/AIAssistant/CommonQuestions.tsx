import { ChatQuestion } from '@/api/chat/types'
import { request, WIND_CHAT_URL } from '@/api/request'
import { getWebAIChatLink } from '@/handle/link/WebAI'
import React, { useEffect, useState } from 'react'
import { setChatInitialMessage } from '../../handle'
import styles from './style/CommonQuestions.module.less'

/**
 * CommonQuestions component - Displays the top 3 common questions
 */
const CommonQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<ChatQuestion[]>([])

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await request('getQuestion', {
        serverUrl: WIND_CHAT_URL,
        noExtra: true,
        formType: 'payload',
      })
      setQuestions(res.Data)
    }
    fetchQuestions()
  }, [])

  const handleQuestionClick = (question: string) => {
    setChatInitialMessage(question)
    const link = getWebAIChatLink()
    window.open(link, '_blank')
  }

  // Get only the first three questions
  const topThreeQuestions = questions.slice(0, 3)

  return (
    <div className={styles.commonQuestions}>
      <span className={styles.title}>大家都在问:</span>
      <div className={styles.questionsContainer}>
        {topThreeQuestions.map((question, index) => (
          <div
            key={index}
            className={styles.questionItem}
            onClick={() => handleQuestionClick(question.questions)}
            style={{ cursor: 'pointer' }}
          >
            <span>· {question.questions}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommonQuestions
