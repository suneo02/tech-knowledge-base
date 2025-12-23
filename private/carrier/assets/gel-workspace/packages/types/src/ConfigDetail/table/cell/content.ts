/**
 * 配置化表格 关于 col render的配置
 */

import { ConfigTableCellCustomRenderNameLiteral } from './contentCustom'
import { ConfigTableCellRenderTypeLiteral } from './renderType'

/**
 * 基础渲染配置
 * 这个类型更新请谨慎，已经列举了业余不相关的可能配置
 */
type ConfigTableCellRenderOptionsBase = {
  /**
   * 直接指定渲染内容，优先级高于通过 dataIndex 获取的值
   */
  content?: string
  /**
   * 直接指定渲染内容的多语言 ID
   */
  contentIntl?: string
  // 数字是否展示小数
  decimalPlaces?: number
  // 数字或货币是否展示千分位
  useThousandSeparator?: boolean
  // 数字是否展示单位
  showUnit?: boolean
  // 数字或货币单位
  unit?: string
  // 数字或货币单位 多语言
  unitIntl?: string
  // 货币单位字段，用于资本类型的渲染
  unitField?: string
  // 单位前缀
  unitPrefix?: string
  // 单位前缀 id
  unitPrefixIntl?: string
  // 币种字段，用于实缴资本渲染
  currencyField?: string

  // 日期范围的起始字段
  startField?: string
  // 日期范围的结束字段
  endField?: string
  // 日期范围的连接符
  connector?: string
  // 日期范围的连接符 id
  connectorIntl?: string
  // 日期范围的开始值为空时显示的文本
  emptyStartText?: string
  // 日期范围的开始值为空时显示的文本 id
  emptyStartTextIntl?: string
  // 日期范围的结束值为空时显示的文本
  emptyEndText?: string
  // 日期范围的结束值为空时显示的文本 id
  emptyEndTextIntl?: string

  // 值为空时显示的文本
  emptyText?: string
  // 值为空时显示的文本 id
  emptyTextIntl?: string
  // 数字为0时是否显示默认值
  showZeroAsDefault?: boolean
  // 如果是 对象的数组，则需要指定对象的 key
  objectKeyForArray?: string
}

export type ConfigTableCellRenderOptions = ConfigTableCellRenderOptionsBase & {
  // 自定义渲染函数名称
  customRenderName?: ConfigTableCellCustomRenderNameLiteral
  // 案件当事人
  caseParty?: {
    nameKey?: string
    idKey?: string
  }

  // 图片渲染时用到的 table id，不知道干嘛的，但是要传
  imageTableId?: string
  // 图片渲染类型
  imageRenderType?: 'brand' | 'corp'
}

export type ConfigTableCellRenderConfig<T = any> = {
  dataIndex: keyof T
  /**
   * 当 dataIndex 指向的值是对象时，用于指定从对象中获取哪个属性的值
   */
  objectKey?: string
  /**
   * 默认没有，以普通文本来渲染
   */
  renderType?: ConfigTableCellRenderTypeLiteral
  /**
   * 是否为数组类型，当为 true 时，会将字段值作为数组处理，并应用相同的渲染配置到每个数组元素
   */
  isArrayData?: boolean
  /**
   * 内容渲染配置
   */
  renderConfig?: ConfigTableCellRenderOptions
}
