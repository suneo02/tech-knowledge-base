import { AliceIcon } from '@/AliceIcon'
import { Deepthink, DeepthinkFilled } from '@/assets/icon'
import { Button } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import { FC, useState } from 'react'
import styles from './DeepThinkBtn.module.less'

export const DeepThinkBtn: FC<{
  deepthink?: boolean
  onClick: () => void
}> = ({ deepthink, onClick }) => {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <Button
      onClick={onClick}
      icon={
        deepthink || isHovering ? (
          <AliceIcon style={{ fontSize: '18px' }}>
            <DeepthinkFilled style={{ fontSize: '18px' }} />
          </AliceIcon>
        ) : (
          <AliceIcon style={{ fontSize: '18px' }}>
            <Deepthink style={{ fontSize: '18px' }} />
          </AliceIcon>
        )
      }
      className={deepthink ? styles.deepThinkBtnActive : styles.deepThinkBtn}
      // @ts-expect-error ttt
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span>{t('421453', '深度思考(R1)')}</span>
    </Button>
  )
}
