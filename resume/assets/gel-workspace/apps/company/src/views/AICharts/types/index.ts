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
 * @description AI图谱菜单项key类型
 */
export type AIGraphMenuKey = (typeof AIGRAPH_MENU_KEYS)[keyof typeof AIGRAPH_MENU_KEYS]

/**
 * @description AI构建菜单项key类型
 */
export type AIGraphBuildMenuKey = (typeof AIGRAPH_BUILD_MENU_KEYS)[keyof typeof AIGRAPH_BUILD_MENU_KEYS]
