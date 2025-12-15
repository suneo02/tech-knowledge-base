import { CorpBasicInfo, ReportPageJson, TCorpDetailNodeKey, TCorpDetailSectionKey } from 'gel-types'

/**
 * 根据企业类型筛选报告配置
 */

export const filterReportConfigByCorpType = (
  reportConfig: ReportPageJson,
  corpType: CorpBasicInfo['configType'] | undefined
): ReportPageJson => {
  // 如果是 个体工商户 即 IIP 去除 两个风险 和 资质荣誉模块
  const keysToRemove: (TCorpDetailNodeKey | TCorpDetailSectionKey)[] = ['Qualification', 'JudicialRisk', 'BusinessRisk']
  if (corpType === 'IIP') {
    return reportConfig.filter((section) => {
      return keysToRemove.indexOf(section.key) === -1
    })
  }
  return reportConfig
}
