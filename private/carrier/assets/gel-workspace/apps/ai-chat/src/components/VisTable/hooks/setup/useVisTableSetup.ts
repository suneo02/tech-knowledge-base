import { Column, RowData, SourceTypeEnum } from 'gel-api'
import { useVisTableContext } from '../../context/VisTableContext'
import { isNullOrEmpty } from '@/utils/common/data'
import * as VTable from '@visactor/vtable'
import { message } from '@wind/wind-ui'
import { useEffect, useRef } from 'react'
import { getCellMenuItems, getColumnMenuItems } from '../../config'
import { CellSelectedWithSourceOperation } from '../../types/operationTypes'
import { OperationType } from '../../utils/OperationTypes'
import { OperationHandler, useOperationHandler } from '../useOperationHandler'
import { useGetRecords } from '../useGetRecords'
import { useRegister } from './useRegister'
import { useTableData } from './useTableData'

interface RefreshParams {
  sheets?: number[]
  row?: string[]
  position?: 'right' | 'bottom'
}

export const useVisTableSetup = (
  elementRef: React.RefObject<HTMLDivElement>,
  sheetId: number,
  onOperation?: OperationHandler,
  onCellSelectedWithSource?: (cell?: CellSelectedWithSourceOperation['payload']) => void
) => {
  const { visTableRef, setVisTableInstance, getCellMeta, getAllColumns, setRefreshRef } = useVisTableContext()
  const tableInitialized = useRef<boolean>(false)
  const loadedData = useRef<Record<number, Promise<RowData[]>>>({})
  const handleOperation = useOperationHandler(sheetId, onOperation)
  const { getRecords } = useGetRecords()

  // 使用 useRequest 管理数据请求和loading状态
  const { data, loading, error, run: refreshData } = useTableData(sheetId)

  useRegister()

  useEffect(() => {
    const setupEventListeners = () => {
      if (!visTableRef.current) return

      // console.log('设置事件监听')

      // 单元格值变化
      visTableRef.current.on('change_cell_value', (cell) => {
        // console.log('change_cell_value', cell)
        if (isNullOrEmpty(cell.currentValue) && isNullOrEmpty(cell.changedValue)) {
          return
        }
        if (cell.row === 0) {
          if (isNullOrEmpty(cell.changedValue)) {
            message.error('列名不能为空')
            visTableRef.current?.changeCellValue(cell.col, cell.row, cell.currentValue)
            return
          }
          handleOperation(OperationType.COLUMN_RENAME, cell)
        } else {
          handleOperation(OperationType.SET_CELL_VALUE, cell)
        }
      })

      // 图标点击
      visTableRef.current.on('icon_click', (cell) => {
        handleOperation(OperationType.ICON_CLICK, cell)
      })

      // 下拉菜单点击
      visTableRef.current.on('dropdown_menu_click', (cell) => {
        handleOperation(OperationType.DROPDOWN_MENU_CLICK, cell)
        // handleOperation(OperationType.DROPDOWN_MENU_CLICK, cell)
      })

      // 列宽调整结束
      visTableRef.current.on('resize_column_end', () => {
        // console.log('🚀 ~ cell  resize_column_end ~ cell:', cell)
        // handleOperation(OperationType.COLUMN_RESIZE, cell)
      })

      visTableRef.current.on('dblclick_cell', (cell) => {
        // console.log('🚀 ~ cell  dblclick_cell ~ cell:', cell)
        if (cell.row !== 0) {
          visTableRef.current?.startEditCell(cell.col, cell.row)
        }
      })

      // 表头位置变化
      visTableRef.current.on('change_header_position', (cell) => {
        // console.log('🚀 ~ cell  change_header_position ~ cell:', cell)
        const { source, target } = cell
        handleOperation(OperationType.COLUMN_MOVE, { fromCol: source.col, toCol: target.col })
      })

      // 表头位置变化
      visTableRef.current.on('copy_data', () => {
        message.warning('暂不支持表格复制，如需复制，请点击右上角操作 下载文件')
      })

      // 单元格选中
      visTableRef.current.on('selected_cell', (cellInfo) => {
        // handleOperation(OperationType.CELL_SELECTED, cellInfo)
        const { col, row, ranges } = cellInfo
        const cellMeta = getCellMeta<RowData & { value: string; sourceId: string; sourceType: SourceTypeEnum }>(
          col,
          row,
          ranges
        )
        // console.log('🚀 ~ selected_cell ~ cellMeta:', cellMeta)
        // const columns = getAllColumns()
        // if (columns.length === col && ranges[0].start.col === ranges[0].end.col) {
        //   handleOperation(OperationType.COLUMN_ADD, { col: col - 1 })
        //   return
        // }

        if (!cellMeta) {
          onCellSelectedWithSource?.()
          return
        }

        if (cellMeta.sourceId && cellMeta.sourceType) {
          const companySource =
            cellMeta.sourceType === SourceTypeEnum.CDE ||
            cellMeta.sourceType === SourceTypeEnum.INDICATOR ||
            cellMeta.sourceType === SourceTypeEnum.AI_CHAT ||
            cellMeta.sourceType === SourceTypeEnum.AI_GENERATE_COLUMN
          if (!companySource) return
          onCellSelectedWithSource?.({
            sourceId: cellMeta.sourceId,
            sourceType: cellMeta.sourceType,
            value: cellMeta.value,
          })
        } else {
          onCellSelectedWithSource?.()
        }
      })

      // // 单元格点击
      // visTableRef.current.on('click_cell', (cell) => {
      //   // console.log('🚀 ~ cell  click_cell ~ cell:', cell)
      //   handleOperation(OperationType.CELL_CLICK, cell)
      // })

      // 键盘事件
      // visTableRef.current.on('keydown', (cell) => {
      //   // console.log('🚀 ~ cell  keydown ~ cell:', cell)
      //   // handleOperation(OperationType.KEYDOWN, cell)
      // })
    }

    const setupDataSource = (rowIds: string[]) => {
      loadedData.current = {}
      return new VTable.data.CachedDataSource({
        get(index) {
          const batchSize = 100
          const batchIndex = Math.floor(index / batchSize)
          const batchStartIndex = batchIndex * batchSize
          // console.log('🚀 ~ get ~ batchStartIndex:', batchStartIndex)
          if (!loadedData.current[batchIndex]) {
            const batchRowIds = rowIds.slice(batchStartIndex, batchStartIndex + batchSize)
            loadedData.current[batchIndex] = getRecords(batchRowIds)
          }
          return loadedData.current[batchIndex].then((data) => {
            // console.log('🚀 ~ get ~ data:', data?.[index - batchStartIndex])

            return data?.[index - batchStartIndex] || ({ rowId: '', id: '' } as RowData)
          })
        },
        length: rowIds.length,
      })
    }

    const initializeTable = (columns: VTable.TYPES.ColumnDefine[], rowIds: string[]) => {
      const dataSource = setupDataSource(rowIds)
      const options: VTable.TYPES.ListTableConstructorOptions = {
        columns,
        dragHeaderMode: 'column',
        editor: '', // 配置一个空的编辑器，以遍能粘贴到单元格中
        editCellTrigger: 'api',
        keyboardOptions: {
          copySelected: true,
          // pasteValueToCell: true,
        },
        // widthMode: 'standard',
        menu: {
          contextMenuItems: (field, row) => {
            // console.log('🚀 ~ contextMenuItems ~ field:', field, row)
            if (row === 0) {
              // const headerEditor = columns.find((res) => res.field === field)?.headerEditor
              const column = getAllColumns().find((res) => res.field === field)
              // console.log('🚀 ~ initializeTable ~ column:', column)
              // const initSourceType = column?.initSourceType === SourceTypeEnum.AI_GENERATE_COLUMN

              return getColumnMenuItems(column as Column)
            }
            return getCellMenuItems()
          },
        },
        rowSeriesNumber: {
          title: '',
          width: 'auto',
          style: {
            textAlign: 'center',
          },
        },
        tooltip: {
          isShowOverflowTextTooltip: true,
        },
        // rightFrozenColCount: 1,
        dataSource,
        theme: VTable.themes.ARCO.extends({
          frameStyle: {
            cornerRadius: 0,
            borderColor: '#ecedee',
            shadowColor: 'transparent',
            shadowBlur: 0,
          },
          selectionStyle: {
            cellBorderColor: '#0596b3',
            cellBgColor: 'rgba(211, 238, 245, .2)',
          },
          cornerHeaderStyle: {
            bgColor: '#e6e7e9',
          },
          headerStyle: {
            bgColor: '#e6e7e9',
            hover: {
              //   cellBorderColor: "#003fff",
              cellBgColor: 'rgba(211,238,245,.6)',
              inlineRowBgColor: 'rgba(211,238,245,.6)',
              inlineColumnBgColor: 'rgba(211,238,245,.6)',
            },
          },
          scrollStyle: {
            visible: 'focus',
            scrollSliderColor: '#0596b3',
            scrollRailColor: '#bac3cc',
            hoverOn: false,
            barToSide: true,
            width: 6,
          },
        }),
      }
      const tableInstance = new VTable.ListTable(elementRef.current!, options)
      setVisTableInstance(tableInstance)
      tableInitialized.current = true
      setupEventListeners()
      // 插件问题，必须要延迟500ms设置冻结列才会生效
      setTimeout(() => {
        tableInstance.setFrozenColCount(2)
      }, 500)
    }

    // 当数据加载完成时初始化表格
    if (data) {
      initializeTable(data.columns, data.rowIds)
    }

    const onRefreshToPosition = async (params: RefreshParams = {}) => {
      // console.log('刷新表格数据，终极刷新', params)
      loadedData.current = {}
      tableInitialized.current = false // 重置初始化状态，允许重新初始化
      await refreshData() // 使用 useRequest 的 run 方法重新获取数据
      if (params.position === 'bottom') {
        setTimeout(() => visTableRef.current?.scrollToRow(visTableRef.current?.records.length - 1), 100)
      }
      if (params.position === 'right') {
        setTimeout(() => visTableRef.current?.scrollToCol(0), 100)
      }
    }

    if (setRefreshRef) {
      setRefreshRef({ current: { refresh: onRefreshToPosition } })
      setTimeout(() => visTableRef.current?.scrollToRow(visTableRef.current?.records.length - 1), 100)
    }

    // useRequest 会自动处理请求的取消，无需手动清理
  }, [sheetId, getRecords, data])

  return {
    visTableRef,
    rowLength: error ? -1 : (data?.rowLength ?? 0),
    loading,
  }
}
