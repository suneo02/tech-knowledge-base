/**
 * 表格数据管线：组合处理器实现过滤空行、单位缩放与年份过滤。
 * @author yxlu.calvin
 * @example
 * const pipeline = createPipeline(
 *   PipelineProcessors.filterEmptyRows,
 *   PipelineProcessors.scaleValues('TEN_THOUSAND')
 * )
 * @remarks
 * - 纯函数约束：所有处理器不应修改入参对象，返回新对象以便可预测渲染
 * - 列过滤：`filterYears` 会同步裁剪 `columns` 与每行 `values` 字典的键集
 */
import { UNIT_SCALES } from '../domain/value-objects/unitScale'
import { TableModel, FinancialTableRow } from '../types'

export const createPipeline = <T>(...processors: Array<(data: T) => T>) => {
  return (initialData: T): T => {
    return processors.reduce((data, processor) => processor(data), initialData)
  }
}

export const PipelineProcessors = {
  filterEmptyRows: (data: TableModel): TableModel => ({
    ...data,
    rows: data.rows.filter((row: FinancialTableRow) =>
      Object.values(row.values).some((value) => value != null && value !== 0)
    ),
  }),

  scaleValues: (unitScale: keyof typeof UNIT_SCALES) => (data: TableModel): TableModel => ({
    ...data,
    rows: data.rows.map((row: FinancialTableRow) => ({
      ...row,
      values: Object.fromEntries(
        Object.entries(row.values).map(([key, value]) => [
          key,
          typeof value === 'number' ? value / UNIT_SCALES[unitScale].factor : value,
        ])
      ),
    })),
  }),

  filterYears: (yearRange: [number | undefined, number | undefined]) => (data: TableModel): TableModel => {
    const [startYear, endYear] = yearRange
    const filteredColumns = data.columns.filter((col: string) => {
      const year = parseInt(col)
      if (isNaN(year)) return true
      if (startYear && year < startYear) return false
      if (endYear && year > endYear) return false
      return true
    })

    return {
      ...data,
      columns: filteredColumns,
      rows: data.rows.map((row: FinancialTableRow) => ({
        ...row,
        values: Object.fromEntries(filteredColumns.map((col: string) => [col, row.values[col]])),
      })),
    }
  },
}
