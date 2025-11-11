import { SelectProps } from 'antd/es/select'
import { ColumnType } from 'antd/es/table'
import { Key } from 'react'
import { ColumnTypeEnum, ComponentTypeEnum, LayoutStateEnum, ModuleTypeEnum, VipTypeEnum } from './emun'

/**
 * 搜索列配置接口
 * @interface SearchColumn
 */
interface SearchColumn {
  /** 显示标签 */
  label?: string
  /** 唯一标识键 */
  key: string
  /** 默认值 */
  defaultValue?: string
  /** 搜索类型 */
  type: 'input' | 'number' | 'select'
  /** 后缀 */
  suffix?: string
  /** 选项配置 */
  options?: SelectProps['options']
}

/**
 * 参数配置类型
 * @type ParamsConfig
 */
type StaticConfig = {
  /** 静态配置类型 */
  type: 'static'
  /** 静态值 */
  value: string
  /** API键名 */
  apiKey: string
}

type DynamicConfig = {
  /** 动态配置类型 */
  type: 'dynamic'
  /** 动态键名 */
  key: string
  /** API键名 */
  apiKey: string
}

export type ParamsConfig = StaticConfig | DynamicConfig

/**
 * 应用列配置类型
 * @type AppColumns
 */
export type AppColumns = Partial<
  ColumnType &
    ComponentProps &
    TableColumnsProps & {
      /** 子列配置 */
      children?: (AppColumns | {})[]
    }
>

/**
 * 组件基础配置接口
 * @interface ComponentProps
 */
export interface ComponentProps {
  /** 组件唯一标识 */
  id?: React.Key
  /** 组件名称 */
  name?: string
  /** 展示标题 */
  title?: string
  /** 副标题 */
  subTitle?: string
  /** 提示信息 */
  tooltip?: string
  /** VIP类型 */
  vip?: VipTypeEnum
  /** API地址 */
  api?: string
  /** API后缀 */
  apiSuffix?: string
  /** API额外参数 */
  apiExtra?: ParamsConfig[]
  /** 导出API */
  exportApi?: string
  /** 组件类型 */
  type?: ComponentTypeEnum
  /** 键值 */
  key?: Key
  /** 最大展示数量 */
  maxTotal?: number
  /** 超出数量文案 */
  maxTitle?: string
  /** 是否显示序号 */
  showIndex?: boolean
  /** 表格列配置 */
  columns: AppColumns[]
  /** 搜索配置 */
  search?: {
    type?: 'mixture' | 'default'
    columns: SearchColumn[]
  }
  /** 是否集成父组件 */
  integrationParent?: boolean
  /** 是否隐藏标题 */
  hideTitle?: boolean
  /** 是否是标签 */
  isTab?: boolean
}

/**
 * 表格列链接配置接口
 * @interface TableColumnsLinksProps
 */
export interface TableColumnsLinksProps {
  /** 键名 */
  key?: string
  /** 模块类型 */
  module: ModuleTypeEnum
  /** 链接地址 */
  url?: string
  /** 唯一标识 */
  id: string
  /** 显示标签 */
  label?: string
}

/**
 * 日期类型枚举
 * @enum DateTypeEnum
 */
export enum DateTypeEnum {
  /** 普通日期 */
  DATE,
  /** 日期范围 */
  DATE_RANGE,
}

/**
 * 表格列配置接口
 * @interface TableColumnsProps
 */
export interface TableColumnsProps {
  /** 列唯一标识 */
  id: React.Key
  /** 列标题 */
  title: string
  /** 数据索引 */
  dataIndex: string
  /** 列宽度 */
  width?: string | number
  /** 对齐方式 */
  align?: 'left' | 'right' | 'center'
  /** 提示信息 */
  tooltip?: string
  /** 列类型 */
  type?: ColumnTypeEnum
  /** 布局状态 */
  layout?: LayoutStateEnum
  /** 链接配置 */
  links?: TableColumnsLinksProps
  /** 小数位数 */
  toFixed?: number
  /** 货币单位 */
  currencyUnit?: string
  /** 日期配置 */
  date?: {
    /** 日期分隔符 */
    separator?: string
    /** 日期类型 */
    type?: DateTypeEnum
    /** 日期范围结束字段 */
    dateRangeKey?: string
  }
  /** 信息配置 */
  info?: {
    /** 展开列键名 */
    showExpendColumnKey?: string
    /** 展开项ID */
    expandableId?: React.Key
    /** 显示信息键名 */
    showInfoKey?: string
    /** 参数配置 */
    params?: ParamsConfig[]
    /** 组件ID */
    componentId?: React.Key
  }
}

/**
 * 描述列表配置接口
 * @interface DescriptionsColumnsProps
 */
export interface DescriptionsColumnsProps extends TableColumnsProps {
  /** 跨列数 */
  span?: number
  /** 标签最小宽度 */
  labelMinWidth?: number
  /** 内容最小宽度 */
  contentMinWidth?: number
}

/**
 * 菜单项配置接口
 * @interface MenuItemProps
 */
export interface MenuItemProps {
  /** 菜单标题 */
  title?: string
  /** 菜单名称 */
  name: string
  /** 菜单ID */
  id: React.Key
  /** 菜单ID列表 */
  menuIds: React.Key[]
  /** 组件ID */
  componentId: React.Key
  /** 子菜单 */
  children?: MenuItemProps[]
  /** 是否显示边框 */
  showBorder?: boolean
}

/**
 * 菜单树配置接口
 * @interface MenuTreeProps
 */
export interface MenuTreeProps {
  /** 树ID */
  id: React.Key
  /** 树名称 */
  name: string
  /** 树结构 */
  tree: MenuItemProps[]
  /** 订阅信息 */
  subscribe?: string
  /** 是否显示边框 */
  showBorder?: boolean
}
