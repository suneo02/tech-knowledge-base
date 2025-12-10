import { validateReportDetailTableJson } from '@/validation'
import { ReportDetailTableJson } from 'gel-types'
import corpReportBalanceSheetJson from './BalanceSheet.json' assert { type: 'json' }
import corpReportCashFlowStatementJson from './CashFlowStatement.json' assert { type: 'json' }
import corpReportProfitStatementJson from './ProfitStatement.json' assert { type: 'json' }

import BussDataBusinessCumulativeJson from './BussDataBusinessCumulative.json' assert { type: 'json' }
import BussDataBusinessCurrentJson from './BussDataBusinessCurrent.json' assert { type: 'json' }
import BussDataInventoryCumulativeJson from './BussDataInventoryCumulative.json' assert { type: 'json' }
import BussDataInventoryCurrentJson from './BussDataInventoryCurrent.json' assert { type: 'json' }
import BussDataOutputCumulativeJson from './BussDataOutputCumulative.json' assert { type: 'json' }
import BussDataOutputCurrentJson from './BussDataOutputCurrent.json' assert { type: 'json' }
import BussDataSalesCumulativeJson from './BussDataSalesCumulative.json' assert { type: 'json' }
import BussDataSalesCurrentJson from './BussDataSalesCurrent.json' assert { type: 'json' }
import FinancialIndicatorJson from './FinancialIndicator.json' assert { type: 'json' }
import MainBusinessScope from './MainBusinessScope.json' assert { type: 'json' }

export const corpReportProfitStatement: ReportDetailTableJson =
  validateReportDetailTableJson(corpReportProfitStatementJson)
export const corpReportBalanceSheet: ReportDetailTableJson = validateReportDetailTableJson(corpReportBalanceSheetJson)

export const corpReportCashFlowStatement: ReportDetailTableJson = validateReportDetailTableJson(
  corpReportCashFlowStatementJson
)

export const corpBussDataOutputCumulative: ReportDetailTableJson =
  validateReportDetailTableJson(BussDataOutputCumulativeJson)
export const corpBussDataOutputCurrent: ReportDetailTableJson = validateReportDetailTableJson(BussDataOutputCurrentJson)
export const corpBussDataSalesCumulative: ReportDetailTableJson =
  validateReportDetailTableJson(BussDataSalesCumulativeJson)
export const corpBussDataSalesCurrent: ReportDetailTableJson = validateReportDetailTableJson(BussDataSalesCurrentJson)
export const corpBussDataBusinessCumulative: ReportDetailTableJson =
  validateReportDetailTableJson(BussDataBusinessCumulativeJson)
export const corpBussDataBusinessCurrent: ReportDetailTableJson =
  validateReportDetailTableJson(BussDataBusinessCurrentJson)
export const corpBussDataInventoryCumulative: ReportDetailTableJson = validateReportDetailTableJson(
  BussDataInventoryCumulativeJson
)
export const corpBussDataInventoryCurrent: ReportDetailTableJson =
  validateReportDetailTableJson(BussDataInventoryCurrentJson)

export const corpFinancialIndicator: ReportDetailTableJson = validateReportDetailTableJson(FinancialIndicatorJson)

export const corpMainBusinessScope: ReportDetailTableJson = validateReportDetailTableJson(MainBusinessScope)
