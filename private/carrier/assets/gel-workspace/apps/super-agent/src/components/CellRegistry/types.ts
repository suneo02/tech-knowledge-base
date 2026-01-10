import type { ReactNode } from 'react'
import { ColumnDataTypeEnum } from 'gel-api'

// 渲染模式：行内 / 详情
export type RenderMode = 'inline' | 'expanded'

// 基础数据记录
export interface BasicRecord {
  id?: string | number
  [key: string]: unknown
}

// 基础列配置
export interface BasicColumn {
  title?: ReactNode
  dataIndex: string
  key?: string
  type?: CellType | string
  disableExpand?: boolean
  unit?: string
  [key: string]: unknown
}

// 渲染参数
export interface RenderParams {
  value: unknown
  record: BasicRecord
  column: BasicColumn
  mode: RenderMode
}

// 渲染器函数
export type CellRenderer = (params: RenderParams) => ReactNode

// 渲染器注册配置
export interface RendererConfig {
  type: CellType | string
  renderer: CellRenderer
  overwrite?: boolean
}

// Addon 增强器函数
export type CellAddon = (node: ReactNode, params: RenderParams, options?: Record<string, unknown>) => ReactNode

// Addon 注册配置
export interface AddonRegistryConfig {
  name: string
  addon: CellAddon
  overwrite?: boolean
}

// CellView 中使用 Addon 的配置
export interface AddonUseConfig {
  name: string
  options?: Record<string, unknown>
  order?: number
  condition?: (params: RenderParams) => boolean
}

// 文档兼容别名：对外导出与文档一致的类型名称
export type CellAddonConfig = AddonUseConfig

// useCellRender 的选项类型（用于传入 addons 列表）
export interface UseCellRenderOptions {
  addons?: (string | AddonUseConfig)[]
}

// 内置渲染类型常量（与业务枚举对齐）
export const RendererTypes = {
  MARKDOWN: 'md',
  INTEGER: String(ColumnDataTypeEnum.INTEGER),
  FLOAT: String(ColumnDataTypeEnum.FLOAT),
  PERCENT: String(ColumnDataTypeEnum.PERCENT),
  NUMBER: 'number',
  DEFAULT: '__default__',
} as const

export type CellType = (typeof RendererTypes)[keyof typeof RendererTypes]

// CellView 组件属性
export interface CellViewProps {
  value: unknown
  record: BasicRecord
  column: BasicColumn
  mode?: RenderMode
  addons?: (string | AddonUseConfig)[]
  fallback?: ReactNode
  shouldUpdate?: (prev: CellViewProps, next: CellViewProps) => boolean
}

// Provider 属性
export interface CellRegistryProviderProps {
  children: ReactNode
  initialRenderers?: RendererConfig[]
  initialAddons?: AddonRegistryConfig[]
}
