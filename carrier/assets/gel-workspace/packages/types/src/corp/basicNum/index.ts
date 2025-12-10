import { CorpBasicNumBaseInfo } from './baseInfo'
import { CorpBasicNumBussRisk } from './bussRisk'
import { CorpBasicNumBoolFlag } from './common'
import { CorpBasicNumFinance } from './finance'
import { CorpBasicNumHistory } from './history'
import { CorpBasicNumIntellectual } from './intellectual'
import { CorpBasicNumJudicialRisk } from './judicialRisk'
import { CorpBasicNumFrontParsed } from './misc'
import { CorpBasicNumQualification } from './qualification'

/**
 * 企业详情 基础数字
 */
export interface CorpBasicNum
  extends CorpBasicNumJudicialRisk,
    CorpBasicNumBussRisk,
    CorpBasicNumQualification,
    CorpBasicNumHistory,
    CorpBasicNumIntellectual,
    CorpBasicNumBaseInfo,
    CorpBasicNumFinance {
  /**
   * 企业状态
   * 0 正常
   * 1 不存在
   * 2 屏蔽-产品端不展示
   */
  status: 0 | 1 | 2 // TODO 前端待处理

  /**
   * 基金公司类型
   * 0 非基金
   * 1 public
   * 2 private
   */
  fund_type: 0 | 1 | 2 | '0' | '1' | '2'

  /**
   * 香港非上市（0-否；1-是）
   */
  hkUnlisted: CorpBasicNumBoolFlag

  /**
   * 所属行业/产业
   */
  industryCount: number

  /**
   * 上市公司 业务数据的四个
   */
  outputCount: number // 业务产量
  salesCount: number // 业务销量
  businessCount: number // 业务量
  stockCount: number // 业务库存
}

export type CorpBasicNumFront = CorpBasicNum & CorpBasicNumFrontParsed

/**
 * 最终受益人相关的统计数字
 */
export interface CorpBasicNumBeneficial {
  beneficialOwner: boolean // 受益所有人
  beneficialNaturalPerson: boolean // 受益自然人
  beneficialInstitutions: boolean // 受益机构
}

/**
 * 股东相关的统计数字
 *
 */
export interface CorpBasicNumStock {
  shareHolderTree: boolean // 股东
  investTree: boolean // 对外投资
}
