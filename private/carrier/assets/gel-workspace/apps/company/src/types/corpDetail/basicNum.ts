import { CorpBasicNum } from 'gel-types'

export interface CorpBasicNumFrontParsed {
  __overseacorp: number // 海外企业
  __specialcorp: number // 特殊企业

  /**
   * 商标
   */
  trademark_num_self: number // 本公司
  trademark_num_kgqy: number
  trademark_num_fzjg: number
  trademark_num_dwtz: number

  /**
   * 专利
   */
  patent_num_kgqy: number
  patent_num_fzjg: number
  patent_num_dwtz: number
  patent_num_bgs: number

  /**
   * 招投标
   */
  bid_num_kgqy: number
  bid_num_dwtz: number
  bid_num_fzjg: number
  bid_num_bgs: number

  /**
   * 招投标穿透
   */
  tid_num_kgqy: number
  tid_num_dwtz: number
  tid_num_fzjg: number
  tid_num_bgs: number

  /**
   * 财务报表数量（新）
   */
  domesticFinancialReportNum: number
  overseasFinancialReportNum: number

  /**
   * 财务指标数量（新）
   */
  domesticFinancialIndicatorNum: number
  overseasFinancialIndicatorNum: number

  /**
   * 自管基金
   */
  pe_amac_fundmanager_self_managed_fund_num: number
  /**
   * 已投基金
   */
  pe_enterpriselp_invested_fund_num: number
}

export type CorpBasicNumFront = Partial<CorpBasicNum & CorpBasicNumFrontParsed>
