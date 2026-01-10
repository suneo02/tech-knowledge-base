import { ShareRateIdentifier, ShareRouteDetail } from '../shareholder'

/**
 * 受益人类型枚举
 */
export type BeneficiaryNameType = 'person' | 'company'

/**
 * 一致行动人信息
 */
export interface BeneficiaryActor {
  /** 一致行动人ID */
  id: string
  /** 一致行动人名称 */
  name: string
  /** 关联类型 */
  relationType?: string
}

/**
 * 受益人基础信息
 */
export interface BaseBeneficiary extends ShareRateIdentifier {
  /** 一致行动人列表 */
  actor: BeneficiaryActor[]
  /** 受益类型标签 */
  beneficType: string
  /** 受益人ID */
  beneficiaryId: string
  /** 详情ID */
  detailId: string
  /** 是否有持股链路 */
  isShareRoute: boolean
  /** 判定原因 */
  judgeReason?: string
  /** 受益人姓名/公司名 */
  name: string
  /** 受益人类型 */
  nameType: BeneficiaryNameType
  /** 持股比例 */
  shareRate: string
  /** 持股路径列表 */
  shareRoute: ShareRouteDetail[]
}

/**
 * 企业详情-受益所有人
 */
export interface BeneficiaryOwner extends BaseBeneficiary {
  /** 受益人图片链接 */
  personImgT?: string
}

/**
 * 企业详情-受益自然人
 */
export interface BeneficiaryNaturalPerson extends BaseBeneficiary {
  /** 职位类型（多个职位用逗号分隔） */
  jobType?: string
  /** 受益人图片链接 */
  personImgT?: string
}

/**
 * 企业详情-受益机构
 */
export interface BeneficiaryInstitution extends BaseBeneficiary {
  /** 受益机构图片链接 */
  personImgT?: string
}

/**
 * 历史受益人
 */
export interface HistoricalBeneficiary extends ShareRateIdentifier {
  /** 受益人ID */
  beneficiaryId: string
  /** 受益人姓名 */
  beneficiaryName: string
  /** 公司代码 */
  companyCode: string
  /** 详情ID */
  detailId: string
  /** 结束日期 */
  endDate?: string
  /** 是否有持股链路 */
  isShareRoute: boolean
  /** 持股比例（数值类型） */
  ratio?: number
  /** 持股路径列表 */
  shareRoute: ShareRouteDetail[]
}
