import classNames from 'classnames'
import React, { FC } from 'react'
import styles from './style/processing.module.less'
import intl from '@/utils/intl'
import { ClockO } from '@wind/icons'

export const HKCorpProcessing: FC<{
  className?: string
}> = () => {
  return (
    <div className={classNames(styles.container)}>
      <ClockO className={styles.processIcon} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
      <span className={classNames(styles.processText)}>
        {intl(414546, '您已购买，数据将在5个工作日内处理完成，请稍候')}
      </span>
    </div>
  )
}
