import { ReportDetailCustomNodeJson, ReportDetailTableJson, TCorpDetailNodeKey, TCorpDetailSectionKey } from 'gel-types'
import { ReportRenderItem, SectionHeadingOptions } from 'report-util/corpConfigJson'
import { ApiResponseForWFC } from 'report-util/types'

export interface TableSectionsStateCommon {
  /** 表格配置存储 */
  tableConfigsStore: Partial<Record<TCorpDetailNodeKey, ReportDetailTableJson>>
  /** 自定义节点配置存储 */
  customNodeConfigStore: Partial<Record<TCorpDetailNodeKey, ReportDetailCustomNodeJson>>
  /** 表格数据存储 */
  apiDataStore: Partial<Record<TCorpDetailNodeKey, any>>
  /** 表格数据整体存储 */
  tableDataOverallStore: Partial<Record<TCorpDetailNodeKey, ApiResponseForWFC<any>>>
  /** 章节标题配置存储 */
  sectionHeadingConfigsStore: Partial<Record<TCorpDetailSectionKey, SectionHeadingOptions>>
  /** 记录渲染顺序的数组 */
  renderOrder: Array<ReportRenderItem>
}
