import { PaginationParams } from 'gel-api'
import { BalanceSheetData, CashFlowData, FinancialIndicatorData, ProfitData } from 'gel-types'
import type { ApiResponse } from '../../types'

export type CorpBussApiPaths = {
  // 资产负债表
  'detail/company/getbalancesheet': {
    params: PaginationParams
    response: ApiResponse<BalanceSheetData[]>
  }
  // 利润表
  'detail/company/getprofit': {
    params: PaginationParams
    response: ApiResponse<ProfitData[]>
  }
  // 现金流量表
  'detail/company/getcashflowsheet': {
    params: PaginationParams
    response: ApiResponse<CashFlowData[]>
  }
  // 财务指标
  '/detail/company/financialIndicator': {
    params: PaginationParams
    response: ApiResponse<FinancialIndicatorData[]>
  }
}
