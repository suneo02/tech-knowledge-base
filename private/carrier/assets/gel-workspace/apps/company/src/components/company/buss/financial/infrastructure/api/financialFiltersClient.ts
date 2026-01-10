/**
 * 过滤项客户端：拉取报告期、报表类型与默认时间范围选项。
 * @author yxlu.calvin
 * @example
 * const client = createFinancialFiltersClient({ timeout: 30000 })
 * const filters = await client.fetchFilters('600000', 'domestic')
 * @remarks
 * - 接口路径：`detail/company/financialreportfilters`
 * - 选项回退：若 `value` 缺失则回退为选项数组首项的 `value`
 * - 区域枚举：`RegionTypeEnum.OE/CN` 与变体联动
 */
import { createRequest } from '@/api/request'
import { FinancialReportFilters, RegionTypeEnum } from 'gel-types'

export const createFinancialFiltersClient = (config: { timeout: number }) => {
  const fetchFilters = async (
    companyCode: string,
    variant: 'domestic' | 'overseas'
  ): Promise<FinancialReportFilters> => {
    const api = createRequest()
    const regionType = variant === 'overseas' ? RegionTypeEnum.OE : (RegionTypeEnum as any).CN
    const resp = await api('detail/company/financialreportfilters', {
      id: companyCode,
      params: { regionType },
      noHashParams: true,
    })
    const raw = resp?.Data
    const filters: FinancialReportFilters = {
      reportTemplate: {
        options: Array.isArray(raw?.reportTemplate?.options) ? raw.reportTemplate.options : [],
        value: raw.reportTemplate.value || raw?.reportTemplate?.options?.[0]?.value,
      },
      reportType: {
        options: Array.isArray(raw?.reportType?.options) ? raw.reportType.options : [],
        value: raw?.reportType?.value || raw?.reportType?.options?.[0]?.value,
      },
      reportDate: {
        value: raw.reportDate?.value || (raw as any).reportData?.value || ['', ''],
      },
    }
    return filters
  }

  return {
    fetchFilters,
  }
}
