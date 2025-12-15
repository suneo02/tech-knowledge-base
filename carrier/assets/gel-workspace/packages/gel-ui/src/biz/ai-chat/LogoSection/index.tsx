import { CollapseBtn } from '@/common/Button/CollapseBtn'
import classNames from 'classnames'
import React from 'react'
import { AliceLogo } from '../AliceLogo'
import styles from './index.module.less'

interface LogoSectionProps {
  onLogoClick?: () => void
  logoText?: string
  showCollapse?: boolean
  collapsed?: boolean
  toggleCollapse?: () => void
}

export const LogoSection: React.FC<LogoSectionProps> = ({
  onLogoClick,
  logoText = 'Alice',
  showCollapse,
  collapsed,
  toggleCollapse,
}) => {
  return (
    <div className={styles.logo}>
      {!collapsed ? (
        <div
          className={classNames(styles['logo-wrapper'], {
            [styles['logo--clickable']]: onLogoClick,
          })}
          onClick={onLogoClick}
        >
          <AliceLogo />

          <span className={styles['logo-text']}>{logoText}</span>
        </div>
      ) : (
        <AliceLogo />
      )}
      {showCollapse && toggleCollapse && (
        <CollapseBtn className={styles['collapse-button']} collapse={!!collapsed} toggleCollapse={toggleCollapse} />
      )}
    </div>
  )
}
