import { isEnForRPPrint, t } from '@/utils/lang'
import { TCorpDetailNodeKey } from 'gel-types'
import { getReportNodePrefixComment, tableSectionsHelper } from 'report-util/corpConfigJson'
import { sectionHeadingElementCreator } from '../SectionHeading/creator'
import { createTableComment } from '../TableComment/tableComment'
import { RPPrintState } from '../TableSectionsHelper/type'
import { TableSectionsElements } from './type'

export const addHeading = (
  item: { type: 'heading'; id: string },
  state: RPPrintState,
  elements: TableSectionsElements
) => {
  const { sectionConfigStore, apiDataStore, tableConfigsStore } = state
  const config = sectionConfigStore[item.id]
  if (!config) {
    return
  }
  // Check if this heading has an associated table with data
  // Extract the raw ID without the 'section-' prefix
  const relevateTableId = tableSectionsHelper.getRawIdFromSectionId(item.id)

  // Look for table data using the raw ID
  if (
    apiDataStore[relevateTableId] &&
    Array.isArray(apiDataStore[relevateTableId]) &&
    apiDataStore[relevateTableId].length > 0
  ) {
    try {
      // Try to get comment from CorpModule
      const comment = getReportNodePrefixComment(
        relevateTableId as TCorpDetailNodeKey,
        apiDataStore[relevateTableId][0],
        tableConfigsStore[relevateTableId],
        t,
        isEnForRPPrint()
      )

      // If we have a comment, add it as suffix to the heading
      if (comment) {
        const $commentElement = createTableComment(comment)
        config.suffix = $commentElement
      }
    } catch (error) {
      console.error(`Error creating comment for heading ${item.id}:`, error)
    }
  }

  const headingElement = sectionHeadingElementCreator(config)
  elements.push({ type: 'heading', element: headingElement })
}
