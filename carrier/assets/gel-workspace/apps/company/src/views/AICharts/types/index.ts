/**
 * @description 构建图谱项类型
 */
export interface BuildGraphItem {
  key: string
  title: string
  img: string
}

/**
 * @description AI图谱菜单项key
 */
export const AIGRAPH_MENU_KEYS = {
  HOME: 'ai-graph-home',
  BUILD: 'ai-graph-build',
} as const

/**
 * @description AI构建菜单项key
 */
export const AIGRAPH_BUILD_MENU_KEYS = {
  AI_BUILD: 'ai-graph-build',
  MARKDOWN_BUILD: 'markdown-graph-build',
  EXCEL_BUILD: 'excel-graph-build',
} as const

/**
 * @description AI图谱Excel表格key
 */
export const AIGRAPH_EXCEL_SHEET_KEYS = {
  GRAPH: 'graph',
  RELATION: 'relation',
  NODE: 'node',
  BASIC: 'basic',
} as const

/**
 * @description AI图谱右侧标签key
 */
export const AIGRAPH_RIGHT_TABS_KEYS = {
  EXCEL: 'excel',
  GRAPH: 'graph',
} as const

/**
 * @description AI图谱SVG类型图
 */
export const AIGRAPH_SVG_TYPES = {
  DAGRE: 'dagre',
  FORCE: 'force',
  TREE: 'tree',
} as const

/**
 * @description AI图谱菜单项key类型
 */
export type AIGraphMenuKey = (typeof AIGRAPH_MENU_KEYS)[keyof typeof AIGRAPH_MENU_KEYS]

/**
 * @description AI构建菜单项key类型
 */
export type AIGraphBuildMenuKey = (typeof AIGRAPH_BUILD_MENU_KEYS)[keyof typeof AIGRAPH_BUILD_MENU_KEYS]

/**
 * @description AI图谱Excel表格key类型
 */
export type AIGraphExcelSheetKey = (typeof AIGRAPH_EXCEL_SHEET_KEYS)[keyof typeof AIGRAPH_EXCEL_SHEET_KEYS]

export type AIGraphRightTabKey = (typeof AIGRAPH_RIGHT_TABS_KEYS)[keyof typeof AIGRAPH_RIGHT_TABS_KEYS]

/**
 * @description AI图谱对话请求类型
 * user 输入框文本发送生成图谱
 * upload 文件上传生成图谱
 * modify 右侧数据表格编辑生成图谱
 * summary AI总结分析
 */
export type AIGraphFetchingType = 'user' | 'upload' | 'modify' | 'summary'
