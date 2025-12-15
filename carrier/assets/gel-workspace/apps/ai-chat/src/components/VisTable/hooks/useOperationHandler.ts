import { message } from '@wind/wind-ui'
import { CellMetadata, Column, ProgressStatusEnum } from 'gel-api'
import { ERROR_TEXT } from 'gel-util/config'
import { useCallback } from 'react'
import { useSmartFill } from '../context/SmartFillContext'
import { useVisTableContext } from '../context/VisTableContext'
import { IconTypeEnum } from '../types/iconTypes'
import { MenuKey } from '../types/menuTypes'
import { DropDownMenuHandlerProps, IconClickHandlerProps } from '../types/operationHandler'
import { OperationType, OperationValue } from '../utils/OperationTypes'
import { useTableHistoryActions } from './withTableHistory'
// import { VisTableOperationType } from '../types/operationTypes'

/**
 * 操作处理函数类型
 */
export type OperationHandler = <T extends OperationType>(operationType: T, value: OperationValue) => void

/**
 * 通用操作处理Hook
 * 用于统一处理表格的所有操作
 *
 * @param onOperation 外部传入的操作处理函数
 * @param tableInstance 表格实例
 * @returns 标准化的操作处理函数
 */
export const useOperationHandler = (sheetId?: number, onOperation?: OperationHandler) => {
  const { getCellMeta, dispatch, getAllColumns, startEditCell, getRecordByCell, getSelectedCellInfos } =
    useVisTableContext()
  const {
    addColumn,
    setCellValue,
    runCell,
    deleteColumn,
    moveColumn,
    renameColumn,
    addRecord,
    runColumn,
    deleteRecords,
  } = useTableHistoryActions({
    sheetId: sheetId!,
  })

  // 使用SmartFill钩子
  const { openSmartFillModal } = useSmartFill()

  /**
   * 默认操作处理函数
   * 根据操作类型执行相应的逻辑
   */
  const defaultOperationHandler = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (operationType: OperationType, value: any) => {
      // TODO 使用map去推导类型
      // console.log(`执行默认操作处理: ${operationType}`, value, 'title')

      // 根据操作类型执行不同的逻辑
      switch (operationType) {
        // 数据操作
        // case OperationType.SET_RECORDS:
        //   table.setRecords(value.records, value.option)
        //   break
        // case OperationType.ADD_RECORD:
        //   addRecord(value as Record<string, unknown>, value.recordIndex as number)
        //   break
        // case OperationType.ADD_RECORDS:
        //   // console.log('通用处理方法：addRecords', value)
        //   break
        // case OperationType.DELETE_RECORDS:
        //   // console.log('通用处理方法：deleteRecords', value)
        //   break
        // case OperationType.UPDATE_RECORDS:
        //   // console.log('通用处理方法：updateRecords', value)
        //   break

        // // 表格操作
        // case OperationType.REFRESH:
        //   // console.log('通用处理方法：refresh', value)
        //   break
        // case OperationType.REFRESH_WITH_RECREATE_CELLS:
        //   // console.log('通用处理方法：refreshWithRecreateCells', value)
        //   break

        case OperationType.COLUMN_RENAME:
          {
            const { field } = getAllColumns()[value.col - 1] || {}
            renameColumn({ ...value, columnId: field as string })
          }
          break
        case OperationType.COLUMN_MOVE:
          {
            const { fromCol, toCol } = value || {}
            const { field, title } = getAllColumns()[toCol - 1] || {}
            if (field) moveColumn({ columnId: field as string, fromCol, toCol, title: title as string })
          }
          break
        case OperationType.SET_CELL_VALUE:
          if (!value?.noRecord) {
            const meta = getCellMeta(value.col, value.row)
            setCellValue({ meta, ...value })
          }
          break
        case OperationType.DROPDOWN_MENU_CLICK:
          getDropMenuClickHandler(value)
          break
        case OperationType.ICON_CLICK:
          getIconClickHandler(value as IconClickHandlerProps)
          break

        case OperationType.COLUMN_ADD: // @ts-expect-error ttt
          addColumn(value.col - 1, { editor: 'input', headerEditor: 'input' })
          break

        // 其他操作，仅记录日志不执行默认行为
        default:
        // console.log(`未实现的默认操作: ${operationType}`, value)
      }
    },
    [dispatch, getCellMeta]
  )

  const getIconClickHandler = (value: IconClickHandlerProps) => {
    switch (value.name) {
      case IconTypeEnum.RUN:
        {
          const { col, row } = value
          const cellMeta = getCellMeta<CellMetadata>(col, row)
          console.log('🚀 ~ getIconClickHandler ~ col, row:', col, row, cellMeta)

          if (cellMeta) {
            const shouldRun =
              (cellMeta.status !== ProgressStatusEnum.PENDING && cellMeta.status !== ProgressStatusEnum.RUNNING) ||
              !cellMeta.processedValue ||
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              !(cellMeta as any).value ||
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (cellMeta as any).value === ERROR_TEXT ||
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (cellMeta as any).processedValue === ERROR_TEXT

            if (!shouldRun) {
              message.error('当前单元格正在运行中，请稍后再试')
              return
            }
            runCell(col, row)
          } else {
            message.error('当前单元格不存在')
          }
        }

        break

      default:
        break
    }
  }

  const getDropMenuClickHandler = (value: DropDownMenuHandlerProps) => {
    switch (value.menuKey) {
      case MenuKey.COLUMN_DELETE:
        {
          // console.log('MenuKey.COLUMN_DELETE', value)
          const column = getAllColumns().find((res) => res.field === value.field)
          deleteColumn(value.col, column as Column)
        }
        break
      case MenuKey.COLUMN_INSERT_LEFT:
        // @ts-expect-error
        addColumn(value.col - 1, { editor: 'input', headerEditor: 'input' })
        break
      case MenuKey.COLUMN_INSERT_RIGHT:
        // @ts-expect-error
        addColumn(value.col, { editor: 'input', headerEditor: 'input' })
        break
      case MenuKey.COLUMN_RENAME:
        startEditCell(value.col, value.row)
        break
      // case MenuKey.CELL_COPY:
      //   getCopyValue()
      //   break
      case MenuKey.COLUMN_TOGGLE_DISPLAY:
        // console.log('🚀 ~ getDropMenuClickHandler ~ COLUMN_TOGGLE_DISPLAY:', value)
        // toggleDisplayColumn()
        break
      case MenuKey.ROW_INSERT_ABOVE:
        {
          addRecord(value.row - 1)
        }
        break
      case MenuKey.ROW_INSERT_BELOW:
        {
          addRecord(value.row)
        }
        break
      case MenuKey.COLUMN_ADD_AI:
        // console.log('🚀 ~ getDropMenuClickHandler ~ COLUMN_SMART_FILL:', value)
        // 使用Context钩子打开模态框，不传递列ID表示新增模式
        // 不显示之前的模板
        openSmartFillModal()
        break
      case MenuKey.COLUMN_EDIT_AI:
        // console.log('🚀 ~ getDropMenuClickHandler ~ COLUMN_EDIT_AI:', value)
        // 使用Context钩子打开模态框，传递列ID表示编辑模式
        // 这里传递true作为第二个参数表示清除之前的模板
        if (value.field) {
          openSmartFillModal(value.field as string, true)
        }
        break
      case MenuKey.COLUMN_RUN_ALL:
        runColumn({ col: value.col, mode: 'all' })
        break
      case MenuKey.COLUMN_RUN_PENDING:
        runColumn({ col: value.col, mode: 'pending' })
        break
      case MenuKey.ROW_DELETE:
        {
          const recordInfo = getRecordByCell(value.col, value.row)
          const records = [{ row: value.row, rowId: recordInfo.rowId }]
          deleteRecords(records)
        }
        break
      case MenuKey.CHAT_ADD:
        {
          const selectedCellInfos = getSelectedCellInfos()
          // console.log(selectedCellInfos)

          if (
            selectedCellInfos &&
            selectedCellInfos.length > 0 &&
            selectedCellInfos[0] &&
            selectedCellInfos[0].length > 0
          ) {
            let markdownTable = ''
            // 获取表头
            const headers = selectedCellInfos[0].map((cell) => cell.title || '')
            markdownTable += `| ${headers.join(' | ')} |
`
            // 添加分隔行
            markdownTable += `| ${headers.map(() => '---').join(' | ')} |
`
            // 添加数据行
            selectedCellInfos.forEach((row) => {
              const rowValues = row.map((cell) =>
                cell.dataValue !== undefined && cell.dataValue !== null ? String(cell.dataValue) : ''
              )
              markdownTable += `| ${rowValues.join(' | ')} |
`
            })
            // console.log('Generated Markdown Table:\n', markdownTable)
          } else {
            // console.log('selectedCellInfos为空或格式不正确，无法生成Markdown表格。')
          }

          // deleteRecords(records)
        }
        break
      default:
        break
    }
  }

  /**
   * 统一操作处理函数
   * 如果提供了外部处理函数，则先调用外部函数
   * 否则使用默认的处理逻辑
   */
  const handleOperation = useCallback(
    (operationType: OperationType, value: OperationValue) => {
      // 如果提供了外部处理函数，则调用它
      if (onOperation) {
        onOperation(operationType, value)
      } else {
        // 否则使用默认处理逻辑
        defaultOperationHandler(operationType, value)
      }
    },
    [onOperation, defaultOperationHandler]
  )

  return handleOperation
}
