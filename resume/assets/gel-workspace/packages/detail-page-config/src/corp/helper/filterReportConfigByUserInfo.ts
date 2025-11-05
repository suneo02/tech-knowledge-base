import {
  ReportDetailNodeJson,
  ReportDetailSectionJson,
  ReportPageJson,
  TCorpDetailNodeKey,
  TCorpDetailSectionKey,
  UserPackageFlags,
} from 'gel-types'

/**
 * 筛选 报告中 需要去除的节点
 * 根据用户信息
 */

export const filterReportConfigByUserInfo = (
  reportConfig: ReportPageJson,
  userFlags?: UserPackageFlags
): ReportPageJson => {
  const keysToRemove: (TCorpDetailNodeKey | TCorpDetailSectionKey)[] = ['CoreTeam', 'JudicialRisk', 'BusinessRisk']

  const filterSection = (sectionOrNode: ReportDetailSectionJson | ReportDetailNodeJson) => {
    if (keysToRemove.indexOf(sectionOrNode.key) !== -1) {
      return false
    }
    if ('children' in sectionOrNode && sectionOrNode.children) {
      sectionOrNode.children = sectionOrNode.children.filter(filterSection)
    }
    return true
  }
  // 如果是海外用户，递归过滤掉这些节点
  if (userFlags?.isOverseas) {
    return reportConfig.filter((section) => {
      return filterSection(section)
    })
  }

  return reportConfig
}
