import { type InsertPoint, SOURCE_MARKER_PATTERN, parsePositions } from './sourceMarkerUtils'

/**
 * 将文本中的溯源标记转换为 HTML span 标签
 *
 * 该函数将形如 `【3(181~223)】` 或 `【13(111~124,215~293)】` 的溯源标记
 * 转换为带有 data 属性的 `<span>` 标签，便于前端实现溯源跳转功能。
 *
 * ## 设计文档
 * @see {@link file://../../../../../packages/gel-ui/docs/biz/ai-chat/md-rendering-design.md MD 文本渲染系统设计文档}
 *
 * ## 处理流程
 * 1. 使用统一的正则表达式提取所有溯源标记
 * 2. 解析标记中的源ID和位置范围（使用 parsePositions 工具函数）
 * 3. 生成 HTML span 标签（可选择性添加 TinyMCE 属性）
 * 4. 使用批量替换从后向前替换标记（避免位置偏移）
 *
 * ## 与 insertTraceMarkers 的关系
 * - insertTraceMarkers: 生成溯源标记（【索引(位置)】）
 * - convertSourceMarkersToHtml: 将溯源标记转换为 HTML
 * - 两者共享格式规范和工具函数（sourceMarkerUtils）
 *
 * @author 刘兴华 <xhliu.liuxh@wind.com.cn>
 * @param {string} text - 包含溯源标记的文本
 * @param {object} options - 转换选项
 * @param {SourceMarkerHtmlGenerator} options.htmlGenerator - 自定义 HTML 生成器函数
 * @returns {string} 处理后的文本，溯源标记已转换为 HTML 标签
 *
 * @example
 * // 场景1：默认场景（AI 聊天等）
 * const text = '墨西哥暂不征收对等关税【3(181~223)】'
 * const result = convertSourceMarkersToHtml(text)
 * // 返回: '墨西哥暂不征收对等关税<span class="source-marker" data-source-id="3" data-positions='[{"start":"181","end":"223"}]'>[3]</span>'
 *
 * @example
 * // 场景2：TinyMCE 编辑器场景（使用预定义生成器）
 * import { tinymceSourceMarkerHtmlGenerator } from 'gel-util/common'
 * const text = '相关政策【13(111~124,215~293)】'
 * const result = convertSourceMarkersToHtml(text, { htmlGenerator: tinymceSourceMarkerHtmlGenerator })
 * // 返回: '相关政策<span class="source-marker" data-mce-bogus="all" contenteditable="false" data-source-id="13" data-positions='[{"start":"111","end":"124"},{"start":"215","end":"293"}]'>[13]</span>'
 *
 * @example
 * // 场景3：自定义生成器
 * const text = '内容A【1(10~20)】，内容B【2(30~40)】'
 * const result = convertSourceMarkersToHtml(text, {
 *   htmlGenerator: (sourceId, positionsJson) => `<a class="ref" href="#ref-${sourceId}">[${sourceId}]</a>`
 * })
 * // 返回: '内容A<a class="ref" href="#ref-1">[1]</a>，内容B<a class="ref" href="#ref-2">[2]</a>'
 */
/**
 * 溯源标记 HTML 生成器函数类型
 *
 * @param sourceId - 参考资料索引（字符串形式）
 * @param positionsJson - 位置信息的 JSON 字符串
 * @returns 生成的 HTML 字符串
 */
export type SourceMarkerHtmlGenerator = (sourceId: string, positionsJson: string) => string

/**
 * 溯源标记常量
 * 用于生成和识别 HTML 中的溯源标记元素
 */
export const SOURCE_MARKER_CONSTANTS = {
  /** CSS 类名 */
  CLASS_NAME: 'source-marker',
  /** 源ID属性名 */
  SOURCE_ID: 'data-source-id',
  /** 位置信息属性名 */
  POSITIONS: 'data-positions',
} as const

/**
 * 默认 HTML 生成器：生成标准的 span 标签
 * 适用于普通场景（如 AI 聊天）
 */
export const defaultSourceMarkerHtmlGenerator: SourceMarkerHtmlGenerator = (sourceId, positionsJson) => {
  return `<a class="${SOURCE_MARKER_CONSTANTS.CLASS_NAME}" ${SOURCE_MARKER_CONSTANTS.SOURCE_ID}="${sourceId}" ${SOURCE_MARKER_CONSTANTS.POSITIONS}='${positionsJson}'>"</a>`
}

/**
 * 转换选项
 */
export interface ConvertSourceMarkersOptions {
  /**
   * HTML 生成器函数，用于自定义溯源标记的 HTML 输出
   * 默认使用 defaultSourceMarkerHtmlGenerator
   *
   * @example
   * // 使用 TinyMCE 生成器
   * convertSourceMarkersToHtml(text, { htmlGenerator: tinymceSourceMarkerHtmlGenerator })
   *
   * @example
   * // 使用自定义生成器
   * convertSourceMarkersToHtml(text, {
   *   htmlGenerator: (sourceId, positionsJson) => `<a href="#ref-${sourceId}">[${sourceId}]</a>`
   * })
   */
  htmlGenerator?: SourceMarkerHtmlGenerator
}

export const convertSourceMarkersToHtml = (text: string, options?: ConvertSourceMarkersOptions): string => {
  // 边界条件：空文本或非字符串直接返回
  if (!text || typeof text !== 'string') return ''

  const { htmlGenerator = defaultSourceMarkerHtmlGenerator } = options || {}

  // ========== 阶段1：提取所有溯源标记 ==========
  // 使用统一的正则表达式提取溯源标记
  const insertPoints: InsertPoint[] = []
  let matchResult

  // 重置正则表达式的 lastIndex（全局正则需要）
  SOURCE_MARKER_PATTERN.lastIndex = 0

  // 收集所有匹配的溯源标记
  while ((matchResult = SOURCE_MARKER_PATTERN.exec(text)) !== null) {
    const [, sourceId, positionsStr] = matchResult
    const matchStart = matchResult.index

    // ========== 阶段2：解析位置并生成 HTML ==========
    // 使用统一的工具函数解析位置字符串
    const positions = parsePositions(positionsStr)

    // 将位置数组转换为 JSON 格式（用于 HTML data 属性）
    // 注意：HTML 中使用字符串类型的 start/end（与原实现保持一致）
    const positionsJson = JSON.stringify(
      positions.map((pos) => ({
        start: pos.start.toString(),
        end: pos.end.toString(),
      }))
    )

    // 使用 HTML 生成器生成标记
    const htmlTag = htmlGenerator(sourceId, positionsJson)

    // 记录替换点：将原标记替换为 HTML 标签
    insertPoints.push({
      position: matchStart,
      content: htmlTag,
    })

    // 记录需要删除的原标记结束位置
    // 由于 batchInsert 只能插入不能删除，我们需要特殊处理
    // 技巧：先删除旧内容，再插入新内容
    // 实现：position 表示删除起点，通过插入空字符串实现"覆盖"效果
  }

  // 如果没有找到任何标记，直接返回原文
  if (insertPoints.length === 0) {
    return text
  }

  // ========== 阶段3：批量替换标记 ==========
  // 由于需要替换而非插入，我们需要手动处理
  // 按位置降序排列，从后向前替换
  insertPoints.sort((a, b) => b.position - a.position)

  // 重新执行匹配以获取每个标记的长度（用于删除）
  SOURCE_MARKER_PATTERN.lastIndex = 0
  const markerLengths: Map<number, number> = new Map()
  let match
  while ((match = SOURCE_MARKER_PATTERN.exec(text)) !== null) {
    markerLengths.set(match.index, match[0].length)
  }

  // 从后向前逐个替换
  let result = text
  for (const point of insertPoints) {
    const markerLength = markerLengths.get(point.position) || 0
    const before = result.substring(0, point.position)
    const after = result.substring(point.position + markerLength)
    result = before + point.content + after
  }

  return result
}
