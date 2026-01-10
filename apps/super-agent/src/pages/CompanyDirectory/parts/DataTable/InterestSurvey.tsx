import { Button } from '@wind/wind-ui'
import React from 'react'
import styles from './InterestSurvey.module.less'
import { t } from 'gel-util/intl'

export interface InterestSurveyProps {
  onInterest: () => void
}

const PREFIX = 'interest-survey'

export const InterestSurvey: React.FC<InterestSurveyProps> = ({ onInterest }) => {
  return (
    <div className={styles[`${PREFIX}-container`]}>
      <h3 className={styles[`${PREFIX}-title`]}>{t('482235', '对名单有兴趣？')}</h3>
      <div className={styles[`${PREFIX}-description`]}>
        {t('482514', '我们正在持续打磨产品体验，诚邀您参与产品共创。')}
        <br />
        {t('482534', '点击下方按钮报名成为共创用户，您的真实使用反馈将直接影响后续产品优化。')}

        <br />
        {t('482236', '我们也会优先邀请您体验尚未发布的新功能。')}
      </div>

      <div className={styles[`${PREFIX}-button-wrapper`]}>
        <Button
          type="text"
          size="large"
          onClick={onInterest}
          style={{
            height: '44px',
            fontSize: '16px',
            padding: '0 40px',
            border: 'none',
          }}
        >
          {t('482217', '我有意向')}
        </Button>
      </div>
    </div>
  )
}
