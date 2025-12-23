/**
 * 配置化表格的JSON配置类型
 *
 * 用于通过JSON配置来动态渲染企业的工商信息表格
 * 数据结构是一个二维数组：
 * - 外层数组表示表格的行
 * - 内层数组表示每行中的列
 *
 * 每个单元格对象包含以下属性：
 * @property {string} title - 表格单元格的标题文本
 * @property {string} titleId - 国际化ID，用于多语言支持
 * @property {number} [titleWidth] - 可选，标题列的宽度
 * @property {number} [colSpan] - 可选，单元格跨列数
 * @property {CorpInfoRenderType} [renderType] - 可选，指定字段的渲染方式
 * @property {object} [renderConfig] - 可选，渲染配置，根据renderType不同有不同的配置项
 *
 */

import { ConfigTableCellRenderConfig } from './content'
import { ConfigTableCellTitleRenderConfig } from './title'

export * from './content'
export * from './contentCustom'
export * from './renderType'
export * from './title'

export type ConfigTableCellJsonConfig<T = any> = {
  contentWidth?: number | string
  colSpan?: number
  align?: 'left' | 'right' | 'center'
  width?: string | number
} & ConfigTableCellRenderConfig<T> &
  ConfigTableCellTitleRenderConfig
