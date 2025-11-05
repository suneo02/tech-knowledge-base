import { CorpBasicNumBaseInfo } from './baseInfo'
import { CorpBasicNumBussRisk } from './bussRisk'
import { CorpBasicNumBoolFlag } from './common'
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
    CorpBasicNumQualification,
    CorpBasicNumHistory,
    CorpBasicNumIntellectual,
    CorpBasicNumBaseInfo {
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

  structuralEntityCount: number // 结构性主体

  sharedstock_num_new: number // 发行股票
  listedSubjectSharesCount: number // 发行股票-上市主体股票

  declarcompany_num: number // 待上市信息
  sharedbonds_num: number // 发行债券
  cbrcreditratingreport_num: number // 发债主体评级
  companyabs_num: number // ABS信息
  mainbusinessstruct_num: number // 主营构成

  assetSheetCount: CorpBasicNumBoolFlag // 财务数据-资产负债表
  profitSheetCount: CorpBasicNumBoolFlag // 财务数据-利润表
  cashFlowSheetCount: CorpBasicNumBoolFlag // 财务数据-现金流表

  ranked_num: number // 上榜信息
  governmentgrants_num: number // 政府补贴

  insuranceNum: number // 保险产品
  invest_orgs_num: number // 投资机构
  invest_events_num: number // 投资事件
  pevc_num_new: number // PEVC融资
  pevcquit_num: number // PEVC退出
  chattle_financing_num: number // 动产融资

  chattelMortgagor: number // 动产抵押-抵押人
  chattelMortgagee: number // 动产抵押-抵押权人

  merge_num: number // 并购信息
  banktrust_num: number // 银行授信
}

export type CorpBasicNumFront = CorpBasicNum & CorpBasicNumFrontParsed
