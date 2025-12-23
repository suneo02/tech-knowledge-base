import { Button } from '@wind/wind-ui'
import { ButtonProps } from '@wind/wind-ui/lib/button/button'
import classNames from 'classnames'
import { FC } from 'react'
import styles from './index.module.less'

export const WuiAliceBtn: FC<
  {
    active?: boolean
    icon?: React.ReactNode
    onClick?: () => void
  } & Pick<ButtonProps, 'loading' | 'className' | 'disabled' | 'style' | 'children'>
> = ({ children, active, icon, onClick, ...props }) => {
  return (
    <Button
      className={classNames(styles['wui-alice-btn'], styles['alice-deepmode-btn'], {
        [styles['alice-deepmode-btn--active']]: active,
        [styles['wui-alice-btn--active']]: active,
      })}
      onClick={onClick}
      {...props}
    >
      {icon ? <span className={styles['icon']}>{icon}</span> : null}
      {children}
    </Button>
  )
}
