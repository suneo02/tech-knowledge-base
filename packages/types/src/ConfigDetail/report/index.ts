import { TCorpDetailNodeKey, TCorpDetailSectionKey } from '@/src/corp'
import { ConfigDetailApiJSON, ConfigDetailTitleJSON } from '../common'
import { ReportDetailTableJson } from '../table'

/**
 * 自定义节点
 *
 * 实在无法用 json 配置的节点
 *
 * 根据对应的 key 来做渲染
 */

export type ReportDetailCustomNodeJson = {
  type: 'custom'
  key: TCorpDetailNodeKey
  [key: string]: any
} & ConfigDetailTitleJSON &
  ConfigDetailApiJSON

export type ReportDetailNodeWithChildrenJson = {
  type: 'nodeWithChildren'
  key: TCorpDetailNodeKey
  children?: ReportDetailTableJson[]
  tooltips?: string
} & ConfigDetailTitleJSON

/**
 * 单个节点的配置 可能是一个表，也可能是多个表格
 * 标题只会有一个
 */
export type ReportDetailNodeJson = ReportDetailNodeWithChildrenJson | ReportDetailTableJson | ReportDetailCustomNodeJson

export type ReportDetailSectionJson = {
  type: 'section'
  key: TCorpDetailSectionKey
  /** 子节点 */
  children?: (ReportDetailSectionJson | ReportDetailNodeJson)[]
} & ConfigDetailTitleJSON

export type ReportPageJson = ReportDetailSectionJson[]
