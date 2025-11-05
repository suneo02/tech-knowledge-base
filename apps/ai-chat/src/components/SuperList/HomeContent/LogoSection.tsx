import { aliceIcon } from '@/assets/alice'
import { aliceChatHi } from '@/assets/gif'
import classNames from 'classnames'

import { SuperListGradientText } from 'ai-ui'
import styles from './style/logoSection.module.less'

interface HeaderProps {
  className?: string
}

export const HomeLogoSection: React.FC<HeaderProps> = ({ className }) => {
  return (
    <div className={classNames(styles['logo-section-container'], className)}>
      <img className={styles.logoSectionImg} src={aliceIcon} draggable={false} alt="logo" />
      <div className={styles.logoSectionRight}>
        <img className={styles.logoSectionHi} src={aliceChatHi} draggable={false} alt="Hi" />
        <div className={styles.logoSectionDesc}>
          <span>
            我是
            <SuperListGradientText>Alice</SuperListGradientText>
            ，帮你从"看数据"变为"用数据"，轻松洞察数据！
          </span>
        </div>
      </div>
    </div>
  )
}
