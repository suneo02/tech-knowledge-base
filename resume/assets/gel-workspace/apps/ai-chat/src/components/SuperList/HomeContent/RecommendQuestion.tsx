import { SearchWithHighlight } from '@/assets/icon'
import { List } from '@wind/wind-ui'
import { SuperListGradientText } from 'ai-ui'
import classNames from 'classnames'
import { SuperListPresetQuestion } from 'gel-api'
import styles from './style/recommendQuestion.module.less'

interface RecommendQuestionProps {
  className?: string
  questions?: SuperListPresetQuestion[]
  onQuestionClick?: (question: SuperListPresetQuestion) => void
  loading?: boolean
}

export const RecommendQuestion: React.FC<RecommendQuestionProps> = ({
  questions,
  onQuestionClick,
  className,
  loading,
}) => {
  return (
    <div className={classNames(styles['recommend-question'], className)}>
      <h4 className={styles['recommend-question-title']}>
        <SuperListGradientText className={styles['recommend-question-title-text']}>大家都在问</SuperListGradientText>
      </h4>
      <List
        className={styles['recommend-question-list']}
        dataSource={questions}
        loading={loading}
        renderItem={(question) => (
          <List.Item
            className={styles['recommend-question-item']}
            onClick={() => !loading && onQuestionClick?.(question)}
          >
            <SearchWithHighlight />
            <p className={styles['recommend-question-item-text']}>{question.rawSentence}</p>
          </List.Item>
        )}
      />
    </div>
  )
}
