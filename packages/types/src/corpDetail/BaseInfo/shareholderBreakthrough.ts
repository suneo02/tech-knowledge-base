import { ShareRateIdentifier } from '../shareholder'

/**
 * 股东类型枚举
 */
export type ShareholderType = 'bond' // 1:企业 2:个人 3:其他

/**
 * 股东类型名称
 */
export type ShareholderTypeName = 'company' | 'person' | 'other'

/**
 * 股东穿透路径节点
 */
export interface ShareholderBreakthroughNode {
  /** 层级 */
  level: string
  /** 持股比例 */
  percent: string
  /** 股东ID */
  shareholderId: string
  /** 股东名称 */
  shareholderName: string
  /** 股东类型 */
  type: ShareholderType
  /** 股东类型名称 */
  typeName: ShareholderTypeName
}

/**
 * 股东穿透信息
 */
export interface ShareholderBreakthrough extends ShareRateIdentifier {
  /** 穿透比例 */
  breakThroughPercent: string
  /** 层级 */
  level: string
  /** 穿透路径 */
  path: ShareholderBreakthroughNode[]
  /** 持股比例 */
  percent: string
  /** 持股路径字符串描述 */
  shareRouteStr: string
  /** 股东ID */
  shareholderId: string
  /** 股东名称 */
  shareholderName: string
  /** 股东类型 */
  type: ShareholderType
  /** 股东类型名称 */
  typeName: ShareholderTypeName
  /** 股东类型中文名称 */
  typeNameCn: string
  /** Wind ID */
  windId: string
}

/**
 * 股东穿透-合并统计 节点类型
 */
export interface ShareholderBreakthroughCombinedNode {
  /** 层级 */
  level: string
  /** 持股比例 */
  percent?: string
  /** 股东ID */
  shareholderId: string
  /** 股东名称 */
  shareholderName: string
  /** 股东类型 */
  type: string
  /** 股东类型名称 */
  typeName: string
}

/**
 * 股东穿透-合并统计
 */
export interface ShareholderBreakthroughCombined extends ShareRateIdentifier {
  /** 穿透比例 */
  breakThroughPercent: string
  /** 股东穿透路径 */
  shareRoute: ShareholderBreakthroughCombinedNode[][]
  /** 路径总数 */
  shareRouteTotal: number
  /** 股东ID */
  shareholderId: string
  /** 股东名称 */
  shareholderName: string
  /** 股东类型 */
  type: string
  /** 股东类型名称 */
  typeName: string
  /** Wind ID */
  windId: string
}
