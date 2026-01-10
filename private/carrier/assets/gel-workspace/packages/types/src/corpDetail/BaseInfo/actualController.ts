import { ShareRateIdentifier, ShareRouteDetail } from '../shareholder'

/**
 * 实控人类型枚举
 */
export type ActualControllerType = 'person' | 'company'

/**
 * 一致行动人信息
 */
export interface ActorInfo {
  /** 一致行动人ID */
  id: string
  /** 一致行动人名称 */
  name: string
  /** 关联类型 */
  relationType?: string
}

/**
 * 职位信息
 */
export interface PositionInfo {
  /** 职位名称 */
  position: string
  /** 职位排序 */
  positionSort: number
  /** 主要职位标识 */
  isPrimary?: boolean
}

/**
 * 实控人基础信息（通用字段）
 */
export interface BaseActualController extends ShareRateIdentifier {
  /** 实控人ID */
  ActControId: string
  /** 实控人姓名/公司名 */
  ActControName: string
  /** 实控人类型（person、company） */
  typeName: 'person' | 'company'
  /** 详情ID */
  detailId: string
  /** 公司ID（当实控人是公司时） */
  corpId?: string
  /** 公司名称（当实控人是公司时） */
  corpName?: string
  /** 是否有持股链路 */
  isShareRoute: boolean
  /** 实际持股比例 */
  ActInvestRate?: number
  /** 一致行动人列表 */
  actor: ActorInfo[]
  /** 持股链路信息 */
  shareRoute: ShareRouteDetail[]
  /** 职位信息 */
  position?: string
  /** 职位排序 */
  positionSort?: number
  /** 数据来源 */
  source?: string
  /** 序列ID */
  seqId: string
}

/**
 * 企业详情-实控人-疑似实控人
 */
export interface SuspectedActualController extends BaseActualController {}

/**
 * 公告披露-实控人
 */
export interface DisclosedActualController extends Omit<BaseActualController, 'ActInvestRate' | 'source'> {
  /** 实际持股比例（公告披露必填） */
  ActInvestRate: number
  /** 数据来源（公告披露必填） */
  source: string
}

/**
 * 历史实控人
 */
export interface HistoricalActualController extends ShareRateIdentifier {
  /** 公司代码 */
  companyCode: string
  /** 实控人ID */
  controllerId: string
  /** 实控人姓名/公司名 */
  controllerName: string
  /** 详情ID */
  detailId: string
  /** 结束日期 */
  endDate?: string
  /** 是否有持股链路 */
  isShareRoute: boolean
  /** 持股比例（数值类型） */
  ratio?: number
}
