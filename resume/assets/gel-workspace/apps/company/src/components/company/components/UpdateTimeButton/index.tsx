import { SynO } from '@wind/icons'
import { message } from '@wind/wind-ui'
import classNames from 'classnames'
import React, { useState } from 'react'
import { createFastCrawl, getCrawlStatus } from '../../../../api/companyApi'
import { pointBuriedByModule } from '../../../../api/pointBuried/bury'
import intl from '../../../../utils/intl'
import { wftCommon } from '../../../../utils/utils'
import styles from './styles.module.less'

/**
 * 更新时间按钮组件
 */
interface UpdateTimeButtonProps {
  corpUpdateTime: string
  corpId: string
}

export const UpdateTimeButton: React.FC<UpdateTimeButtonProps> = ({ corpUpdateTime, corpId }) => {
  const [isUpdating, setIsUpdating] = useState(false)

  // 定义动画持续时间常量
  const TOTAL_ANIMATION_TIME = 4000 // 毫秒

  const handleClick = () => {
    // 如果正在更新中，阻止重复点击
    if (isUpdating) {
      return
    }

    try {
      pointBuriedByModule(922602100369)
      createFastCrawl(corpId)

      // 设置API检查时间与动画时间一致
      setTimeout(() => {
        getCrawlStatus()
      }, TOTAL_ANIMATION_TIME)

      // 显示消息，并设置持续时间与动画时间一致
      message.success(intl('347890', '数据更新中，请稍候刷新页面查看'), TOTAL_ANIMATION_TIME / 1000)

      setIsUpdating(true)

      // Reset animation state after animation completes
      setTimeout(() => {
        setIsUpdating(false)
      }, TOTAL_ANIMATION_TIME)
    } catch (e) {
      console.error(e)
      // 出错时也重置状态
      setIsUpdating(false)
    }
  }

  return (
    <span className={styles.updateTimeContainer}>
      <SynO
        className={classNames(styles.refreshIcon, { [styles.animating]: isUpdating })}
        onClick={handleClick}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        data-uc-id="sFUJ92Cjb_H"
        data-uc-ct="syno"
      />
      <span className={styles.timeLabel}>{intl('138868', '更新时间')}</span>
      <span className={styles.timestamp}>{wftCommon.formatTime(corpUpdateTime)}</span>
    </span>
  )
}
