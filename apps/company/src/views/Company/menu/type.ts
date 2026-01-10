import { CorpMenuModuleCfg } from '@/types/corpDetail'
import { ReactNode } from 'react'

export interface CorpMenuData {
  key: string // 菜单项名称
  title: string | ReactNode // 菜单显示文本
  titleStr?: string // 菜单文字描述字符串（可选）
  titleNum?: ReactNode // 菜单编号（可选）
  parentMenuKey?: string | undefined // 父级菜单键名（可选）
  disabled?: boolean // 是否禁用（无数据时禁用）
  hasData?: boolean // 是否有数据
  children?: CorpMenuData[]
}

/**
 * 简化的菜单数据结构（仅包含配置信息和父级引用）
 * 用于快速查找、滚动定位等非渲染场景
 */
export type CorpMenuChild = CorpMenuModuleCfg['children'][number]

export interface CorpMenuSimpleData extends CorpMenuChild {
  parentMenuKey: string
}
