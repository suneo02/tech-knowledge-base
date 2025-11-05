import { aliceIcon } from '@/assets/alice'
import { SuperListGradientText } from '@/GradientText'
import { Welcome as AntWelcome } from '@ant-design/x'
import React from 'react'
import styles from './style.module.less'

export * from './WelcomeSuper'

interface WelcomeProps {
  isLargeScreen: boolean
  size?: 'normal' | 'small'
}

export const WelcomeSection: React.FC<WelcomeProps> = ({ isLargeScreen, size = 'normal' }) => {
  const innerStyles =
    size === 'normal'
      ? {
          icon: {
            width: 110,
            height: 110,
          },
          description: {
            fontSize: 24,
            marginLeft: 16,
          },
        }
      : {
          icon: {
            width: 40,
            height: 40,
          },
          description: {
            fontSize: 16,

            marginLeft: 8,
          },
        }

  return (
    <AntWelcome
      className={styles['welcome-section']}
      variant="borderless"
      icon={isLargeScreen ? <img src={aliceIcon} alt="alice" /> : <img src={aliceIcon} alt="alice" />}
      title={<div className={size === 'normal' ? styles['welcome-title'] : styles['welcome-title-small']}></div>}
      description={
        <div className={styles['welcome-description']} style={{ color: '#666' }}>
          我是
          <SuperListGradientText> Alice </SuperListGradientText>
          ，是你的商业查询智能助手
        </div>
      }
      styles={innerStyles}
      // extra={isLargeScreen ? <WelcomeMiniProgram /> : null}
      style={{
        padding: '16px 0',
        gap: size === 'normal' ? 24 : 8,
        // backgroundImage: 'linear-gradient(97deg, #f2f9fe 0%, #f7f3ff 100%)',
        borderRadius: 8,
      }}
    />
  )
}
