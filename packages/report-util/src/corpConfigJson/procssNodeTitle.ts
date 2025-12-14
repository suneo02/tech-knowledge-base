import { TIntl } from '@/types'
import { ReportDetailNodeOrNodesJson, ReportDetailSectionJson, TCorpDetailNodeKey } from 'gel-types'
import { configDetailIntlHelper } from './intlHelper'
import { isTableConfig } from './table'
import { SectionHeadingOptions, tableSectionsHelper } from './tableSection'

export const procssNodeTitle = (
  node: ReportDetailNodeOrNodesJson | ReportDetailSectionJson,
  t: TIntl,
  level: number,
  numbers: number[]
):
  | {
      headingOptions: SectionHeadingOptions
      renderOrder: {
        type: 'heading'
        id: string
        relevateTableId?: TCorpDetailNodeKey
      }
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
