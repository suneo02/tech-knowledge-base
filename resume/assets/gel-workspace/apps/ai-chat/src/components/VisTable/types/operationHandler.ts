import { DropDownMenuEventArgs, FieldDef, TableEventHandlersEventArgumentMap } from '@visactor/vtable/es/ts-types'
import { MenuKey } from './menuTypes'
import { CellAddress } from '@visactor/vtable-editors'
import { IconTypeEnum } from './iconTypes'

/**
 * VisTable操作类型枚举
 * 定义所有可能的表格操作类型
 */
export enum OperationType {
  // 数据操作相关
  SELECTED_CELL = 'selected_cell',
  ICON_CLICK = 'icon_click',
  RESIZE_COLUMN_END = 'resize_column_end',
  CHANGE_CELL_VALUE = 'change_cell_value',
  CHANGE_HEADER_POSITION = 'change_header_position',
  KEYDOWN = 'keydown',
  DROPDOWN_MENU_CLICK = 'dropdown_menu_click',
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

export interface IconClickHandlerProps extends CellAddress {
  name: IconTypeEnum
}

export interface DropDownMenuHandlerProps extends CellAddress {
  menuKey: MenuKey
  field: FieldDef
}

export type OperationHandlerMap = Pick<
  TableEventHandlersEventArgumentMap,
  'change_cell_value' | 'resize_column_end' | 'change_header_position'
> & {
  dropdown_menu_click: DropDownMenuEventArgs & { menuKey: MenuKey }
  icon_click: CellAddress & { name: IconTypeEnum }
}

// export interface OperationHandler {
//   [OperationHandlerMap.dropdown_menu_click]: (args: DropDownMenuEventArgs & { menuKey: MenuKey }) => void
//   [OperationHandlerMap.icon_click]: (args: CellAddress & { name: IconType }) => void
// }
