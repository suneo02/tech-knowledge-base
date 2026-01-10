import { RegionTypeEnum } from './reportSummary'

export type FilterOption = {
  label: string
  value: string
}

export interface FinancialReportFilters {
  reportDate: {
    value: string[]
  }
  reportType: {
    options: FilterOption[]
    value: string
  }
  reportTemplate: {
    options: FilterOption[]
    value: string
  }
}

export interface FinancialReportFiltersProps {
  regionType?: RegionTypeEnum
}
