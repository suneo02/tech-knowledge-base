/**
 * VisTable操作类型枚举
 * 定义所有可能的表格操作类型
 */
export enum OperationType {
  // 数据操作相关
  SET_RECORDS = 'SET_RECORDS',
  ADD_RECORD = 'ADD_RECORD',
  ADD_RECORDS = 'ADD_RECORDS',
  DELETE_RECORDS = 'DELETE_RECORDS',
  UPDATE_RECORDS = 'UPDATE_RECORDS',

  // 表格操作相关
  REFRESH = 'REFRESH',
  REFRESH_WITH_RECREATE_CELLS = 'REFRESH_WITH_RECREATE_CELLS',
  SET_CELL_VALUE = 'SET_CELL_VALUE',
  GET_CELL_VALUE = 'GET_CELL_VALUE',
  GET_RECORD_BY_CELL = 'GET_RECORD_BY_CELL',

  // 单元格事件相关
  CELL_CLICK = 'CELL_CLICK',
  CELL_CHANGE = 'CELL_CHANGE',
  CELL_SELECTED = 'CELL_SELECTED',

  // 列操作相关
  COLUMN_RESIZE = 'COLUMN_RESIZE',
  COLUMN_MOVE = 'COLUMN_MOVE',
  COLUMN_RENAME = 'COLUMN_RENAME',
  COLUMN_ADD = 'COLUMN_ADD',

  // 菜单相关
  DROPDOWN_MENU_CLICK = 'DROPDOWN_MENU_CLICK',

  // 键盘事件
  KEYDOWN = 'KEYDOWN',

  // 图标点击
  ICON_CLICK = 'ICON_CLICK',

  // 自定义操作
  CUSTOM_OPERATION = 'CUSTOM_OPERATION',
}

/**
 * 操作参数类型
 */
export interface OperationValue {
  // 定义通用字段
  [key: string]: unknown

  // 可以为特定操作类型添加具体的字段类型
  // 这里只是示例，具体字段需要根据实际使用情况添加
}
