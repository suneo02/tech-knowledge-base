import { PaginationBaseParams } from 'gel-api/*'
import { BalanceSheetData, CashFlowData, FinancialIndicatorData, ProfitData } from 'gel-types'
import type { ApiResponse } from '../../types'

export type CorpBussApiPaths = {
  // 资产负债表
  'detail/company/getbalancesheet': {
    params: PaginationBaseParams
    response: ApiResponse<BalanceSheetData[]>
  }
  // 利润表
  'detail/company/getprofit': {
    params: PaginationBaseParams
    response: ApiResponse<ProfitData[]>
  }
  // 现金流量表
  'detail/company/getcashflowsheet': {
    params: PaginationBaseParams
    response: ApiResponse<CashFlowData[]>
  }
  // 财务指标
  '/detail/company/financialIndicator': {
    params: PaginationBaseParams
    response: ApiResponse<FinancialIndicatorData[]>
  }
}
