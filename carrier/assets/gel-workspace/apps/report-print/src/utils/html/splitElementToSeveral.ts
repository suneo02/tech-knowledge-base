import { rawHtmlToJQuery } from './RawHtml'

/**
 * 片段化后的 html 结构
 */
export interface HtmlSegment {
  /** 片段标题 */
  title: string
  /** 该标题及其子内容对应的 html 字符串 */
  html: string
}

/**
 * 需要在 HTML 中查找的元素 id。
 * 这些元素的第一个子节点视为标题，其余子节点视为内容。
 */
const idArr = [
  // 财报识别结果
  'table_analysis_result',
  // 科目变化诊断结果
  'subject_analysis_result',
  // 财务指标诊断结果q
  'finance_analysis_result',
  // 综合总结分析
  'summary_analysis_result',
]

/**
 * 根据 idArr 拆分 HTML，将每个目标元素转换为一个 HtmlSegment。
 * @param html          原始 html 字符串
 * @param _fallbackTitle 若拆分失败或片段无标题，使用该回退标题
 */
export const splitBaifenElementToSeveral = (html: string, _fallbackTitle: string = ''): HtmlSegment[] => {
  // 处理安全性
  const htmlSafe = rawHtmlToJQuery(html)

  const segments: HtmlSegment[] = []

  try {
    /**
     * 递归获取标题：沿 firstElementChild 向下，直到拿到非空文本
     */
    const getTitleRecursively = (node: Element | null): string => {
      if (!node) return ''
      const text = (node.textContent || '').trim()
      if (text) return text
      return getTitleRecursively(node.firstElementChild)
    }

    // 优先使用 jQuery（若环境已注入 $/jQuery），否则回退到 DOMParser / jsdom

    // 在浏览器或带有 jQuery 的环境下
    const $root = $('<div>').html(htmlSafe)
    // 将查找逻辑封装为函数以兼容后续 ID 遍历
    idArr.forEach((id) => {
      const $el = $root.find(`#${id}`).first()
      if (!$el.length) return

      const title = getTitleRecursively($el[0].firstElementChild)
      if (!title) return

      // 复制节点以便安全地删除标题，再获取剩余内容作为 html
      const $clone = $el.clone()
      // 删除第一个子节点（标题容器）
      const firstChild = $clone.children().first()
      if (firstChild.length) {
        firstChild.remove()
      }

      const contentHtml = $clone.html() || ''

      segments.push({ title, html: contentHtml })
    })

    // jQuery 路径走完即可直接返回
    return segments
  } catch (e) {
    console.warn('splitBaifenElementToSeveral: 解析失败，返回空结果', e)
  }

  // 未找到任何匹配元素或有效标题，返回空数组，调用方自行处理
  return segments
}
