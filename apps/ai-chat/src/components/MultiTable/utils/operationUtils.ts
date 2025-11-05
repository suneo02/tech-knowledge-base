import { TableOperation, TableOperationType } from '@/components/MultiTable/types'

/**
 * 获取操作的描述信息
 * @param operation 表格操作对象
 * @returns 操作的描述文本
 */
export const getOperationDescription = (operation: TableOperation): string => {
  console.log('🚀 ~ getOperationDescription ~ operation:', operation)
  switch (operation.type) {
    case TableOperationType.CELL_EDIT:
      return `编辑单元格 [行:${operation.rowId}, 列:${operation.columnId}] 的值从 ${operation.oldValue} 改为 ${operation.newValue}`

    case TableOperationType.COLUMN_MOVE:
      return `移动列 ${operation.columnId} 从第 ${operation.oldIndex + 1} 列到第 ${operation.newIndex + 1} 列`

    case TableOperationType.COLUMN_INSERT:
      return `将 新列 ${operation.columnName} 插入到第 ${operation.columnIndex + 1} 列`

    case TableOperationType.COLUMN_DELETE:
      return `删除第 ${operation.col} 列: ${operation.columnId} `

    case TableOperationType.COLUMN_RENAME:
      return `将列 ${operation.columnId} 从 ${operation.oldName} 重命名为 ${operation.newName}`

    // case TableOperationType.CELL_FILL:
    //   return `AI生成列列 ${operation.field} 从第 ${operation.startRowId + 1} 行到第 ${operation.endRowId + 1} 行`

    // case TableOperationType.COLUMN_FORMULA:
    //   return `在列 ${operation.field} 应用公式 ${operation.formula}，影响 ${operation.affectedRows.length} 行数据`

    case TableOperationType.UNDO:
      return `撤销操作`

    case TableOperationType.REDO:
      return `重做操作`

    case TableOperationType.ROW_DELETE:
      return `删除第 ${operation.row} 行：${operation.rowId}`

    default:
      return '未知操作'
  }
}
