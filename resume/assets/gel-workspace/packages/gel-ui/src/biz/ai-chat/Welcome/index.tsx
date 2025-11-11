import { SuperListGradientText } from '@/common'
import { Welcome as AntWelcome } from '@ant-design/x'
import classNames from 'classnames'
import React from 'react'
import { AliceLogo } from '../AliceLogo'
import styles from './style.module.less'

export * from './WelcomeSuper'

interface WelcomeProps {
  size?: 'normal' | 'small'
  className?: string
}

export const WelcomeSection: React.FC<WelcomeProps> = ({ size = 'normal', className }) => {
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
      className={classNames(styles['welcome-section'], className)}
      variant="borderless"
      icon={<AliceLogo width={110} height={110} />}
      title={<div className={size === 'normal' ? styles['welcome-title'] : styles['welcome-title-small']}></div>}
      description={
        <div className={styles['welcome-description']} style={{ color: '#666' }}>
          我是
          <SuperListGradientText> Alice </SuperListGradientText>
          ，是你的商业查询智能助手
        </div>
      }
      styles={innerStyles}
      style={{
        padding: '16px 0',
        gap: size === 'normal' ? 24 : 8,
        borderRadius: 8,
      }}
    />
  )
}
