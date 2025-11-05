import { aliceImage } from '@/assets/alice'
import { Welcome as AntWelcome } from '@ant-design/x'
import { t } from 'gel-util/intl'
import React from 'react'
import styles from './style.module.less'

interface WelcomeProps {
  isLargeScreen: boolean
}

export const WelcomeSectionSuper: React.FC<WelcomeProps> = ({ isLargeScreen }) => {
  return (
    <AntWelcome
      className={styles['welcome-section']}
      variant="borderless"
      icon={isLargeScreen ? <img src={aliceImage} alt="alice" /> : null}
      title={t('424233', 'Hi，我是您的商业查询智能助手')}
      description={
        <span style={{ color: '#666' }}>
          {t(
            '422838',
            '企业尽职调查、项目投资分析、穿透关联查询、跟踪行业趋势、研判竞争态势...这些我都在行，欢迎向我提问！'
          )}
        </span>
      }
      style={{
        padding: 16,
        backgroundImage: 'linear-gradient(97deg, #f2f9fe 0%, #f7f3ff 100%)',
        borderRadius: 8,
      }}
    />
  )
}
