import { ChatQuestion } from '@/api/chat/types'
import { request, WIND_CHAT_URL } from '@/api/request'
import { getWebAIChatLinkWithIframe } from '@/handle/link/WebAI'
import { t } from 'gel-util/intl'
import React, { useEffect, useMemo, useState } from 'react'
import styles from './style/CommonQuestions.module.less'

const intlMsg = {
  commonQuestions: t('422034', '大家都在问'),
}
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
    const link = getWebAIChatLinkWithIframe({
      initialMsg: question,
    })
    window.open(link, '_blank')
  }

  const topThreeQuestions = useMemo(() => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 2)
  }, [questions])

  return (
    <div className={styles.commonQuestions}>
      <span className={styles.title}>{intlMsg.commonQuestions}:</span>
      <div className={styles.questionsContainer}>
        {topThreeQuestions.map((question, index) => (
          <div
            key={index}
            className={styles.questionItem}
            onClick={() => handleQuestionClick(question.questions)}
            style={{ cursor: 'pointer' }}
            data-uc-id="cOA6w6duut"
            data-uc-ct="div"
            data-uc-x={index}
          >
            <span>{question.questions}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommonQuestions
