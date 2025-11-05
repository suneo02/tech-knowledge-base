import { aliceIcon } from '@/assets/alice'
import { CollapseBtn } from '@/misc/CollapseBtn'
import classNames from 'classnames'
import React from 'react'
import styles from './logo-section.module.less'

interface LogoSectionProps {
  onLogoClick?: () => void
  logoText?: string
  showCollapse?: boolean
  collapse?: boolean
  toggleCollapse?: () => void
}

export const LogoSection: React.FC<LogoSectionProps> = ({
  onLogoClick,
  logoText = 'Alice',
  showCollapse,
  collapse,
  toggleCollapse,
}) => {
  return (
    <div className={styles.logo}>
      {!collapse && (
        <div
          className={classNames(styles['logo-wrapper'], {
            [styles['logo--clickable']]: onLogoClick,
          })}
          onClick={onLogoClick}
        >
          <img
            className={styles['logo-img']}
            src={aliceIcon}
            draggable={false}
            alt="logo"
            style={{ width: 40, height: 40 }}
          />
          <span className={styles['logo-text']}>{logoText}</span>
        </div>
      )}
      {showCollapse && toggleCollapse && (
        <CollapseBtn className={styles['collapse-button']} collapse={!!collapse} toggleCollapse={toggleCollapse} />
      )}
    </div>
  )
}
