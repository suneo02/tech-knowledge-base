import { LinksModule, TLinkOptions } from '@/handle/link'
import { TagProps } from '@wind/wind-ui/lib/tag/index'
import { AxiosRequestConfig } from 'axios'
import { ReactNode } from 'react'
import { ICfgDetailNodeCommonJson, IConfigDetailApiJSON, IConfigDetailTitleJSON } from './common.ts'

/**
 * TODO
 */
export type IConfigDetailTableColumnType =
  | 'array'
  // date 类型
  | 7
  // TODO
  | 4
  | 13
  | 12
  | 5
  // 货币
  | 6
  // 第二种 货币
  | 20
  | string
  | number
export type IConfigDetailTableColumnCustom =
  // 多个企业详情链接 name|id,name|id
  | 'CorpLinkArrStr'
  // 人物 合作企业
  | 'character_hzhb_1'
  // 招标产品
  | 'bidProduct'
  // 专利法律状态
  | 'patentLawStatus'
  | string

export type TConfigDetailTableColumn = {
  width: number | string
  dataIndex: string
  type?: IConfigDetailTableColumnType
  // 有 custom id type 会失效
  customId?: IConfigDetailTableColumnCustom
  /**
   * @default left
   */
  align?: 'left' | 'right' | 'center' | string | undefined

  // 是否是数组 , 如果是数组，对field每个值做相同处理
  isArray?: boolean
  links?: {
    // id的 key
    id: string
    titleKey?: string
    module: LinksModule
    standardLevelCodeKey?: string
    typeKey?: string
    standardTypeKey?: string // 标准信息的type key
  } & Pick<TLinkOptions, 'target'>
  info?: any

  tagInfo?: IConfigDetailTableTagInfo | IConfigDetailTableTagInfo[]
} & IConfigDetailTitleJSON

export interface IConfigDetailTableTagInfo {
  dataIndex: string
  color: string
  type?: TagProps['type']
  size?: TagProps['size']
}

export type ICfgDetailTableJson = {
  type: 'table' | 2 | undefined | string
  columns?: TConfigDetailTableColumn[] // 有可能使用父组件的 columns
  apiOptions?: AxiosRequestConfig | Record<string, any>
  maxTotal?: number
  dataSource?: any
  treeKey?: any
  expandable?: any
  params?: any
  hideTableHeader?: boolean
  titleRender?: (param: any) => ReactNode
  noExtra?: boolean
  titleRemark?: any
  nodes?: any
  searchOptions?: any[]
  nodeKey?: any
  showIndex?: boolean
  footerLeftRender?: any
  num?: any
  /**
   * 模式二（key-translate-official-only）下的“跳过翻译字段列表”。
   * 仅当全局显示模式为模式二时生效；用于避免展示/逻辑字段在该模式被通用翻译。
   */
  skipTransFieldsInKeyMode?: string[]
} & IConfigDetailTitleJSON &
  IConfigDetailApiJSON &
  ICfgDetailNodeCommonJson
