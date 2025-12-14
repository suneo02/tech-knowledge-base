export interface SplitOptions {
  /** 基础拆分长度 (纯文本字符数) */
  baseSplitLength?: number
  /** 最小拆分长度 (纯文本字符数) */
  minSplitLength?: number
  /** 当前页面是否为空白页 */
  isBlankPage?: boolean
  /** 智能拆分时，一个过高行最多被拆分成多少行 */
  maxRows?: number
}
/**
 * 单元格拆分器
 * 专门处理表格单元格内容的智能拆分逻辑
 */

export interface CellData {
  /** 单元格的纯文本内容 */
  content: string
  /** 单元格的 HTML 属性 */
  attributes: Record<string, string>
  /** 单元格的原始 HTML 内容 */
  html: string
}

export interface SplitResult {
  firstLineData: CellData[]
  remainingData: CellData[]
  didSplit: boolean
}

export interface HtmlUnit {
  htmlContent: string
}

export type CheckOverflowFn = ($element: JQuery) => boolean
