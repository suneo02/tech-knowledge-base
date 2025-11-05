import { t } from 'gel-util/intl'
import React from 'react'
import styles from './index.module.less'

export const RPAppendix: React.FC<{
  content: string[]
}> = ({ content }) => {
  return (
    <>
      <div className={styles['report-appendix-title']}>{t('451098', '附录')}</div>
      {content.map((item, index) => (
        <div key={index} className={styles['report-appendix-line']}>
          {item}
        </div>
      ))}
    </>
  )
}
