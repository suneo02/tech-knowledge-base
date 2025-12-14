// import { Integration } from './../components/Integration/index'
// import { CardFormItemProps } from '@/components/Form/CardForm/type'
// import { ProColumns, ProFormColumnsType, ProDescriptionsItemProps } from '@ant-design/pro-components'
// import { ColumnTypeEnum } from '@/dictionary/type'
// export type AppColumns<T = any, ValueType = 'text'> = ProColumns<T, ValueType> & ProTableProps<T, ValueType> & TableColumnsProps

import React from 'react'

type SearchColumnOption = string | number | { label: string; value: any; count?: number }

type SearchColumn = {
  label?: string
  key: string
  defaultValue?: string
  type: 'input' | 'number' | 'select'
  suffix?: string
  options?: SearchColumnOption[]
}

// 样式配置
export type StyleConfig = {
  className?: string
  style?: React.CSSProperties
  // conditional?: {   // 条件样式
  //   field: string
  //   value: any
  //   style: React.CSSProperties
  // }[]
}

/** 下载配置 */
export interface DownloadProps {
  text?: string // 下载文案 默认 导出数据
  url: string // 下载地址
  type?: 'download' | 'preview' // 下载类型 默认下载
  fileType?: 'xlsx' // 文件类型 默认xlsx 目前只支持 xlsx
}

/** api配置 */
export interface ApiProps {
  api: string
  params?: ParamsProps[]
}

export type ParamsProps =
  | {
      type: 'static'
      apiKey: string
      value: string
    }
  | {
      type: 'dynamic'
      apiKey: string
      key: string
    }

/** 超链类型 后续改成文浩的版本 */
interface TableColumnsLinksProps {
  key?: string // 超链字段
  // module: ModuleTypeEnum // 跳转模块
  url?: string // 跳转地址
  id: React.Key // 跳转字段
  label?: string // 展示字段
}

export interface BaseConfigProps {
  id?: React.Key
  key?: React.Key
  name?: string // 名称 用来让用户更好的理解该模块具体的名称，title可能是缩略的名称
  title?: string // 展示名称
  description?: string // 描述 用来让用户更好的理解该模块的含义
}

/** 组件配置 */
export interface ComponentProps extends BaseConfigProps, StyleConfig {
  api?: ApiProps // api配置
  // type?: ComponentTypeEnum // 组件类型 默认是table

  /** 头部信息 */
  /**
   * *******************************************
   * *      左侧信息      *                     *
   * *******************************************
   */
  tooltip?: string // 提示词（搭配icon展示）
  count?: number // 当前模块数据的数量
  // vip?: VipTypeEnum // vip信息（搭配icon展示）
  remark?: string // 备注信息
  /**
   * *******************************************
   * *                  * 右侧信息（headerExtra）*
   * *******************************************
   */
  filter?: SearchColumn[] // 搜索栏
  headerExtraRemark?: string // 头部右侧备注
  moreLink?: { label: string; url: string } // 更多链接
  download?: DownloadProps // 下载链接
  /**
   * *******************************************
   * *                  header                 *
   * *******************************************
   * *                subHeader                *
   * *******************************************
   */
  subHeader?: string // 副标题
  subHeaderRenderKey?: string // 副标题的key(用来做特殊操作的)

  /** 底部信息 */
  /**
   * *******************************************
   * *                  footer                 *
   * *******************************************
   */
  maxTotal?: number // 最大展示数量
  maxTitle?: string // 超出数量文案
  maxTitleRenderKey?: string // 超出数量文案的key(用来做特殊操作的)

  /** 针对不同类型的特殊配置字段 */
  tableOptions?: TableOptionsProps
  descriptionOptions?: DescriptionsColumnsProps
}

export interface IntegrationProps extends StyleConfig {
  layout?: 'tabs' | 'vertical' | 'horizontal' // 布局方式 默认是vertical
  hideTabsTitle?: boolean // 是否隐藏tabs的title 只有他的父亲元素layout为tabs时有效
  grid?: (string | number)[]
  children?: ComponentsProps[]
}

export type ComponentsProps = ComponentProps | IntegrationProps

/** ------------------------------- table ------------------------------- */

export interface TableOptionsProps {
  showIndex?: boolean
  // columns: AppColumns<TableColumnsProps>[]
}

/** 组件的table配置 */
export interface TableColumnsProps {
  /** basic */
  id?: React.Key
  title?: string // 列名称
  dataIndex?: string // 列属性
  width?: number // 列宽
  align?: 'center' | 'left' | 'right' // 位置 默认是left
  tooltip?: string // 提示词
  // renderType?: ColumnTypeEnum // 类型

  /** links 超链类型 */
  links?: TableColumnsLinksProps
  /** 数字 */
  toFixed?: number // 保留小数位
  /** 货币单位 */
  currencyUnit?: string // 货币单位
  /** 时间 */
  date?: {
    separator?: string // 时间中间的间隔 默认是-
    type?: 'date' | 'dateTime' | 'dateRange' | 'dateRangeTime' // 时间类型
    dateRangeKey?: string // 时间范围后面的字段
  }
  /** 针对详情特殊处理 */
  info?: {
    showInfoKey?: string // 针对key的值来判断是否有详情 不填默认展示
    expandableId?: React.Key // 展开的id 一般默认为组件id
    params?: ParamsProps[] // 传递的参数
  }
}

/** 描述列表配置 */
export interface DescriptionsColumnsProps extends TableColumnsProps {
  span?: number //
  labelMinWidth?: number
  contentMinWidth?: number
}

export interface MenuItemProps {
  title?: string
  name: string
  id: React.Key
  menuIds: React.Key[]
  componentId: React.Key
  children?: MenuItemProps[]

  showBorder?: boolean
}

export interface MenuTreeProps {
  id: React.Key
  name: string
  tree: MenuItemProps[]
  subscribe?: string
  showBorder?: boolean
}
