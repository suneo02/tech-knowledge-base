// 将枚举值转换为字符串字面量类型，用于JSON配置

import { ConfigDetailTitleJSON } from '../../common'

export type ConfigTableCellTitleRenderNameLiteral =
  // 海外非英语企业名称 需要展示当地语言
  'overseasNonEnglishCorpName'

export type ConfigTableCellTitleRenderConfig = {
  titleWidth?: number
  /**
   * 标题渲染配置
   */
  titleRenderConfig?: {
    // 用于标题渲染的函数名称
    titleRenderName?: ConfigTableCellTitleRenderNameLiteral
    // 当地语言的标题
    titleLocal?: string
  }
} & ConfigDetailTitleJSON
