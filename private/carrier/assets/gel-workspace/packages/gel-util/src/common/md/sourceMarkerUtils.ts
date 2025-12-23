/**
 * 溯源标记（Source Marker）工具函数和类型定义
 *
 * 该模块定义了溯源标记的统一格式规范、类型定义和工具函数，
 * 为 insertTraceMarkers 和 convertSourceMarkersToHtml 提供共享基础设施。
 *
 * ## 设计文档
 * @see {@link file://../../../../../packages/gel-ui/docs/biz/ai-chat/md-rendering-design.md MD 文本渲染系统设计文档}
 *
 * @author 刘兴华 <xhliu.liuxh@wind.com.cn>
 */

// ==================== 类型定义 ====================

/**
 * 溯源位置范围
 * 表示在参考资料中的字符位置区间
 */
export interface SourcePosition {
  /** 起始位置（字符索引） */
  start: number
  /** 结束位置（字符索引） */
  end: number
}

/**
 * 溯源标记数据
 * 用于在文本中标记引用来源
 */
export interface SourceMarker {
  /** 参考资料索引（0~n 对应 DPU 表格或参考文献列表） */
  sourceId: number
  /** 在参考资料中的位置范围数组 */
  positions: SourcePosition[]
}

/**
 * 文本插入点
 * 用于批量插入标记时的位置记录
 */
export interface InsertPoint {
  /** 插入位置（字符索引） */
  position: number
  /** 要插入的内容 */
  content: string
}

// ==================== 常量定义 ====================

/**
 * 溯源标记的格式规范
 *
 * 标记格式：【sourceId(start~end，start~end)】
 * - 使用中文方括号【】作为标记边界
 * - sourceId：参考资料索引（数字）
 * - start~end：位置范围，使用波浪号连接
 * - 多个位置范围用中文逗号，分隔
 *
 * 示例：
 * - 单个位置：【3(181~223)】
 * - 多个位置：【13(111~124，215~293)】
 */
export const SOURCE_MARKER_FORMAT = {
  /** 标记开始符号 */
  START_BRACKET: '【',
  /** 标记结束符号 */
  END_BRACKET: '】',
  /** 位置范围分隔符（波浪号） */
  RANGE_SEPARATOR: '~',
  /** 多个位置的分隔符（中文逗号） */
  POSITION_SEPARATOR: '，',
  /** 位置列表的包裹符号 */
  POSITION_WRAPPER_START: '(',
  POSITION_WRAPPER_END: ')',
} as const

/**
 * 溯源标记的正则表达式
 *
 * 匹配格式：【数字(位置范围列表)】
 * - 位置范围：数字~数字
 * - 多个范围用逗号或中文逗号分隔
 *
 * 捕获组：
 * - 组1：sourceId（数字）
 * - 组2：位置范围字符串（如：111~124,215~293）
 */
export const SOURCE_MARKER_PATTERN = /【(\d+)\(([\d~,，]+?)\)】/g

// ==================== 工具函数 ====================

/**
 * 格式化位置范围为字符串
 *
 * 将位置范围数组转换为标准格式的字符串
 * 格式：start~end，start~end
 *
 * @param {SourcePosition[]} positions - 位置范围数组
 * @returns {string} 格式化后的字符串
 *
 * @example
 * formatPositions([{ start: 10, end: 20 }, { start: 30, end: 40 }])
 * // 返回: '10~20，30~40'
 */
export const formatPositions = (positions: SourcePosition[]): string => {
  return positions
    .map((pos) => `${pos.start}${SOURCE_MARKER_FORMAT.RANGE_SEPARATOR}${pos.end}`)
    .join(SOURCE_MARKER_FORMAT.POSITION_SEPARATOR)
}

/**
 * 解析位置范围字符串
 *
 * 将标记中的位置字符串解析为位置范围数组
 * 支持中文逗号和英文逗号作为分隔符
 *
 * @param {string} positionsStr - 位置字符串（如：'111~124,215~293'）
 * @returns {SourcePosition[]} 解析后的位置范围数组
 *
 * @example
 * parsePositions('111~124,215~293')
 * // 返回: [{ start: 111, end: 124 }, { start: 215, end: 293 }]
 *
 * @example
 * parsePositions('111~124，215~293')  // 支持中文逗号
 * // 返回: [{ start: 111, end: 124 }, { start: 215, end: 293 }]
 */
export const parsePositions = (positionsStr: string): SourcePosition[] => {
  // 支持中文逗号和英文逗号
  return positionsStr.split(/[,，]/).map((pos) => {
    const [startStr, endStr] = pos.split(SOURCE_MARKER_FORMAT.RANGE_SEPARATOR).map((s) => s.trim())
    return {
      start: parseInt(startStr, 10),
      end: parseInt(endStr, 10),
    }
  })
}

/**
 * 生成溯源标记字符串
 *
 * 根据参考资料索引和位置范围生成完整的溯源标记
 * 格式：【sourceId(start~end，start~end)】
 *
 * @param {number} sourceId - 参考资料索引
 * @param {SourcePosition[]} positions - 位置范围数组
 * @returns {string} 完整的溯源标记字符串
 *
 * @example
 * buildSourceMarker(3, [{ start: 181, end: 223 }])
 * // 返回: '【3(181~223)】'
 *
 * @example
 * buildSourceMarker(13, [{ start: 111, end: 124 }, { start: 215, end: 293 }])
 * // 返回: '【13(111~124，215~293)】'
 */
export const buildSourceMarker = (sourceId: number, positions: SourcePosition[]): string => {
  const positionsStr = formatPositions(positions)
  return `${SOURCE_MARKER_FORMAT.START_BRACKET}${sourceId}${SOURCE_MARKER_FORMAT.POSITION_WRAPPER_START}${positionsStr}${SOURCE_MARKER_FORMAT.POSITION_WRAPPER_END}${SOURCE_MARKER_FORMAT.END_BRACKET}`
}

/**
 * 规范化位置数组（去重 + 排序）
 *
 * 对位置数组进行处理：
 * 1. 去除重复的位置范围
 * 2. 按 start 位置升序排列
 *
 * @param {SourcePosition[]} positions - 原始位置数组
 * @returns {SourcePosition[]} 处理后的位置数组
 *
 * @example
 * normalizePositions([
 *   { start: 30, end: 40 },
 *   { start: 10, end: 20 },
 *   { start: 10, end: 20 }  // 重复
 * ])
 * // 返回: [{ start: 10, end: 20 }, { start: 30, end: 40 }]
 */
export const normalizePositions = (positions: SourcePosition[]): SourcePosition[] => {
  return [...positions]
    .filter((pos, idx, self) => {
      // 去重：只保留第一次出现的位置
      return self.findIndex((t) => t.start === pos.start && t.end === pos.end) === idx
    })
    .sort((a, b) => a.start - b.start) // 按 start 升序排列
}

/**
 * 批量插入内容到文本中
 *
 * 从后向前批量插入内容，避免位置偏移问题
 *
 * 算法说明：
 * - 将插入点按位置降序排列
 * - 从后向前逐个插入（后面的插入不影响前面的位置）
 *
 * @param {string} text - 原始文本
 * @param {InsertPoint[]} insertPoints - 插入点数组
 * @returns {string} 插入后的文本
 *
 * @example
 * const text = 'ABCDEFGH'
 * const insertPoints = [
 *   { position: 4, content: '[1]' },
 *   { position: 2, content: '[2]' }
 * ]
 * batchInsert(text, insertPoints)
 * // 返回: 'AB[2]CD[1]EFGH'
 */
export const batchInsert = (text: string, insertPoints: InsertPoint[]): string => {
  // 按位置降序排列（从后向前插入）
  const sortedPoints = [...insertPoints].sort((a, b) => b.position - a.position)

  let result = text
  for (const point of sortedPoints) {
    const before = result.substring(0, point.position)
    const after = result.substring(point.position)
    result = before + point.content + after
  }

  return result
}
