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
          <MenuFoldO
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            data-uc-id="UYGzPwD5v3"
            data-uc-ct="menufoldo"
          />
        ) : (
          <MenuUnfoldO
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            data-uc-id="pGqqX-bLCj"
            data-uc-ct="menuunfoldo"
          />
        )
      }
      onClick={toggle}
      data-uc-id="m05evphjnc"
      data-uc-ct="button"
    />
  )
}
