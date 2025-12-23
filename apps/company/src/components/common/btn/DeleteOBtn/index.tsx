import { DeleteO } from '@wind/icons'
import { Button } from '@wind/wind-ui'
import { ButtonProps } from '@wind/wind-ui/lib/button/button'
import classNames from 'classnames'
import React, { FC } from 'react'
import styles from './index.module.less'

export const DeleteOBtn: FC<ButtonProps> = ({ className, ...props }) => {
  return (
    <Button
      className={classNames(styles.deleteOBtn, className)}
      type="text"
      icon={
        <DeleteO
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          data-uc-id="DV19loBqwt"
          data-uc-ct="deleteo"
        />
      }
      {...props}
      data-uc-id="fSLsC7OoSF"
      data-uc-ct="button"
    />
  )
}
