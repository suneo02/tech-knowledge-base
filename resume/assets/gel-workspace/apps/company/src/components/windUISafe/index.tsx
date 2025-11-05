import { Link, Layout as WindLayout, Menu as WindMenu, Tabs as WindTabs, Tag as WindTag } from '@wind/wind-ui'
import { SiderProps } from '@wind/wind-ui/lib/layout/Sider'
import { LinkProps } from '@wind/wind-ui/lib/link'
import { MenuProps } from '@wind/wind-ui/lib/menu'
import { SubMenuProps } from '@wind/wind-ui/lib/menu/SubMenu'
import { TabsProps } from '@wind/wind-ui/lib/tabs'
import { TagProps } from '@wind/wind-ui/lib/tag'
import { default as React, ReactNode } from 'react'

export const TagSafe: React.FC<
  {
    children?: ReactNode
    onClick?: () => void
  } & TagProps
> = ({ children, onClick, ...props }) => {
  // 使用 value 属性来传递 children 内容
  return (
    // @ts-expect-error ttt
    <WindTag {...props} value={typeof children === 'string' ? children : undefined} onClick={onClick}>
      {children}
    </WindTag>
  )
}

export const MenuSafe: React.FC<
  MenuProps & {
    children?: ReactNode
  }
> = ({ children, ...props }) => {
  return <WindMenu {...props}>{children}</WindMenu>
}

export const TabsSafe: React.FC<
  TabsProps & {
    children?: ReactNode
  }
> = ({ children, ...props }) => {
  return <WindTabs {...props}>{children}</WindTabs>
}

export const SubMenuSafe: React.FC<
  SubMenuProps & {
    children?: ReactNode
  }
> = ({ children, ...props }) => {
  return <WindMenu.SubMenu {...props}>{children}</WindMenu.SubMenu>
}

export const LinkSafe: React.FC<
  {
    target?: '_blank' | '_self' | '_parent' | '_top'
  } & LinkProps
> = (props) => {
  return <Link {...props} />
}
export const SiderSafe: React.FC<
  SiderProps & {
    children?: ReactNode
  }
> = ({ children, ...props }) => {
  return <WindLayout.Sider {...props}>{children}</WindLayout.Sider>
}
