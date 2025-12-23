/**
 * PDFPage 类型定义
 * 定义了PDFPage组件使用的所有接口和类型
 */

/**
 * PDFPage配置选项
 */
export interface PDFPageProps {
  /** logo路径 */
  logoPath?: string
  /** 页眉右侧文本 */
  headerRightText?: string
  /** 页脚左侧文本 */
  footerLeftText?: string
  /** 页脚右侧文本 */
  footerRightText?: string
  pageWidth?: number
}

export interface PDFPageOptions {
  id?: string
  /** 是否显示页眉 */
  hideHeader?: boolean
  /** 是否隐藏页脚 */
  hideFooter?: boolean
  contentClassName?: string
}
/**
 * 表格选项接口，定义添加表格时的配置参数
 */
export interface TableOptions {
  /** 表格ID，如果不提供将自动生成 */
  tableId?: string
  /** 表头选择器，默认为'thead' */
  headerSelector?: string
  /** 表格体选择器，默认为'tbody' */
  bodySelector?: string
  /** 行选择器，默认为'tr' */
  rowSelector?: string
  /** 表格是否有表头（由系统动态判断） */
  hasHeader?: boolean
}

/**
 * 表格结构分析结果
 */
export interface TableStructure {
  /** 表头元素 */
  $header: JQuery
  /** 表体元素 */
  $body: JQuery
  /** 表格行元素 */
  $rows: JQuery
  /** 是否有表头 */
  hasHeader: boolean
}

/**
 * 表格测试结果
 */
export interface TableTestResult {
  /** 表格高度 */
  height: number
}
