import { FC } from 'react'
import styles from './index.module.less'

export const WuiAliceBtn: FC<{
  children: React.ReactNode
  active?: boolean
  icon?: React.ReactNode
  onClick?: () => void
}> = ({ children, active, icon, onClick }) => {
  return (
    <a
      className={`${styles['wui-alice-btn']} ${styles['alice-deepmode-btn']} ${active ? styles['alice-deepmode-btn--active'] : ''} ${active ? styles['wui-alice-btn--active'] : ''}`}
      onClick={onClick}
    >
      {icon ? <span className={styles['icon']}>{icon}</span> : null}
      {children}
    </a>
  )
}
