import { t } from 'gel-util/intl'
import { FC } from 'react'
import styles from './index.module.less'

export const RPComment: FC<{
  content: string[]
}> = ({ content }) => {
  return (
    <div className={styles['report-comment']}>
      <div className="report-comment-title">
        <span>{t('451118', '报告说明')}</span>
      </div>
      <div className="report-comment-content">
        {content.map((item, index) => {
          return (
            <div key={index} className="report-comment-line">
              {item}
            </div>
          )
        })}
      </div>
    </div>
  )
}
