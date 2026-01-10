import { ApiResponseForWFC } from '@/types'
import {
  FinancialReportSummaryItem,
  FinancialReportFilters,
  FinancialReportSummaryProps,
  FinancialReportFiltersProps,
  FinancialReportIndicatorProps,
  FinancialIndicatorResponse,
} from 'gel-types'

export interface wfcCorpFinanceApiPath {
  'detail/company/financialreportsummary': {
    data?: FinancialReportSummaryProps
    response: ApiResponseForWFC<FinancialReportSummaryItem[]>
  }
  'detail/company/financialreportfilters': {
    data?: FinancialReportFiltersProps
    response: ApiResponseForWFC<FinancialReportFilters>
  }
  'detail/company/financialIndicatorV3': {
    data?: FinancialReportIndicatorProps
    response: ApiResponseForWFC<FinancialIndicatorResponse>
  }
}
