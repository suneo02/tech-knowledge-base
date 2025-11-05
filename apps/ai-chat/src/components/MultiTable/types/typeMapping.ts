import { ColumnMenuKey, CellMenuKey } from './menuTypes'
import { TableOperationType } from './operationTypes'

/**
 * 菜单操作到表格操作的映射
 * 将菜单操作类型映射到对应的表格操作类型
 */
export const MenuToOperationTypeMap: Record<string, TableOperationType> = {
  // 列操作映射
  [ColumnMenuKey.COLUMN_RENAME]: TableOperationType.COLUMN_RENAME,
  [ColumnMenuKey.COLUMN_SMART_FILL]: TableOperationType.CELL_FILL,
  [ColumnMenuKey.COLUMN_COPY]: TableOperationType.COLUMN_ADD,
  [ColumnMenuKey.COLUMN_INSERT_LEFT]: TableOperationType.COLUMN_INSERT,
  [ColumnMenuKey.COLUMN_INSERT_RIGHT]: TableOperationType.COLUMN_INSERT,
  [ColumnMenuKey.COLUMN_DELETE]: TableOperationType.COLUMN_DELETE,

  // 单元格操作映射
  [CellMenuKey.CELL_COPY]: TableOperationType.CELL_EDIT,
  [CellMenuKey.CELL_DELETE]: TableOperationType.ROW_DELETE,
}

/**
 * 操作类型描述映射
 * 为每种操作类型提供人类可读的描述
 */
export const OperationTypeDescriptionMap: Record<TableOperationType, string> = {
  [TableOperationType.CELL_EDIT]: '编辑单元格',
  [TableOperationType.CELL_FILL]: 'AI生成列',
  [TableOperationType.CELL_CLEAR]: '清除内容',
  [TableOperationType.COLUMN_ADD]: '新增列',
  [TableOperationType.COLUMN_UPDATE]: '更新列',
  [TableOperationType.COLUMN_DELETE]: '删除列',
  [TableOperationType.COLUMN_RENAME]: '重命名列',
  [TableOperationType.COLUMN_MOVE]: '移动列',
  [TableOperationType.COLUMN_INSERT]: '插入列',
  [TableOperationType.COLUMN_FORMULA]: '运行列公式',
  [TableOperationType.ROW_ADD]: '添加行',
  [TableOperationType.ROW_DELETE]: '删除行',
  [TableOperationType.UNDO]: '撤销操作',
  [TableOperationType.REDO]: '重做操作',
  [TableOperationType.DATA_ADD]: '添加数据',
}
