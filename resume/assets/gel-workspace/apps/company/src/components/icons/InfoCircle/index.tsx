import { InfoCircleO } from '@wind/icons'
import { WIconProps } from '@wind/icons/lib/components/WIcon'
import { Button } from '@wind/wind-ui'
import { ButtonProps } from '@wind/wind-ui/lib/button/button'
import React, { FC } from 'react'

/**
 * @deprecated 请使用 InfoCircleButton 代替
 * @param param0
 * @returns
 */
export const InfoCircleWithHover: FC<WIconProps> = ({ ...props }) => {
  return (
    <InfoCircleO
      style={{ marginInlineStart: 2 }}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      {...props}
    />
  )
}

export const InfoCircleButton: FC<ButtonProps> = ({ ...props }) => {
  return (
    <Button
      type="text"
      icon={<InfoCircleO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
      {...props}
    />
  )
}
