import { CorpBasicNumFront, ReportDetailNodeOrNodesJson, ReportDetailSectionJson, ReportPageJson } from 'gel-types'
import { getCorpModuleNum } from './getCorpModuleNum'

/**
 * Filter a ReportPageJson tree by an array of hidden node keys.
 * @param rootSections The original ReportPageJson
 * @param hiddenKeys Array of keys to hide (remove)
 * @returns A new ReportPageJson with hidden nodes removed
 */

export function filterReportConfigByBasicNum(
  rootSections: ReportPageJson,
  corpBasicNum: Partial<CorpBasicNumFront> | undefined
): ReportPageJson {
  function filterSection(
    section: ReportDetailSectionJson | ReportDetailNodeOrNodesJson
  ): ReportDetailSectionJson | ReportDetailNodeOrNodesJson | null {
    if (section.type === 'verticalTable' || section.type === 'horizontalTable' || section.type === 'crossTable') {
      // 统计数字部分逻辑
      const num = getCorpModuleNum(section.countKey, corpBasicNum)
      if (!num && section.hideWhenEmptyInReport) {
        return null
      }
    }
    if ('children' in section && section.children) {
      section.children = section.children.map(filterSection).filter(Boolean)
    }
    // For ReportDetailTableJson or ReportDetailUnknownNodeJson, just return if not hidden
    return section
  }

  return rootSections.map(filterSection).filter(Boolean) as ReportPageJson
}
