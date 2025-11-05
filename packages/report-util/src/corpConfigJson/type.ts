import { ReportDetailCustomNodeJson, ReportDetailTableJson, TCorpDetailNodeKey } from 'gel-types'
import { SectionHeadingOptions } from './tableSection'

export type ReportRenderItem =
  | {
      type: 'heading'
      id: string
      relevateTableId?: TCorpDetailNodeKey
    }
  | {
      type: 'table'
      id: TCorpDetailNodeKey
    }
  | {
      type: 'custom'
      id: TCorpDetailNodeKey
    }

export interface ProcessedInitializationData {
  tableConfigsStore: Partial<Record<TCorpDetailNodeKey, ReportDetailTableJson>>
  sectionConfigStore: Partial<Record<string, SectionHeadingOptions>>
  // 自定义节点配置中心
  customNodeConfigStore: Partial<Record<TCorpDetailNodeKey, ReportDetailCustomNodeJson>>
  renderOrder: Array<ReportRenderItem>
}
