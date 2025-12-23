import {
  ReportDetailCustomNodeJson,
  ReportDetailRawHtmlNodeJson,
  ReportDetailTableJson,
  TCorpDetailNodeKey,
  TCorpDetailSectionKey,
} from 'gel-types'
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
  | {
      type: 'rawHtml'
      id: TCorpDetailNodeKey | TCorpDetailSectionKey
    }
  | {
      type: 'element'
      element: any
    }

export interface FlattenedReportConfig {
  tableConfigsStore: Partial<Record<TCorpDetailNodeKey, ReportDetailTableJson>>
  sectionConfigStore: Partial<Record<string, SectionHeadingOptions>>
  // 自定义节点配置中心
  customNodeConfigStore: Partial<Record<TCorpDetailNodeKey, ReportDetailCustomNodeJson>>
  // raw html 节点配置中心
  rawHtmlNodeConfigStore: Partial<Record<TCorpDetailNodeKey, ReportDetailRawHtmlNodeJson>>
  renderOrder: Array<ReportRenderItem>
}
