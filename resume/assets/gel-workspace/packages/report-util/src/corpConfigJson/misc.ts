import { ReportDetailNodeJson, ReportDetailSectionJson, ReportPageJson } from 'gel-types'

/**
 * Filter a ReportPageJson tree by an array of hidden node keys.
 * @param rootSections The original ReportPageJson
 * @param hiddenKeys Array of keys to hide (remove)
 * @returns A new ReportPageJson with hidden nodes removed
 */
export function filterReportPageJsonByHiddenKeys(rootSections: ReportPageJson, hiddenKeys: string[]): ReportPageJson {
  const isHidden = (node: { key: string }) => hiddenKeys.indexOf(node.key) > -1
  function filterSection(
    section: ReportDetailSectionJson | ReportDetailNodeJson
  ): ReportDetailSectionJson | ReportDetailNodeJson | null {
    if (isHidden(section)) return null
    if (section.type === 'section') {
      // Only sections can have children that are sections or nodes
      const s = section
      const filteredChildren = s.children ? s.children.map(filterSection).filter(Boolean) : undefined
      return {
        ...s,
        ...(filteredChildren ? { children: filteredChildren } : {}),
      }
    } else if (section.type === 'nodeWithChildren') {
      // nodeWithChildren can only have ReportDetailTableJson children
      const n = section
      const filteredChildren = n.children ? n.children.filter((child) => !isHidden(child)) : undefined
      return {
        ...n,
        ...(filteredChildren ? { children: filteredChildren } : {}),
      }
    }
    // For ReportDetailTableJson or ReportDetailUnknownNodeJson, just return if not hidden
    return section
  }
  try {
    return rootSections.map(filterSection).filter(Boolean) as ReportPageJson
  } catch (error) {
    console.error('filterReportPageJsonByHiddenKeys error', error)
    return rootSections
  }
}
