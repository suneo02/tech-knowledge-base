/**
 * 模块共享类型定义：统一描述数据结构、变体、筛选与表格模型等。
 * @author yxlu.calvin
 * @example
 * type Variant = FinancialVariant // 'domestic' | 'overseas'
 * interface Model extends TableModel {}
 */
import { UNIT_SCALES } from '../domain/value-objects/unitScale'
import { financialVariants } from '../config/variants'
import type { wfcCorpFinanceApiPath } from 'gel-api'

export interface FinancialData {
  companyCode: string
  periods: string[]
  metrics: Record<string, FinancialMetric>
  scenarios: FinancialScenario[]
  periodLabels?: Record<string, string>
  currencyDim?: string
}

export interface FinancialMetric {
  label: string
  values: Record<string, number | null>
}

export interface FinancialScenario {
  name: string
  description?: string
}

export interface FinancialTableRow {
  key: string
  label: string
  values: Record<string, number | null>
}

export type FinancialVariant = keyof typeof financialVariants

export type FinancialQueryParams = wfcCorpFinanceApiPath['detail/company/financialreportsummary']['data']

export interface FinancialFilters extends Partial<FinancialQueryParams> {
  scenarioIdx?: number
  unitScale?: keyof typeof UNIT_SCALES
  hideEmptyRows?: boolean
}

export interface FinancialFilterResponse {
  defaultReportTemplate?: string
  defaultReportType?: string
  reportTemplateOptions?: string[]
  reportTypeOptions?: string[]
}

export interface TableModel {
  columns: string[]
  rows: FinancialTableRow[]
  meta?: FinancialFilters
  periodLabels?: Record<string, string>
}
