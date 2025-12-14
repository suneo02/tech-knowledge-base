import { Tag } from '@wind/wind-ui'
import React, { FC } from 'react'

export const CompanyCardTag: FC<{
  onClick?: () => void
  content: string
  color?: string
  size?: 'small' | 'large' | 'default' | 'mini'
}> = ({ color, onClick, content, size = 'large' }) => (
  <Tag
    className={`cursor-pointer`}
    size={size}
    onClick={onClick}
    color={color ?? 'color-2'}
    type="secondary"
    data-uc-id="5uREH0Ng9"
    data-uc-ct="tagsafe"
  >
    {content}
  </Tag>
)
