import { getOver50DataLocale } from '@/constants/common'
import { ApiResponseForWFC } from '@/types'
import { ReportDetailCustomNodeJson, ReportDetailTableJson } from 'gel-types'

export const getReportNodeSuffixDataComment = (
  isEn: boolean,
  data: ApiResponseForWFC<any> | undefined,
  config: ReportDetailTableJson | ReportDetailCustomNodeJson | undefined
) => {
  try {
    // 风险模块和大数据模块不显示注释
    if (config?.isRiskModule || config?.isBigData) {
      return
    }
    // 如果数据量大于50条，则添加注释
    if (data && data.Page && data.Page.Records > 50) {
      return getOver50DataLocale(data.Page.Records, isEn)
    }
  } catch (error) {
    console.error('getReportTableSuffixComment error', error)
    return
  }
}
