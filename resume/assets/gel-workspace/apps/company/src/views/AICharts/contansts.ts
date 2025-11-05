import { AIGRAPH_MENU_KEYS, AIGRAPH_BUILD_MENU_KEYS } from './types/index'

/**
 * @description AI图谱菜单项配置
 */
export const AIGRAPH_MENU_ITEMS = [
  {
    key: AIGRAPH_MENU_KEYS.HOME,
    label: '图谱平台',
  },
  {
    key: AIGRAPH_MENU_KEYS.BUILD,
    label: 'AI构建',
  },
] as const

/**
 * @description AI构建菜单项配置
 */
export const AIGRAPH_BUILD_MENU_ITEMS = [
  {
    key: AIGRAPH_BUILD_MENU_KEYS.AI_BUILD,
    label: 'AI构建图谱',
    css: 'ai-graph-create',
  },
  {
    key: AIGRAPH_BUILD_MENU_KEYS.MARKDOWN_BUILD,
    label: 'Markdown构建图谱',
    css: 'ai-graph-markdown',
  },
  {
    key: AIGRAPH_BUILD_MENU_KEYS.EXCEL_BUILD,
    label: 'Excel构建图谱',
    css: 'ai-graph-excel',
  },
] as const
