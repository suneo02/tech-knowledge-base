import { ConfigTableCellJsonConfig, ConfigTableCellRenderTypeLiteral } from 'gel-types'

export const ConfigTableCellRenderTypeList: ConfigTableCellRenderTypeLiteral[] = [
  'date',
  'currency',
  'dateRange',
  'custom',
  'image',
] /**
 * 判断字符串是否为有效的CorpInfoRenderType类型
 */

export function isValidConfigTableCellRenderType(value: string): value is ConfigTableCellRenderTypeLiteral {
  return ConfigTableCellRenderTypeList.indexOf(value as ConfigTableCellRenderTypeLiteral) !== -1
}

/**
 * 验证 配置化表格 关于 cell content 和 cell title 的配置
 */
export function validateConfigTableCellContentAndTitle(col: any): ConfigTableCellJsonConfig {
  try {
    // 检查 renderType 是否有效
    if (col.renderType && !isValidConfigTableCellRenderType(col.renderType)) {
      console.warn(`Invalid renderType: ${col.renderType} for field ${col.dataIndex}`)
    }

    return col
  } catch (error) {
    console.error('Failed to validate config:', error)
    return {} as ConfigTableCellJsonConfig
  }
}
