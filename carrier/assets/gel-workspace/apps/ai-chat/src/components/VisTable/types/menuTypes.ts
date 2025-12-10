import { FieldDef } from '@visactor/vtable/es/ts-types'

export enum MenuKey {
  // Column menu items
  // 重命名列
  COLUMN_RENAME = 'COLUMN_RENAME',
  // AI生成列
  COLUMN_ADD_AI = 'COLUMN_ADD_AI',
  // 编辑AI列
  COLUMN_EDIT_AI = 'COLUMN_EDIT_AI',
  // 编辑列类型 - 文本
  COLUMN_EDIT_TEXT = 'COLUMN_EDIT_TEXT',
  // 编辑列类型 - 日期
  COLUMN_EDIT_DATE = 'COLUMN_EDIT_DATE',
  // 编辑列类型 - 数字
  COLUMN_EDIT_NUMBER = 'COLUMN_EDIT_NUMBER',
  // 运行列 - 待处理
  COLUMN_RUN_PENDING = 'COLUMN_RUN_PENDING',
  // 运行列 - 全部
  COLUMN_RUN_ALL = 'COLUMN_RUN_ALL',
  // 复制列
  COLUMN_COPY = 'COLUMN_COPY',
  // 向左插入列
  COLUMN_INSERT_LEFT = 'COLUMN_INSERT_LEFT',
  // 向右插入列
  COLUMN_INSERT_RIGHT = 'COLUMN_INSERT_RIGHT',
  // 筛选列
  COLUMN_FILTER = 'COLUMN_FILTER',
  // 升序排序
  COLUMN_SORT_ASC = 'COLUMN_SORT_ASC',
  // 降序排序
  COLUMN_SORT_DESC = 'COLUMN_SORT_DESC',
  // 切换列可见性
  COLUMN_TOGGLE_DISPLAY = 'COLUMN_TOGGLE_DISPLAY',
  // 删除列
  COLUMN_DELETE = 'COLUMN_DELETE',
  // 批量删除列
  COLUMN_BATCH_DELETE = 'COLUMN_BATCH_DELETE',

  // Cell menu items
  // 复制单元格
  CELL_COPY = 'CELL_COPY',
  // 删除行
  CELL_DELETE = 'CELL_DELETE',
  // 批量删除行
  CELL_BATCH_DELETE = 'CELL_BATCH_DELETE',

  // 行操作
  ROW_INSERT_ABOVE = 'ROW_INSERT_ABOVE', // 向上插入一行
  ROW_INSERT_BELOW = 'ROW_INSERT_BELOW', // 向下插入一行
  ROW_ADD = 'ROW_ADD', // 添加一行
  ROW_DELETE = 'ROW_DELETE', // 删除一行

  CHAT_ADD = 'CHAT_ADD', // 添加到对话
}

/**
 * 菜单项接口
 * 定义菜单项的结构
 */
export interface MenuListItem {
  // 菜单项文本
  text: string
  // 菜单项图标
  icon?: {
    svg: string
  }
  // 菜单项键值
  menuKey: string
  // 子菜单项
  children?: MenuListItem[]
  // 是否禁用
  disabled?: boolean
}

/**
 * 菜单处理器类型
 * 定义菜单项点击后的处理函数类型
 */
export type MenuHandlers = {
  [key in MenuKey]?: (
    props: { field: FieldDef; row: number; col: number },
    ...args: Array<string | number | boolean>
  ) => void
}
