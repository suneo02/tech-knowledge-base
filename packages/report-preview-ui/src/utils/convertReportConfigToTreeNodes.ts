import { DataNode } from '@wind/wind-ui/lib/tree'
import { ReportDetailNodeJson, ReportDetailSectionJson, ReportPageJson } from 'gel-types'
import { configDetailIntlHelper } from 'report-util/corpConfigJson'
import { tForRPPreview } from '.'

/**
 * Converts the ReportPageJson structure to TreeNodeConfig for the TreeComponent.
 * This is a standalone utility function.
 * @param reportPageConfig The report configuration.
 * @returns An array of TreeNodeConfig.
 */
export function convertReportConfigToTreeNodes(reportPageConfig: ReportPageJson): DataNode[] {
  try {
    const convertSection = (section: ReportDetailSectionJson | ReportDetailNodeJson): DataNode | undefined => {
      if (!section) {
        return undefined
      }
      if (!section.title && !section.titleIntl) {
        return undefined
      }
      const key = String(section.key)
      const title = configDetailIntlHelper(section, 'title', tForRPPreview)
      let children: DataNode[] | undefined = undefined

      if ((section.type === 'section' || section.type === 'nodeWithChildren') && section.children) {
        children = section.children
          .map((child) => {
            // Heuristic to distinguish between ReportDetailSectionJson and ReportDetailNodeJson
            return convertSection(child)
          })
          .filter((child): child is DataNode => child !== undefined)
      }
      return {
        key,
        title,
        children: children && children.length > 0 ? children : undefined,
      }
    }

    return reportPageConfig
      .map((section) => convertSection(section))
      .filter((section): section is DataNode => section !== undefined)
  } catch (error) {
    console.error(error)
    return []
  }
}
