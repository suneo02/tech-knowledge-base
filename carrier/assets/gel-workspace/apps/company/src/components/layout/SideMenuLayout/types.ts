import { LinksModule } from '@/handle/link'
import { DataNode } from '@wind/wind-ui/lib/tree'
import { CSSProperties, ReactNode } from 'react'

export type ContentType = 'iframe' | 'content' | 'url' | undefined

export interface MenuParams {
  [key: string]: string | number | boolean | undefined
}

export type MenuItemProps = {
  /** 内容 */
  content?: ReactNode
  /** 内嵌 iframe 链接 */
  iframeUrl?: string
  /** 跳转链接 */
  url?: string
  /** 自定义渲染内容 */
  render?: (item: MenuItemProps) => ReactNode
  /** 点击回调 */
  onClick?: (item: MenuItemProps, params?: MenuParams) => void
  /** 是否禁用 */
  disabled?: boolean
  /** 子节点 */
  children?: MenuItemProps[]
  /** 内容类型 */
  type?: ContentType
  /** 参数配置, 慎用！！！如果使用了参数配置则不再是组件 */
  params?: MenuParams
  /** TODO 未来可以做通用方案 针对模板API的接口 */
  templateApi?: string
  templateParams?: Record<string, any>
  enableDelete?: boolean // 是否可以删除
  templateName?: string // 模板名称 如果没有自动将title作为模板名称
  ai?: boolean // 是否是AI模板
  height?: number // 高度
} & Omit<DataNode, 'children'>

export interface CacheItem {
  type: ContentType
  content?: ReactNode
  iframUrl?: string
  params?: MenuParams
  scrollPosition?: number
}

export interface MenuItemCache {
  params?: MenuParams
  children?: MenuItemProps[]
}

export interface MenuCache {
  [key: string]: MenuItemCache
}

// export interface MenuContextType {
//   activeItem: MenuItemProps
//   globalParams: MenuParams
//   menuCache: MenuCache
//   updateGlobalParams: (params: MenuParams) => void
//   updateMenuCache: (key: string, cache: MenuItemCache) => void
// }

export interface SideMenuLayoutProps {
  module: LinksModule
  /** 菜单数据 */
  menu: MenuItemProps[]
  /** 菜单区域宽度 */
  sideWidth?: number
  /** 菜单标题 */
  menuTitle?: ReactNode
  /** 菜单底部内容 */
  menuFooter?: ReactNode
  /** 是否显示菜单折叠按钮 */
  collapsible?: boolean
  /** 折叠时的内容 */
  collapsedContent?: ReactNode
  /** 自定义菜单项渲染 */
  menuItemRender?: (item: MenuItemProps) => ReactNode
  /** 自定义内容区域渲染 */
  contentRender?: (activeItem: MenuItemProps) => ReactNode
  /** 菜单布局方式 */
  justifyContent?: CSSProperties['justifyContent']
  /** 是否显示分割线 */
  showDivider?: boolean
  /** 自定义样式 */
  className?: string
  /** 自定义样式 */
  style?: CSSProperties
  /** 菜单样式 */
  menuStyle?: CSSProperties
  /** 内容区域样式 */
  contentStyle?: CSSProperties
  /** 菜单激活回调 */
  onMenuSelect?: (item: MenuItemProps) => void
  /** 菜单展开回调 */
  onMenuExpand?: (expandedKeys: string[]) => void
  /** 默认展开的菜单项 */
  defaultExpandedKeys?: string[]
  /** 默认选中的菜单项 */
  defaultActiveKey?: string
  /** 是否默认展开所有菜单 */
  defaultExpandAll?: boolean
  /** 是否支持多选 */
  multiple?: boolean
  /** iframe 相关配置 */
  // iframeConfig?: {
  //   /** iframe 加载时的loading */
  //   loading?: ReactNode
  //   /** iframe 加载失败时的错误提示 */
  //   error?: ReactNode
  //   /** iframe 属性 */
  //   props?: React.IframeHTMLAttributes<HTMLIFrameElement>
  //   /** 是否允许滚动 */
  //   scroll?: boolean
  // }
  /** 全局参数，会与菜单项的params合并 */
  globalParams?: MenuParams
}
