import { Link, Layout as WindLayout, Menu as WindMenu, Tabs as WindTabs } from '@wind/wind-ui'
import { SiderProps } from '@wind/wind-ui/lib/layout/Sider'
import { LinkProps } from '@wind/wind-ui/lib/link'
import { MenuProps } from '@wind/wind-ui/lib/menu'
import { SubMenuProps } from '@wind/wind-ui/lib/menu/SubMenu'
import { TabsProps } from '@wind/wind-ui/lib/tabs'
import { default as React, ReactNode } from 'react'

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
  return <Link {...props} data-uc-id="vQ-7OwZJu6" data-uc-ct="link" />
}
export const SiderSafe: React.FC<
  SiderProps & {
    children?: ReactNode
  }
> = ({ children, ...props }) => {
  return <WindLayout.Sider {...props}>{children}</WindLayout.Sider>
}
