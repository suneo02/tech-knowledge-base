// 一个大模块的自定义
import {
  ICfgDetailNodeCommonJson,
  IConfigDetailApiJSON,
  IConfigDetailTitleJSON,
  TConfigDetailLayout,
} from '@/types/configDetail/common.ts'
import { ICfgDetailTableJson } from '@/types/configDetail/table.ts'
import { ISearchOptionCfg } from '@/types/configDetail/search.ts'
import { ICfgChartNodeJson } from '@/types/configDetail/chart.ts'

export type TCfgSubMenuCustom = 'corpTechScore' | string

export type ICfgDetailNodeJson = ICfgChartNodeJson | ICfgDetailTableJson

export type ICfgDetailCompJson = (
  | {
      layout?: TConfigDetailLayout
      children?: ICfgDetailNodeJson[]
    }
  | ICfgDetailNodeJson
) & {
  key?: string
  customId?: TCfgSubMenuCustom
  display?: boolean
  hot?: boolean
  data?: any
} & IConfigDetailTitleJSON &
  IConfigDetailApiJSON

export type ICfgDetailNodeType = 'map' | 'chart' | 'relationship' | 2 | undefined | string

/**
 * 一个模块包含多个节点
 */
export type IConfigDetailNodesJSON = {
  layout?: TConfigDetailLayout
  children?: ICfgDetailModuleJSON[]
  component?: ICfgDetailCompJson
  // 子组件 column 都一样 配置复用
  columnsForChild?: ICfgDetailTableJson['columns']
  searchOptionsForChild?: ISearchOptionCfg[]
} & Partial<IConfigDetailTitleJSON> &
  ICfgDetailNodeCommonJson

/**
 * 一个模块的配置，有可能一个节点，有可能多个节点, 也有可能 component 里面配置节点
 */
export type ICfgDetailModuleJSON = ICfgDetailCompJson | ICfgDetailNodeJson | IConfigDetailNodesJSON

export type ICfgDetailSubMenuJson = {
  isVip?: boolean
  isSvip?: boolean
} & ICfgDetailModuleJSON

/**
 * 一个模块包含多个节点
 */
export type ICfgDetailSubMenu = ICfgDetailSubMenuJson & {
  key?: string
  disabled?: boolean
  display?: boolean
  treeKey?: string
}

export type ICfgDetailPrimaryMenuJson = IConfigDetailTitleJSON & {
  children: ICfgDetailSubMenu[]
}

export type ICfgDetailPrimaryMenu = ICfgDetailPrimaryMenuJson & {
  key?: string
  display?: boolean
  treeKey?: string
}

/**
 * 配置化详情页面 JSON 类型
 *
 * 人物 、集团系、企业详情
 */
export type ICfgDetailJSON = ICfgDetailPrimaryMenuJson[]

export type ICfgDetail = ICfgDetailPrimaryMenu[]
