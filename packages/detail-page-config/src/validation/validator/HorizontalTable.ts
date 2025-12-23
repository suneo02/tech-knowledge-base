import { ReportHorizontalTableJson } from 'gel-types'
import { isValidConfigTableCellRenderType } from '../tableCell'

/**
 * 验证配置中的枚举值是否有效
 *
 * @param config 要验证的配置对象
 * @returns 验证后的配置对象或者空对象（如果验证失败）
 */
export function validateReportHorizontalTable(config: any): ReportHorizontalTableJson {
  try {
    // 深拷贝避免修改原始对象
    const validatedConfig = JSON.parse(JSON.stringify(config)) as ReportHorizontalTableJson

    if (!validatedConfig.columns) {
      throw new Error('columns is required')
    }
    // 验证每行配置
    for (const row of validatedConfig.columns) {
      for (const col of row) {
        // 检查 renderType 是否有效
        if (col.renderType && !isValidConfigTableCellRenderType(col.renderType)) {
          console.warn(`Invalid renderType: ${col.renderType} for field ${String(col.dataIndex)}`)
        }
      }
      // 检查 row 中的每个 col 的 col span，如果每个 col span 都没有值
      if (row.every((col) => col.colSpan === undefined)) {
        if (row.length === 1) {
          // 那么如果只有一个 col，那么 col span 为 5
          row[0].colSpan = 5
        } else if (row.length === 2) {
          // 那么如果只有两个 col，那么 col span 为 3
          row[0].colSpan = 2
          row[1].colSpan = 2
        }
      } else if (row.length === 2) {
        // 如果只有两个 col ，检查 col span是否为一个没有值，一个为 3/
        // 或者都是 2
        if (
          !(
            (row[0].colSpan === undefined && row[1].colSpan === 3) ||
            (row[0].colSpan === 3 && row[1].colSpan === undefined) ||
            (row[0].colSpan === 2 && row[1].colSpan === 2)
          )
        ) {
          console.warn('Maybe invalid col span for row:', row)
        }
      }
    }

    return validatedConfig
  } catch (error) {
    console.error('Failed to validate config:' + JSON.stringify(error))
    return {} as ReportHorizontalTableJson
  }
}
