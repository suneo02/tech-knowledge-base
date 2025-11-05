import React, { FC } from 'react'
import { MenuFoldO, MenuUnfoldO } from '@wind/icons'
import { Button } from '@wind/wind-ui'
import styles from './style/toggleBtn.module.less'

/**
 * 展开及收起图标
 * @constructor
 */
export const ToggleBtn: FC<{
  ifExpanded: boolean
  toggle: () => void
}> = ({ ifExpanded, toggle }) => {
  return (
    <Button
      className={styles['toggle-btn']}
      icon={
        ifExpanded ? (
          <MenuFoldO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        ) : (
          <MenuUnfoldO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        )
      }
      onClick={toggle}
    />
  )
}
