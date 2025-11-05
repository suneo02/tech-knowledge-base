/**
 * 表格数据接口
 * 用于存储表格的原始内容和上下文
 */
export interface TableData {
  /** 表格的原始内容 */
  tableContent: string
  /** 表格前的文本内容 */
  beforeTable: string
  /** 表格后的文本内容 */
  afterTable: string
}

/**
 * Markdown 表格接口
 * 用于存储解析后的表格数据结构
 * @example
 * ```markdown
 * | Name  | Age | City    |
 * |-------|-----|---------|
 * | Alice | 25  | Beijing |
 * | Bob   | 30  | Shanghai|
 * ```
 */
export interface MarkdownTable {
  /**
   * 是否为有效的表格
   * @description 用于标识当前数据是否为一个有效的 Markdown 表格结构
   * @default false
   */
  isTable: boolean

  /**
   * 表格的列标题数组
   * @description 存储表格的列标题，例如：['Name', 'Age', 'City']
   * @example ['Name', 'Age', 'City']
   */
  headers: string[]

  /**
   * 表格的数据行数组
   * @description 每一行是一个字符串数组，数组长度应与 headers 相同
   * @example [['Alice', '25', 'Beijing'], ['Bob', '30', 'Shanghai']]
   */
  rows: string[][]

  /**
   * 原始的 Markdown 表格文本
   * @description 保存未经处理的原始 Markdown 表格文本，用于调试和还原
   */
  rawText: string

  /**
   * 列对齐方式（可选）
   * @description 定义每列的对齐方式，可以是 'left'、'center' 或 'right'
   * @example ['left', 'right', 'center']
   */
  alignments?: Array<'left' | 'center' | 'right'>
}

/**
 * 表格处理结果接口
 * 用于存储表格处理的结果和位置信息
 */
export interface TableProcessResult {
  /** 解析后的表格数据 */
  tableData: MarkdownTable
  /** 表格在原文中的位置信息 */
  position: {
    /** 表格开始位置 */
    start: number
    /** 表格结束位置 */
    end: number
  }
}
