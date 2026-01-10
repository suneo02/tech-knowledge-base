import { ColumnDataTypeEnum } from 'gel-api'

export const DEFAULT_ELLIPSIS_WIDTH = 240

// 临时 t：如项目有全局 i18n，请替换统一导入
export const t = (_key: string, fallback: string): string => fallback

export const formatNumberByType = (value: unknown, type?: unknown): string | React.ReactNode => {
  if (typeof value !== 'number' && typeof value !== 'string') return value as React.ReactNode
  const num = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(num)) return value as React.ReactNode

  if (type === ColumnDataTypeEnum.INTEGER) {
    return num.toLocaleString()
  }
  if (type === ColumnDataTypeEnum.FLOAT) {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  if (type === ColumnDataTypeEnum.PERCENT) {
    return `${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
  }
  if (type === ColumnDataTypeEnum.TAG) {
    return `${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}分`
  }
  return value as React.ReactNode
}
