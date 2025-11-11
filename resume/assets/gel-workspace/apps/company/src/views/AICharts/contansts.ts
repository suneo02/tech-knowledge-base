import {
  AIGRAPH_MENU_KEYS,
  AIGRAPH_BUILD_MENU_KEYS,
  AIGRAPH_EXCEL_SHEET_KEYS,
  AIGRAPH_RIGHT_TABS_KEYS,
} from './types/index'

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

/**
 * @description AI图谱Excel表格配置
 */
export const AIGRAPH_EXCEL_SHEET_CONFIG = [
  {
    key: AIGRAPH_EXCEL_SHEET_KEYS.GRAPH,
    label: '图谱',
  },
  {
    key: AIGRAPH_EXCEL_SHEET_KEYS.BASIC,
    label: '设置图谱',
  },
  {
    key: AIGRAPH_EXCEL_SHEET_KEYS.RELATION,
    label: '节点关系表',
  },
  {
    key: AIGRAPH_EXCEL_SHEET_KEYS.NODE,
    label: '节点信息表',
  },
] as const

/**
 * @description AI图谱右侧标签配置
 */
export const AIGRAPH_RIGHT_TABS_CONFIG = [
  {
    key: AIGRAPH_RIGHT_TABS_KEYS.EXCEL,
    label: '数据',
  },
  {
    key: AIGRAPH_RIGHT_TABS_KEYS.GRAPH,
    label: '图谱',
  },
] as const

/**
 * @description AI图谱发送类型配置
 */
export const AIGRAPH_SEND_TYPE_KEYS = {
  SENDER: 'sender',
  MARKDOWN: 'markdown',
  EXCEL: 'excel',
} as const

/**
 * @description AI图谱URL参数配置
 */
export const AIGRAPH_PARAM_KEYS = {
  SEND_INFO: 'sendInfo',
  SEND_TYPE: 'sendType',
  AI_GRAPH_TYPE: 'aiGraphType',
}

/**
 * @description AI图谱跳转入口
 */
export const AI_GRAPH_TYPE = {
  AI_GRAPH_SENDER: 'ai_graph_sender', // 输入框（文本+文件）跳转生成图谱
  AI_GRAPH_SUPPLY_CHAIN: 'ai_graph_supply_chain',
  AI_GRAPH_CUSTOMERS: 'ai_graph_customers',
  AI_GRAPH_COMPETITORS: 'ai_graph_competitors',
  AI_GRAPH_MARKDOWN: 'ai_graph_markdown',
  AI_GRAPH_EXCEL: 'ai_graph_excel',
  AI_GRAPH_HISTORY: 'ai_graph_history',
}

/**
 * @description AI图谱agent类别
 */
export const AI_GRAPH_ENTITY_TYPE = {
  SUPPLY: 'supplier',
  CUSTOMER: 'customer',
  COMPETITOR: 'competitor',
} as const

/**
 * @description AI图谱agent初始问句配置
 */
export const AI_GRAPH_ENTITY_TYPE_QUESTION = {
  [AI_GRAPH_ENTITY_TYPE.SUPPLY]: '的供应链探查图谱',
  [AI_GRAPH_ENTITY_TYPE.CUSTOMER]: '的客户群探查图谱',
  [AI_GRAPH_ENTITY_TYPE.COMPETITOR]: '的竞争对手探查图谱',
} as const
