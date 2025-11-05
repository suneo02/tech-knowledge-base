import React, { FC, ReactNode } from 'react'
import cn from 'classnames'

export const LinksComponent: FC<{
  className?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  children: ReactNode
  url: string
}> = ({ className, onClick, children, url }) => {
  return (
    <a
      className={cn(`link-component-basic`, {
        [className]: className,
      })}
      href={url}
      onClick={onClick}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  )
}
