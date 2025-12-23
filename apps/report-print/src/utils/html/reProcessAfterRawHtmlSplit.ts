import { RPPrintApiState } from '@/comp/TableSectionsHelper/type'
import {
  ReportDetailNodeOrNodesJson,
  ReportDetailRawHtmlNodeJson,
  ReportDetailSectionJson,
  ReportPageJson,
  TCorpDetailNodeKey,
  TCorpDetailSectionKey,
} from 'gel-types'
import { splitBaifenElementToSeveral } from './splitElementToSeveral'

/**
 * 拆分 rawHtml 后的返回结果
 */
export interface RawHtmlSplitResult {
  newConfig: ReportPageJson
  htmlStore: Record<string, string>
}

/**
 * 根据 apiState 中已获取的 html 字符串，自动拆分 ReportPageJson 中的 rawHtml 节点，
 * 并返回一个新的 config 以及 htmlStore。
 *
 * 目前的拆分策略：
 *  1. 使用 DOMParser 解析 html 字符串。
 *  2. 以首层级 H2~H6 标签作为边界，将 html 拆分为多个片段，每个片段形成一个新的 rawHtml 节点。
 *  3. key 规则：`<原 key>-<序号>`，序号从 1 开始递增。
 *  4. title 取对应 heading 的文本内容；若片段无 title，则回退到原节点 title。
 *
 * 注：该方法不会修改传入的 configRaw，而是返回深拷贝后的新对象。
 */
export const splitRawHtmlNodesInConfig = (configRaw: ReportPageJson, apiState: RPPrintApiState): RawHtmlSplitResult => {
  const { apiDataStore } = apiState
  const htmlStore: Record<string, string> = {}

  // 深拷贝，保证纯函数
  const newConfig: ReportPageJson = JSON.parse(JSON.stringify(configRaw))

  /**
   * 将 splitElementToSeveral 返回的片段数组转换为新的 rawHtml 节点数组，并填充 htmlStore
   */
  const buildNodesFromSegments = (
    rawNode: ReportDetailRawHtmlNodeJson,
    segments: ReturnType<typeof splitBaifenElementToSeveral>
  ): ReportDetailRawHtmlNodeJson[] =>
    segments.map((seg, idx) => {
      const newKey = `${rawNode.key}-${idx + 1}`
      htmlStore[newKey] = seg.html
      return {
        type: 'rawHtml',
        key: newKey as TCorpDetailNodeKey,
        title: seg.title,
        api: undefined, // 避免重新请求
      }
    })

  /**
   * 递归处理 section / nodeWithChildren / node 列表
   */
  const recursiveProcessChildren = (arr: (ReportDetailSectionJson | ReportDetailNodeOrNodesJson)[]) => {
    arr.forEach((item, index) => {
      if ('children' in item && item.children && Array.isArray(item.children)) {
        recursiveProcessChildren(item.children)
      } else if (item.type === 'rawHtml') {
        const rawNode = item
        const html = apiDataStore[rawNode.key]
        if (!html || typeof html !== 'string') {
          return // 无 html 时保持原样（不替换）
        }
        const segments = splitBaifenElementToSeveral(html, rawNode.title || '')
        const newRawNodes = buildNodesFromSegments(rawNode, segments)

        const newSection: ReportDetailSectionJson = {
          type: 'section',
          key: rawNode.key as TCorpDetailSectionKey,
          title: rawNode.title,
          commentSuffix: rawNode.commentSuffix,
          children: newRawNodes,
        }

        // 使用 section 替换原 rawHtml
        arr.splice(index, 1, newSection)
      }
    })
  }

  // 开始递归
  recursiveProcessChildren(newConfig)

  return { newConfig, htmlStore }
}
