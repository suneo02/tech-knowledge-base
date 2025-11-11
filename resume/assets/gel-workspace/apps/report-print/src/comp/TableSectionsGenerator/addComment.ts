import { isEnForRPPrint, t } from '@/utils/lang'
import { TCorpDetailNodeKey, TCorpDetailSectionKey } from 'gel-types'
import { getReportNodeSuffixComment } from 'report-util/corpConfigJson'
import { getReportNodeSuffixDataComment } from 'report-util/table'
import { createTableComment } from '../TableComment/tableComment'
import { RPPrintState } from '../TableSectionsHelper/type'
import { TableSectionsElements } from './type'

/**
 * 添加注释
 * @param item
 */

export const addComment = (
  item: { type: 'table' | 'custom' | 'rawHtml'; id: TCorpDetailNodeKey | TCorpDetailSectionKey },
  state: RPPrintState,
  elements: TableSectionsElements
) => {
  const { apiDataOverAllStore, tableConfigsStore, customNodeConfigStore, rawHtmlNodeConfigStore } = state
  try {
    const dataOverall = apiDataOverAllStore[item.id]
    const tableConfig = tableConfigsStore[item.id]
    const customConfig = customNodeConfigStore[item.id]
    const rawHtmlConfig = rawHtmlNodeConfigStore[item.id]
    const config = tableConfig || customConfig || rawHtmlConfig

    // 数据量大于50条，则添加注释
    const dataComment = getReportNodeSuffixDataComment(isEnForRPPrint(), dataOverall, config)
    // 获取模块后缀注释
    const suffixComment = getReportNodeSuffixComment(item.id, config, t, isEnForRPPrint())
    if (suffixComment) {
      if (Array.isArray(suffixComment)) {
        suffixComment.forEach((item) => {
          elements.push({
            type: 'paragraph',
            element: createTableComment(item),
          })
        })
      } else {
        elements.push({
          type: 'paragraph',
          element: createTableComment(suffixComment),
        })
      }
    }
    if (dataComment) {
      elements.push({
        type: 'paragraph',
        element: createTableComment(dataComment),
      })
    }
  } catch (error) {
    console.error(`Error creating comment for ${item}:`, error)
  }
}
