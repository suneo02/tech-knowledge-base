import { MutableRefObject, useCallback, useEffect, useRef } from 'react'
import type { ListTable } from '@visactor/vtable'
import { useTableListeners } from './useTableListeners'
import { useTableOperationActions } from '.'
import { CellMenuKey, ColumnMenuKey, MenuKey, TableOperation } from '../types'
import { onCellClickBySourceProps } from '../types/table'
import { PENDING_TEXT } from '@/components/VisTable/config/status'
// 不直接在表格事件处理中使用updateTask
// import { useTableAITask } from '../context'

export interface TableEventsProps {
  /**
   * 表格实例引用
   */
  multiTableRef: MutableRefObject<ListTable | null>
  /**
   * 表格列配置
   */
  // columns: ColumnDefine[]
  /**
   * 记录操作的回调函数
   */
  onRecordOperation: (operation: TableOperation) => void
  onCellClickBySource: (value?: onCellClickBySourceProps) => void
}

// 定义AI任务事件类型，用于传递给外部处理
export interface AITaskEvent {
  columnId: string
  rowId: string
  originalContent?: string
}

// 创建一个自定义事件中心
export const createEventEmitter = () => {
  const listeners: Record<string, Array<(data: unknown) => void>> = {}

  return {
    on: (event: string, callback: (data: unknown) => void) => {
      if (!listeners[event]) {
        listeners[event] = []
      }
      listeners[event].push(callback)
    },
    off: (event: string, callback: (data: unknown) => void) => {
      if (!listeners[event]) return
      listeners[event] = listeners[event].filter((cb) => cb !== callback)
    },
    emit: (event: string, data: unknown) => {
      if (!listeners[event]) return
      listeners[event].forEach((callback) => callback(data))
    },
  }
}

// 创建全局事件发布订阅中心
export const tableEventEmitter = createEventEmitter()

// 为了调试，修改emit方法添加日志
const originalEmit = tableEventEmitter.emit
tableEventEmitter.emit = function (event: string, data: unknown) {
  console.log(`[EventEmitter] 发布事件 ${event}:`, data)
  return originalEmit.call(this, event, data)
}

/**
 * 表格事件管理Hook
 * 用于集中管理和处理表格实例的各种事件监听和操作
 */
export const useTableEvents = ({ multiTableRef, onRecordOperation, onCellClickBySource }: TableEventsProps) => {
  // 不再直接使用updateTask
  // const { updateTask } = useTableAITask()

  // 获取表格操作方法
  const tableOperations = useTableOperationActions({ multiTableRef, onRecordOperation })

  // 事件已注册标志
  const eventsRegistered = useRef(false)

  // 处理菜单点击
  const handleMenuClick = useCallback(
    (menuKey: MenuKey, props: { field: string; row: number; col: number }) => {
      switch (menuKey) {
        // 列操作
        case ColumnMenuKey.COLUMN_RENAME:
          tableOperations.renameColumn(props)
          break
        case ColumnMenuKey.COLUMN_SMART_FILL:
          tableOperations.smartFillColumn(props)
          break
        case ColumnMenuKey.COLUMN_EDIT_TEXT:
          tableOperations.editColumnType(props, 'text')
          break
        case ColumnMenuKey.COLUMN_EDIT_DATE:
          tableOperations.editColumnType(props, 'date')
          break
        case ColumnMenuKey.COLUMN_EDIT_NUMBER:
          tableOperations.editColumnType(props, 'number')
          break
        case ColumnMenuKey.COLUMN_RUN_PENDING:
          tableOperations.runColumn(props, 'pending')
          break
        case ColumnMenuKey.COLUMN_RUN_ALL:
          tableOperations.runColumn(props, 'all')
          break
        case ColumnMenuKey.COLUMN_COPY:
          tableOperations.copyColumn(props)
          break
        case ColumnMenuKey.COLUMN_INSERT_LEFT:
          tableOperations.insertColumn(props, 'left')
          break
        case ColumnMenuKey.COLUMN_INSERT_RIGHT:
          tableOperations.insertColumn(props, 'right')
          break
        case ColumnMenuKey.COLUMN_FILTER:
          tableOperations.filterColumn(props)
          break
        case ColumnMenuKey.COLUMN_SORT_ASC:
          tableOperations.sortColumn(props, 'asc')
          break
        case ColumnMenuKey.COLUMN_SORT_DESC:
          tableOperations.sortColumn(props, 'desc')
          break
        case ColumnMenuKey.COLUMN_TOGGLE_VISIBILITY:
          tableOperations.toggleColumnVisibility(props)
          break
        case ColumnMenuKey.COLUMN_DELETE:
          tableOperations.deleteColumn(props)
          break

        // 单元格操作
        case CellMenuKey.CELL_COPY:
          tableOperations.copyCellValue(props)
          break
        case CellMenuKey.CELL_DELETE:
          tableOperations.deleteRow(props)
          break
        default:
          console.warn('未处理的菜单点击:', menuKey)
      }
    },
    [tableOperations]
  )

  // 获取表格事件监听器
  const { getEventHandlers } = useTableListeners({
    multiTableRef,
    onRecordOperation,
    onMenuClick: handleMenuClick,
  })

  const { handleColumnMove, handleColumnResize, handleCellValueChange, handleDropdownMenuClick } = getEventHandlers()

  /**
   * 注册所有事件监听
   */
  const registerEvents = useCallback(() => {
    if (!multiTableRef.current) {
      console.warn('注册事件失败: multiTableRef.current 为 null')
      return
    }

    // 如果事件已注册，不再重复注册
    if (eventsRegistered.current) {
      return
    }

    console.log('注册表格事件:', multiTableRef.current)

    // 列头移动事件
    multiTableRef.current.on('change_header_position', handleColumnMove)
    // 列宽调整事件
    multiTableRef.current.on('resize_column_end', handleColumnResize)
    // 单元格值变更事件
    multiTableRef.current.on('change_cell_value', handleCellValueChange)
    // 下拉菜单点击事件
    multiTableRef.current.on('dropdown_menu_click', handleDropdownMenuClick)

    multiTableRef.current.on('selected_cell', (cellInfo) => {
      console.log('🚀 ~ multiTableRef.current.on ~ cellInfo:', cellInfo)
      const { col, row, ranges } = cellInfo
      if (ranges.length > 1 || ranges[0].start.row === 0) {
        onCellClickBySource()
        return
      }

      const columnId = multiTableRef.current?.getHeaderField(col, row)
      const record = multiTableRef.current?.getRecordByCell(col, row)
      console.log('record', record, columnId)
      console.log('cellInfo', record[`${columnId}&`])
      // if (!record[`${columnId}&`]?.sourceId) {
      const cellMeta = record[`${columnId}&`]
      if (cellMeta?.sourceId && cellMeta?.sourceType) {
        onCellClickBySource({
          sourceId: cellMeta.sourceId,
          sourceType: cellMeta.sourceType,
          value: record[columnId as string],
        })
      } else {
        onCellClickBySource()
      }
      // }
    })

    // multiTableRef.current.on('click_cell', (res) => {
    //   console.log('🚀 ~ multiTableRef.current.on ~ res:', res)
    // })
    multiTableRef.current.on('icon_click', (res) => {
      // console.log('🚀 ~ icon_click ~ res:', res)
      if (res.name === 'run') {
        console.log('🚀 ~ icon_click ~ 运行单元格:', res)
        const columnId = multiTableRef.current.getHeaderField(res.col, res.row)
        const rowInfo = multiTableRef.current.getRecordByCell(res.col, res.row)

        try {
          // 检查是否存在必要属性
          if (!columnId) {
            console.error('columnId是undefined')
            return
          }

          if (!rowInfo) {
            console.error('rowInfo是undefined')
            return
          }

          const columnData = rowInfo[columnId as string]
          if (!columnData) {
            console.error('columnData是undefined，字段名可能不正确:', { columnId, rowInfoKeys: Object.keys(rowInfo) })
            return
          }

          // 尝试多种方式获取rowId
          let rowId = null
          let originalContent = null

          // 方式1: 从列数据中获取
          if (columnData.rowId) {
            rowId = columnData.rowId
            originalContent = columnData.dataValue
          }
          // 方式2: 从行数据直接获取
          else if (rowInfo.rowId) {
            rowId = rowInfo.rowId
            originalContent = columnData
          }
          // 方式3: 从行数据的_rowId获取
          else if (rowInfo._rowId) {
            rowId = rowInfo._rowId
            originalContent = columnData
          }

          if (!rowId) {
            console.error('无法获取rowId，尝试的所有方法都失败:', { rowInfo, columnData })
            return
          }

          console.log('🚀 ~ icon_click ~ 准备发送事件:', {
            columnId,
            rowId,
            originalContent,
          })

          tableEventEmitter.emit('ai_task_request', {
            columnId: columnId as string,
            rowId,
            originalContent,
          })

          // 直接更新单元格显示为等待状态
          multiTableRef.current.changeCellValue(res.col, res.row, PENDING_TEXT)
        } catch (error) {
          console.error('处理icon_click事件时出错:', error)
        }
      }
    })

    // 标记事件已注册
    eventsRegistered.current = true
  }, [
    multiTableRef,
    handleColumnMove,
    handleColumnResize,
    handleCellValueChange,
    handleDropdownMenuClick,
    onCellClickBySource,
  ])

  /**
   * 移除所有事件监听
   */
  const unregisterEvents = useCallback(() => {
    if (!multiTableRef.current || !eventsRegistered.current) return

    console.log('移除表格事件')

    // 移除列头移动事件
    multiTableRef.current.off('change_header_position', handleColumnMove)
    // 移除列宽调整事件
    multiTableRef.current.off('resize_column_end', handleColumnResize)
    // 移除单元格值变更事件
    multiTableRef.current.off('change_cell_value', handleCellValueChange)
    // 移除下拉菜单点击事件
    multiTableRef.current.off('dropdown_menu_click', handleDropdownMenuClick)

    // 重置标记
    eventsRegistered.current = false
  }, [multiTableRef, handleColumnMove, handleColumnResize, handleCellValueChange, handleDropdownMenuClick])

  // 监听multiTableRef变化并注册事件
  useEffect(() => {
    // 只有当multiTableRef.current存在时才注册事件
    if (multiTableRef.current) {
      // 如果事件未注册，才进行注册
      if (!eventsRegistered.current) {
        registerEvents()
      }
    }

    // 组件卸载时清理事件监听
    return () => {
      unregisterEvents()
    }
  }, [multiTableRef, registerEvents, unregisterEvents]) // 只依赖multiTableRef引用本身，而不是current属性

  return {
    registerEvents,
    unregisterEvents,
    // 导出表格操作方法，方便外部直接调用
    ...tableOperations,
  }
}
