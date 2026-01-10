import { TCorpDetailNodeKey, TCorpDetailSectionKey } from '@/src/corpDetail'
import { ConfigDetailApiJSON, ConfigDetailCommentCfg, ConfigDetailTitleJSON } from '../common'
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

/**
 * raw html 节点，接口返回的是 html 字符串
 */
export type ReportDetailRawHtmlNodeJson = {
  type: 'rawHtml'
  key: TCorpDetailNodeKey | TCorpDetailSectionKey
} & ConfigDetailTitleJSON &
  ConfigDetailApiJSON &
  ConfigDetailCommentCfg

/**
 * 单个节点的配置 可能是一个表，也可能是 纯 html 节点
 * 标题只会有一个
 */
export type ReportDetailNodeJson = ReportDetailTableJson | ReportDetailCustomNodeJson | ReportDetailRawHtmlNodeJson

export type ReportDetailNodeWithChildrenJson = {
  type: 'nodeWithChildren'
  key: TCorpDetailNodeKey
  children?: ReportDetailNodeJson[]
  tooltips?: string
} & ConfigDetailTitleJSON

/**
 * 单个节点或者多个节点的配置
 */
export type ReportDetailNodeOrNodesJson = ReportDetailNodeJson | ReportDetailNodeWithChildrenJson

export type ReportDetailSectionJson = {
  type: 'section'
  key: TCorpDetailSectionKey
  /** 子节点 */
  children?: (ReportDetailSectionJson | ReportDetailNodeOrNodesJson)[]
} & ConfigDetailTitleJSON &
  ConfigDetailCommentCfg

export type ReportPageJson = (ReportDetailSectionJson | ReportDetailNodeOrNodesJson)[]
