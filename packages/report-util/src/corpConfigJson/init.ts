import { TIntl } from '@/types'
import { ReportDetailNodeJson, ReportDetailSectionJson, ReportPageJson } from 'gel-types'
import { configDetailIntlHelper } from './intlHelper'
import { isTableConfig } from './table'
import { SectionHeadingOptions, tableSectionsHelper } from './tableSection'
import { ProcessedInitializationData, ReportRenderItem } from './type'

const procssNodeTitle = (
  node: ReportDetailNodeJson | ReportDetailSectionJson,
  t: TIntl,
  level: number,
  numbers: number[]
):
  | {
      headingOptions: SectionHeadingOptions
      renderOrder: ReportRenderItem
    }
  | undefined => {
  if (!node.title) {
    return undefined
  }
  const sectionId = tableSectionsHelper.generateSectionId(node.key)

  const headingOptions: SectionHeadingOptions = {
    headingLevel: level,
    numbers,
    title: configDetailIntlHelper(node, 'title', t),
  }
  if (isTableConfig(node)) {
    return {
      headingOptions,
      renderOrder: {
        type: 'heading',
        id: sectionId,
        relevateTableId: node.key,
      },
    }
  } else {
    return {
      headingOptions,
      renderOrder: {
        type: 'heading',
        id: sectionId,
      },
    }
  }
}
export const processAndInitializeSectionsTree = (
  rootSections: ReportPageJson,
  startLevel: number = 1,
  t: TIntl
): ProcessedInitializationData => {
  const tableConfigsStore: ProcessedInitializationData['tableConfigsStore'] = {}
  const sectionConfigStore: ProcessedInitializationData['sectionConfigStore'] = {}
  const customNodeConfigStore: ProcessedInitializationData['customNodeConfigStore'] = {}
  const renderOrder: ProcessedInitializationData['renderOrder'] = []

  const recursiveInitializeSection = (
    sectionOrNode: ReportDetailSectionJson | ReportDetailNodeJson,
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
    } else if (sectionOrNode.children && sectionOrNode.children.length) {
      sectionOrNode.children.forEach((childSection, childIndex) => {
        const childNumbers = [...numbers, childIndex + 1]
        recursiveInitializeSection(childSection, childNumbers, level + 1)
      })
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
  }
}
