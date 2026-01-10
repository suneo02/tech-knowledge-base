/**
 * 格式化工具：提供货币、百分比与比率的统一格式化。
 * @author yxlu.calvin
 * @example
 * Formatters.formatCurrency(123456.78, 'TEN_THOUSAND') // "12.3457"
 * Formatters.formatPercentage(0.1234 * 100) // "12.34%"
 * @remarks
 * - 货币格式：`Intl.NumberFormat('zh-CN')`；非元单位默认保留4位小数以提升精度
 * - 空值处理：`null/NaN/undefined` 统一渲染为 `--`
 */
import { UNIT_SCALES } from '../domain/value-objects/unitScale'

export const Formatters = {
  formatCurrency: (value: number, unit: keyof typeof UNIT_SCALES = 'YUAN'): string => {
    if (value == null || isNaN(value)) return '--'

    const scaledValue = value / UNIT_SCALES[unit].factor
    const fractionDigits = unit === 'YUAN' ? 2 : 4
    const formatter = new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })

    return `${formatter.format(scaledValue)}`
  },

  formatPercentage: (value: number): string => {
    if (value == null || isNaN(value)) return '--'
    return `${value.toFixed(2)}%`
  },

  formatRatio: (value: number): string => {
    if (value == null || isNaN(value)) return '--'
    return value.toFixed(2)
  },
}
