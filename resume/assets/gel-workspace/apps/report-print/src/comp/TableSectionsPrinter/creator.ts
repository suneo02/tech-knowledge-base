import { isEnForRPPrint, t } from '@/utils/lang'
import { TCorpDetailNodeKey } from 'gel-types'
import { getReportNodePrefixComment, getReportNodeSuffixComment, tableSectionsHelper } from 'report-util/corpConfigJson'
import { getReportNodeSuffixDataComment } from 'report-util/table'
import { sectionHeadingElementCreator } from '../SectionHeading/creator'
import { configTableCreator } from '../table/ConfigTable/creator'
import { createTableComment } from '../TableSectionsHelper/comp/tableComment'
import { TableSectionsStateCommon } from '../TableSectionsHelper/type'
import { createCorpIndustryTable } from './industry'

/**
 * 这个是渲染之后的元素类型，type 区分用来 给 pdf page 渲染添加不同的元素
 */
export type TableSectionsItem = 'heading' | 'table' | 'comment'

export const tableSectionsCreator = ({
  tableConfigsStore,
  customNodeConfigStore,
  apiDataStore,
  tableDataOverallStore,
  sectionHeadingConfigsStore,
  renderOrder,
}: TableSectionsStateCommon): {
  type: TableSectionsItem
  element: JQuery
}[] => {
  const elements: { type: TableSectionsItem; element: JQuery }[] = []

  const addHeading = (item: { type: TableSectionsItem; id: string }) => {
    const config = sectionHeadingConfigsStore[item.id]
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
  const addTable = (item: { type: 'table'; id: string }) => {
    try {
      const tableConfig = tableConfigsStore[item.id]
      const dataSource = apiDataStore[item.id]
      if (tableConfig) {
        const tableElement = configTableCreator(dataSource, tableConfig)
        elements.push({ type: 'table', element: tableElement })
      }
    } catch (error) {
      console.error('Error creating table for ', item, error)
    }
  }
  /**
   * 添加注释
   * @param item
   */
  const addComment = (item: { type: 'table' | 'custom'; id: TCorpDetailNodeKey }) => {
    try {
      const dataOverall = tableDataOverallStore[item.id]
      const tableConfig = tableConfigsStore[item.id]
      const customConfig = customNodeConfigStore[item.id]
      const config = tableConfig || customConfig

      // 数据量大于50条，则添加注释
      const dataComment = getReportNodeSuffixDataComment(isEnForRPPrint(), dataOverall, config)
      // 获取模块后缀注释
      const suffixComment = getReportNodeSuffixComment(item.id, config, t, isEnForRPPrint())
      if (suffixComment) {
        if (Array.isArray(suffixComment)) {
          suffixComment.forEach((item) => {
            elements.push({
              type: 'comment',
              element: createTableComment(item),
            })
          })
        } else {
          elements.push({
            type: 'comment',
            element: createTableComment(suffixComment),
          })
        }
      }
      if (dataComment) {
        elements.push({
          type: 'comment',
          element: createTableComment(dataComment),
        })
      }
    } catch (error) {
      console.error(`Error creating comment for ${item}:`, error)
    }
  }
  const addCustom = (item: { type: 'custom'; id: string }) => {
    const config = customNodeConfigStore[item.id]
    const dataSource = apiDataStore[item.id]
    if (!config) {
      return
    }
    switch (config.key) {
      case 'BelongIndustry':
        elements.push({
          type: 'table',
          element: createCorpIndustryTable(dataSource, config),
        })
        break
      default:
        break
    }
  }
  for (const item of renderOrder) {
    if (item.type === 'heading') {
      addHeading(item)
    } else if (item.type === 'table') {
      addTable(item)
      addComment(item)
    } else if (item.type === 'custom') {
      addCustom(item)
      addComment(item)
    }
  }
  return elements
}
