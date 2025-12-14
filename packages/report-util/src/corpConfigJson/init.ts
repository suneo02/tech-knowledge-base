import { TIntl } from '@/types'
import { ReportDetailNodeOrNodesJson, ReportDetailSectionJson, ReportPageJson } from 'gel-types'
import { configDetailIntlHelper } from './intlHelper'
import { procssNodeTitle } from './procssNodeTitle'
import { isTableConfig } from './table'
import { FlattenedReportConfig } from './type'

export const flattenReportConfig = (
  rootSections: ReportPageJson,
  startLevel: number = 1,
  t: TIntl
): FlattenedReportConfig => {
  const tableConfigsStore: FlattenedReportConfig['tableConfigsStore'] = {}
  const sectionConfigStore: FlattenedReportConfig['sectionConfigStore'] = {}
  const customNodeConfigStore: FlattenedReportConfig['customNodeConfigStore'] = {}
  const rawHtmlNodeConfigStore: FlattenedReportConfig['rawHtmlNodeConfigStore'] = {}
  const renderOrder: FlattenedReportConfig['renderOrder'] = []

  const recursiveInitializeSection = (
    sectionOrNode: ReportDetailSectionJson | ReportDetailNodeOrNodesJson,
    numbers: number[],
    level: number
  ): void => {
    if (!sectionOrNode) {
      return
    }
    // 处理标题
    if (sectionOrNode.title) {
      const processRes = procssNodeTitle(sectionOrNode, t, level, numbers)
      if (processRes) {
        sectionConfigStore[processRes.renderOrder.id] = processRes.headingOptions
        renderOrder.push(processRes.renderOrder)
      }
    }

    if (isTableConfig(sectionOrNode)) {
      const tableConfig = sectionOrNode
      const tableId = tableConfig.key
      tableConfigsStore[tableId] = tableConfig
      renderOrder.push({ type: 'table', id: tableId })
    } else if (sectionOrNode.type === 'custom') {
      renderOrder.push({ type: 'custom', id: sectionOrNode.key })
      customNodeConfigStore[sectionOrNode.key] = sectionOrNode
    } else if (sectionOrNode.type === 'rawHtml') {
      renderOrder.push({ type: 'rawHtml', id: sectionOrNode.key })
      rawHtmlNodeConfigStore[sectionOrNode.key] = sectionOrNode
    } else if ('children' in sectionOrNode && sectionOrNode.children && sectionOrNode.children.length) {
      sectionOrNode.children.forEach((childSection, childIndex) => {
        const childNumbers = [...numbers, childIndex + 1]
        recursiveInitializeSection(childSection, childNumbers, level + 1)
      })
    } else {
      console.error('Unknown section or node type:', sectionOrNode)
    }
    // 如果是 secion comment 需要在此处处理，之后不会再处理
    if (sectionOrNode.type === 'section') {
      if (sectionOrNode.commentSuffix || sectionOrNode.commentSuffixIntl) {
        const commentSuffix = configDetailIntlHelper(sectionOrNode, 'commentSuffix', t)
        renderOrder.push({ type: 'element', element: commentSuffix })
      }
    }
  }

  rootSections.forEach((section, index) => {
    const sectionNumbers = [index + 1]
    recursiveInitializeSection(section, sectionNumbers, startLevel)
  })

  return {
    tableConfigsStore,
    sectionConfigStore,
    renderOrder,
    customNodeConfigStore,
    rawHtmlNodeConfigStore,
  }
}
