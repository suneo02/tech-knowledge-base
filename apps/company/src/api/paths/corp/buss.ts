import type { PaginationParams, wfcCorpFinanceApiPath } from 'gel-api'
import {
  BalanceSheetData,
  CashFlowData,
  FinancialIndicatorData,
  FinancialIndicatorItem,
  FinancialIndicatorResponse,
  FinancialReportFilters,
  FinancialReportIndicatorProps,
  FinancialReportSummaryItem,
  ProfitData,
} from 'gel-types'
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
  '/detail/company/financialIndicatorV3': {
    params: FinancialReportIndicatorProps
    response: ApiResponse<FinancialIndicatorResponse>
  }
  // 财务报表汇总
  'detail/company/financialreportsummary': {
    params: wfcCorpFinanceApiPath['detail/company/financialreportsummary']['data']
    response: ApiResponse<FinancialReportSummaryItem[]>
  }
  // 财务报表筛选
  'detail/company/financialreportfilters': {
    params: wfcCorpFinanceApiPath['detail/company/financialreportfilters']['data']
    response: ApiResponse<FinancialReportFilters>
  }
}
