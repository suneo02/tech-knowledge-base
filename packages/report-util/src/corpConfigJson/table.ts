import { ReportDetailNodeJson, ReportDetailSectionJson, ReportDetailTableJson } from 'gel-types'

export const isTableConfig = (
  config: ReportDetailNodeJson | ReportDetailSectionJson
): config is ReportDetailTableJson => {
  return config.type === 'horizontalTable' || config.type === 'verticalTable' || config.type === 'crossTable'
}
