import { MenuUnfoldIcon } from '@/assets/icon'
import { Button } from '@wind/wind-ui'
import classNames from 'classnames'
import { FC } from 'react'
import styles from './index.module.less'

export const CollapseBtn: FC<{
  className?: string
  collapse: boolean
  toggleCollapse: () => void
}> = ({ collapse, toggleCollapse, className }) => {
  return (
    <Button
      className={classNames(styles['collapse-button'], className)}
      onClick={toggleCollapse}
      icon={
        <MenuUnfoldIcon
          className={styles['icon-menu-unfold']}
          style={{ transform: collapse ? 'scaleX(-1)' : 'none', transition: 'transform 0.2s' }}
        />
      }
    />
  )
}

