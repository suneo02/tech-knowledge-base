import { ReportDetailNodeOrNodesJson, ReportDetailSectionJson, ReportDetailTableJson } from 'gel-types'

export const isTableConfig = (
  config: ReportDetailNodeOrNodesJson | ReportDetailSectionJson
): config is ReportDetailTableJson => {
  return config.type === 'horizontalTable' || config.type === 'verticalTable' || config.type === 'crossTable'
}
