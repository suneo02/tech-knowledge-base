import { Empty, Spin } from '@wind/wind-ui'
import classNames from 'classnames'
import { ChatQuestion } from 'gel-api'
import { t } from 'gel-util/intl'
import { FC } from 'react'
import styles from './index.module.less'

interface RecommendQuestionProps {
  questions?: ChatQuestion[]
  className?: string
  onQuestionClick: (question: ChatQuestion) => void
  loading?: boolean
}

const STRINGS = {
  TITLE: t('464115', '你可以试试这样问：'),
  EMPTY_DESC: t('464161', '暂无推荐问题')
}

const QuestionCard = ({ question, onClick }: { question: ChatQuestion; onClick: (q: ChatQuestion) => void }) => (
  <div className={styles.questionCard} onClick={() => onClick(question)}>
    <span className={styles.cardText}>{question.questions}</span>
  </div>
)

export const RecommendQuestion: FC<RecommendQuestionProps> = ({ questions, className, onQuestionClick, loading }) => {
  const hasQuestions = questions && questions.length > 0

  return (
    <div className={classNames(styles.container, className)}>
      <h3 className={styles.title}>{STRINGS.TITLE}</h3>
      {/* @ts-expect-error Wind-ui */}
      <Spin spinning={!!loading}>
        {hasQuestions ? (
          <div className={styles.questionsContainer}>
            {questions.map((q, index) => (
              <QuestionCard key={index} question={q} onClick={onQuestionClick} />
            ))}
          </div>
        ) : (
          <Empty description={STRINGS.EMPTY_DESC} />
        )}
      </Spin>
    </div>
  )
}
