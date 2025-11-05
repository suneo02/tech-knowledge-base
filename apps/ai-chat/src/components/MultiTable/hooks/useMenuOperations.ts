import { FieldDef } from '@visactor/vtable/es/ts-types'
import { ListTable } from '@visactor/vtable'
import { useTableOperationActions } from './useTableOperationActions'
import { ColumnMenuKey, CellMenuKey, MenuHandlers, MenuListItem, TableOperation } from '../types'

const deepthinkIcon =
  '<?xml version="1.0" encoding="UTF-8"?><svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>深度思考-选中</title><g id="AI小程序" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="深度思考-选中"><rect id="矩形" x="0" y="0" width="14" height="14"></rect><path d="M7,0.388888889 C8.5034418,0.388888889 9.72222222,3.34878415 9.72222222,7 C9.72222222,10.6512158 8.5034418,13.6111111 7,13.6111111 C5.4965582,13.6111111 4.27777778,10.6512158 4.27777778,7 C4.27777778,3.34878415 5.4965582,0.388888889 7,0.388888889 Z M7,1.55555556 C6.14089039,1.55555556 5.44444444,3.99311636 5.44444444,7 C5.44444444,10.0068836 6.14089039,12.4444444 7,12.4444444 C7.85910961,12.4444444 8.55555556,10.0068836 8.55555556,7 C8.55555556,3.99311636 7.85910961,1.55555556 7,1.55555556 Z" id="形状结合" fill="#0596B3" fill-rule="nonzero" transform="translate(7, 7) rotate(-45) translate(-7, -7)"></path><path d="M7,0.388888889 C8.5034418,0.388888889 9.72222222,3.34878415 9.72222222,7 C9.72222222,10.6512158 8.5034418,13.6111111 7,13.6111111 C5.4965582,13.6111111 4.27777778,10.6512158 4.27777778,7 C4.27777778,3.34878415 5.4965582,0.388888889 7,0.388888889 Z M7,1.55555556 C6.14089039,1.55555556 5.44444444,3.99311636 5.44444444,7 C5.44444444,10.0068836 6.14089039,12.4444444 7,12.4444444 C7.85910961,12.4444444 8.55555556,10.0068836 8.55555556,7 C8.55555556,3.99311636 7.85910961,1.55555556 7,1.55555556 Z" id="形状结合" fill="#0596B3" fill-rule="nonzero" transform="translate(7, 7) rotate(45) translate(-7, -7)"></path><path d="M7,5.63888889 C7.7517209,5.63888889 8.36111111,6.2482791 8.36111111,7 C8.36111111,7.7517209 7.7517209,8.36111111 7,8.36111111 C6.2482791,8.36111111 5.63888889,7.7517209 5.63888889,7 C5.63888889,6.2482791 6.2482791,5.63888889 7,5.63888889 Z M7,6.80555556 C6.89261129,6.80555556 6.80555556,6.89261129 6.80555556,7 C6.80555556,7.10738871 6.89261129,7.19444444 7,7.19444444 C7.10738871,7.19444444 7.19444444,7.10738871 7.19444444,7 C7.19444444,6.89261129 7.10738871,6.80555556 7,6.80555556 Z" id="形状结合" fill="#0596B3" fill-rule="nonzero"></path></g></g></svg>'

interface UseMenuOperationsProps {
  multiTableRef: React.RefObject<ListTable>
  onRecordOperation: (operation: TableOperation) => void
}

export const useMenuOperations = ({ multiTableRef, onRecordOperation }: UseMenuOperationsProps) => {
  // 使用表格操作hook
  const tableOperations = useTableOperationActions({ multiTableRef, onRecordOperation })

  // 菜单操作处理器
  const columnMenuHandlers: MenuHandlers = {
    // 重命名列
    [ColumnMenuKey.COLUMN_RENAME]: (props) => {
      tableOperations.renameColumn(props)
    },

    // AI生成列
    [ColumnMenuKey.COLUMN_SMART_FILL]: (props) => {
      tableOperations.smartFillColumn(props)
    },

    // 编辑列类型
    [ColumnMenuKey.COLUMN_EDIT_TEXT]: (props, type: 'text' | 'date' | 'number') => {
      tableOperations.editColumnType(props, type)
    },
    [ColumnMenuKey.COLUMN_EDIT_DATE]: (props, type: 'text' | 'date' | 'number') => {
      tableOperations.editColumnType(props, type)
    },
    [ColumnMenuKey.COLUMN_EDIT_NUMBER]: (props, type: 'text' | 'date' | 'number') => {
      tableOperations.editColumnType(props, type)
    },

    // 运行列
    [ColumnMenuKey.COLUMN_RUN_PENDING]: (props, mode: 'pending' | 'all') => {
      tableOperations.runColumn(props, mode)
    },
    [ColumnMenuKey.COLUMN_RUN_ALL]: (props, mode: 'pending' | 'all') => {
      tableOperations.runColumn(props, mode)
    },

    // 复制列
    [ColumnMenuKey.COLUMN_COPY]: (props) => {
      tableOperations.copyColumn(props)
    },

    // 插入列
    [ColumnMenuKey.COLUMN_INSERT_LEFT]: (props) => {
      tableOperations.insertColumn(props, 'left')
    },
    [ColumnMenuKey.COLUMN_INSERT_RIGHT]: (props) => {
      tableOperations.insertColumn(props, 'right')
    },

    // 筛选列
    [ColumnMenuKey.COLUMN_FILTER]: (props) => {
      tableOperations.filterColumn(props)
    },

    // 排序列
    [ColumnMenuKey.COLUMN_SORT_ASC]: (props) => {
      tableOperations.sortColumn(props, 'asc')
    },
    [ColumnMenuKey.COLUMN_SORT_DESC]: (props) => {
      tableOperations.sortColumn(props, 'desc')
    },

    // 隐藏/显示列
    [ColumnMenuKey.COLUMN_TOGGLE_VISIBILITY]: (props) => {
      tableOperations.toggleColumnVisibility(props)
    },

    // 删除列
    [ColumnMenuKey.COLUMN_DELETE]: (props) => {
      tableOperations.deleteColumn(props)
    },
  }

  const cellMenuHandlers: MenuHandlers = {
    // 复制单元格
    [CellMenuKey.CELL_COPY]: (props) => {
      tableOperations.copyCellValue(props)
    },

    // 删除行
    [CellMenuKey.CELL_DELETE]: (props) => {
      tableOperations.deleteRow(props)
    },
  }

  const handlers: MenuHandlers = {
    ...columnMenuHandlers,
    ...cellMenuHandlers,
  }

  // 处理菜单点击
  const handleMenuClick = (
    menuKey: ColumnMenuKey | CellMenuKey,
    props: { field: FieldDef; row: number; col: number }
  ) => {
    const key = menuKey
    const handler = handlers[key]

    if (!handler) return

    switch (key) {
      case ColumnMenuKey.COLUMN_EDIT_TEXT:
        handler(props, 'text')
        break
      case ColumnMenuKey.COLUMN_EDIT_DATE:
        handler(props, 'date')
        break
      case ColumnMenuKey.COLUMN_EDIT_NUMBER:
        handler(props, 'number')
        break
      case ColumnMenuKey.COLUMN_RUN_PENDING:
        handler(props, 'pending')
        break
      case ColumnMenuKey.COLUMN_RUN_ALL:
        handler(props, 'all')
        break
      case ColumnMenuKey.COLUMN_INSERT_LEFT:
        handler(props, 'left')
        break
      case ColumnMenuKey.COLUMN_INSERT_RIGHT:
        handler(props, 'right')
        break
      case ColumnMenuKey.COLUMN_SORT_ASC:
        handler(props, 'asc')
        break
      case ColumnMenuKey.COLUMN_SORT_DESC:
        handler(props, 'desc')
        break
      default:
        ;(handler as (props) => void)(props)
    }
  }

  // 菜单项配置
  const getColumnMenuItems = (editor?: boolean): MenuListItem[] => {
    const items = [
      {
        text: '重命名列',
        icon: { svg: deepthinkIcon },
        menuKey: ColumnMenuKey.COLUMN_RENAME,
        disabled: !editor,
      },
      {
        text: 'AI生成列',
        icon: { svg: deepthinkIcon },
        menuKey: ColumnMenuKey.COLUMN_SMART_FILL,
      },
      {
        text: '编辑列',
        icon: { svg: deepthinkIcon },
        menuKey: 'edit-column',
        children: [
          {
            text: '文本',
            menuKey: ColumnMenuKey.COLUMN_EDIT_TEXT,
          },
          {
            text: '日期',
            menuKey: ColumnMenuKey.COLUMN_EDIT_DATE,
          },
          {
            text: '数字',
            menuKey: ColumnMenuKey.COLUMN_EDIT_NUMBER,
          },
        ],
      },
      {
        text: '运行列',
        icon: { svg: deepthinkIcon },
        menuKey: 'run-column',
        children: [
          {
            text: '运行待处理行',
            menuKey: ColumnMenuKey.COLUMN_RUN_PENDING,
          },
          {
            text: '运行全部',
            menuKey: ColumnMenuKey.COLUMN_RUN_ALL,
          },
        ],
      },
      {
        text: '复制',
        icon: { svg: deepthinkIcon },
        menuKey: ColumnMenuKey.COLUMN_COPY,
      },
      {
        text: '向左插入',
        icon: { svg: deepthinkIcon },
        menuKey: ColumnMenuKey.COLUMN_INSERT_LEFT,
      },
      {
        text: '向右插入',
        icon: { svg: deepthinkIcon },
        menuKey: ColumnMenuKey.COLUMN_INSERT_RIGHT,
      },
      {
        text: '筛选列',
        icon: { svg: deepthinkIcon },
        menuKey: ColumnMenuKey.COLUMN_FILTER,
      },
      {
        text: '排序',
        icon: { svg: deepthinkIcon },
        menuKey: 'sort-column',
        children: [
          {
            text: 'A-Z排序',
            menuKey: ColumnMenuKey.COLUMN_SORT_ASC,
          },
          {
            text: 'Z-A排序',
            menuKey: ColumnMenuKey.COLUMN_SORT_DESC,
          },
        ],
      },
      {
        text: '隐藏/显示',
        icon: { svg: deepthinkIcon },
        menuKey: ColumnMenuKey.COLUMN_TOGGLE_VISIBILITY,
      },
      {
        text: '删除',
        icon: { svg: deepthinkIcon },
        menuKey: ColumnMenuKey.COLUMN_DELETE,
      },
    ]
    return items.filter((item) => !item.disabled)
  }

  const getCellMenuItems = (): MenuListItem[] => {
    return [
      {
        text: '复制',
        icon: { svg: deepthinkIcon },
        menuKey: CellMenuKey.CELL_COPY,
      },
      {
        text: '删除',
        icon: { svg: deepthinkIcon },
        menuKey: CellMenuKey.CELL_DELETE,
      },
    ]
  }

  return {
    getColumnMenuItems,
    getCellMenuItems,
    handleMenuClick,
  }
}
