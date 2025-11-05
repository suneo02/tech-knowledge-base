import { CellMetadata, ProgressStatusEnum, Column, RowData, SourceTypeEnum } from 'gel-api'
import { useVisTableContext } from '../../context/VisTableContext'
// import { requestToSuperlistFcs } from '@/api'
import { requestToWFCSuperlistFcs } from '@/api'
import { TaskIdentifier } from '@/components/MultiTable/context'
import { isNullOrEmpty } from '@/utils/common/data'
import * as VTable from '@visactor/vtable'
import { nanoid } from 'nanoid'
import { useEffect, useRef } from 'react'
import { getCellMenuItems, getColumnMenuItems } from '../../config'
import { GENERATE_TEXT } from '../../config/status'
import { CellSelectedWithSourceOperation } from '../../types/operationTypes'
import { handleColumnUtils } from '../../utils/handleColumn'
import { OperationType } from '../../utils/OperationTypes'
import { OperationHandler, useOperationHandler } from '../useOperationHandler'
import { useTableHistoryActions } from '../withTableHistory'
import { useRegister } from './useRegister'
import { IconTypeEnum } from '../../types/iconTypes'
import { message } from '@wind/wind-ui'
// import { mockRowData, mockRowIds, mockColumns } from '@/components/MultiTable/mock'

// 定义刷新参数接口
interface RefreshParams {
  sheets?: number[]
  row?: string[]
  position?: 'right' | 'bottom'
}

/**
 * 表格初始化Hook
 * 将DOM元素、表格配置和表格操作关联起来
 *
 * @param elementRef DOM元素引用
 * @param onOperation 外部操作处理函数
 * @returns 表格实例和其他相关状态
 */
export const useVisTableSetup = (
  elementRef: React.RefObject<HTMLDivElement>,
  sheetId: number,
  onOperation?: OperationHandler,
  onCellSelectedWithSource?: (cell?: CellSelectedWithSourceOperation['payload']) => void
) => {
  const { visTableRef, setVisTableInstance, getCellMeta, getAllColumns, setRefreshRef } = useVisTableContext()
  // const { addColumn } = useTableHistoryActions({ sheetId })
  const tableInitialized = useRef<boolean>(false)
  const loadedData = useRef<Record<number, Promise<RowData[]>>>({})
  const [rowLength, setRowLength] = useState<number | undefined>()

  // 获取操作处理函数，传入sheetId
  const handleOperation = useOperationHandler(sheetId, onOperation)

  // 注册编辑器及图标
  useRegister()

  // 获取行数据记录
  const getRecords = async (rowIds: string[]): Promise<RowData[]> => {
    try {
      const res = await requestToWFCSuperlistFcs('superlist/excel/getRowsDetail', {
        rowIds: rowIds,
      })
      // const res = mockRowData
      if (rowIds.length !== res.Data.data.length) {
        console.error(`传入的数据和返回的数据长度不一致， 传入长度${rowIds.length}，输出长度${res.Data.data.length}`)
        const mixture = Array.from(
          { length: Math.abs(rowIds.length - res.Data.data.length) },
          () =>
            ({
              rowId: '', // 添加必要的 RowData 属性
              id: '', // 添加必要的 RowData 属性
            }) as RowData
        )
        return [...res.Data.data, ...mixture]
      }

      const list: TaskIdentifier[] = []
      res.Data.data.map((item) => {
        return Object.keys(item).map((key) => {
          if (key.includes('&')) {
            const cellMetadata = item[key] as CellMetadata

            if (cellMetadata?.status === ProgressStatusEnum.RUNNING) {
              item[key.split('&')[0]] = GENERATE_TEXT
              list.push({
                columnId: cellMetadata.columnId,
                rowId: cellMetadata.rowId,
                originalContent: cellMetadata.processedValue,
                status: cellMetadata.status,
              })
            }
          } else {
            const cellMetadata = item?.[`${key}&`] as CellMetadata
            if (
              cellMetadata &&
              (cellMetadata.status === ProgressStatusEnum.SUCCESS ||
                cellMetadata.status === ProgressStatusEnum.FAILED) &&
              (cellMetadata.sourceType === SourceTypeEnum.AI_CHAT ||
                cellMetadata.sourceType === SourceTypeEnum.AI_GENERATE_COLUMN ||
                cellMetadata.sourceType === SourceTypeEnum.CDE ||
                cellMetadata.sourceType === SourceTypeEnum.INDICATOR)
            ) {
              item[key] = item[key] && (item[key] as unknown as number) !== 0 ? item[key] : '--'
            }
          }
          return item[key]
        })
      })
      console.log('🚀 ~ getRecords ~ last:', [...res.Data.data, { rowId: nanoid(14) }])

      return res.Data.data
    } catch (error) {
      console.error(error)
      // 发生错误时返回空数组，同时确保类型正确
      return [] as RowData[]
    }
  }

  // 配置懒加载数据源
  const setupDataSource = (rowIds: string[]) => {
    return new VTable.data.CachedDataSource({
      get(index) {
        console.log(index)
        const batchSize = 20
        const batchIndex = Math.floor(index / batchSize)
        const batchStartIndex = batchIndex * batchSize
        if (!loadedData.current[batchIndex]) {
          const batchRowIds = rowIds.slice(batchStartIndex, batchStartIndex + batchSize)
          // const lastBatchIndex = Math.floor(rowIds.length / batchSize)
          const promiseObject = getRecords(batchRowIds)
          loadedData.current[batchIndex] = promiseObject
        }

        return loadedData.current[batchIndex].then((data) => {
          const indexInBatch = index - batchStartIndex

          return data[indexInBatch] || ({ rowId: '', id: '' } as RowData)
        })
      },
      length: rowIds.length,
    })
  }

  // 设置事件监听
  const setupEventListeners = () => {
    if (!visTableRef.current) return

    console.log('设置事件监听')

    // 单元格值变化
    visTableRef.current.on('change_cell_value', (cell) => {
      console.log('change_cell_value', cell)
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
    visTableRef.current.on('resize_column_end', (cell) => {
      console.log('🚀 ~ cell  resize_column_end ~ cell:', cell)
      // handleOperation(OperationType.COLUMN_RESIZE, cell)
    })

    visTableRef.current.on('dblclick_cell', (cell) => {
      console.log('🚀 ~ cell  dblclick_cell ~ cell:', cell)
      if (cell.row !== 0) {
        visTableRef.current?.startEditCell(cell.col, cell.row)
      }
    })

    // 表头位置变化
    visTableRef.current.on('change_header_position', (cell) => {
      console.log('🚀 ~ cell  change_header_position ~ cell:', cell)
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
      const cellMeta = getCellMeta<CellMetadata & { value: string }>(col, row, ranges)
      console.log('🚀 ~ selected_cell ~ cellMeta:', cellMeta)
      const columns = getAllColumns()
      if (columns.length === col && ranges[0].start.col === ranges[0].end.col) {
        handleOperation(OperationType.COLUMN_ADD, { col: col - 1 })
        return
      }

      if (!cellMeta) {
        onCellSelectedWithSource?.()
        return
      }

      if (cellMeta?.sourceId && cellMeta?.sourceType) {
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
    //   console.log('🚀 ~ cell  click_cell ~ cell:', cell)
    //   handleOperation(OperationType.CELL_CLICK, cell)
    // })

    // 键盘事件
    // visTableRef.current.on('keydown', (cell) => {
    //   console.log('🚀 ~ cell  keydown ~ cell:', cell)
    //   // handleOperation(OperationType.KEYDOWN, cell)
    // })
  }

  // 初始化表格 配置 options 和 dataSource
  const initializeTable = (columns, rowIds) => {
    console.log('🚀 ~ initializeTable ~ columns:', columns)
    const frozenColumns = columns.filter((res) => res.isFrozen)
    const frozenColCount = frozenColumns.length
    console.log('🚀 ~ initializeTable ~ frozenColCount:', frozenColCount)
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
          console.log('🚀 ~ contextMenuItems ~ field:', field, row)
          if (row === 0) {
            // const headerEditor = columns.find((res) => res.field === field)?.headerEditor
            const column = getAllColumns().find((res) => res.field === field)
            console.log('🚀 ~ initializeTable ~ column:', column)
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
        // cellType: 'checkbox', // 选中
        // dragOrder: true, // 拖拽
      },
      tooltip: {
        isShowOverflowTextTooltip: true,
      },
      // rowResizeMode: 'all', // autoWrapText: true,
      frozenColCount: 1 + frozenColCount,
      rightFrozenColCount: 1,
      customMergeCell: (col, row, table) => {
        // if (col >= 0 && col < table.colCount && row === table.rowCount - 1) {
        //   return {
        //     text: '   +',
        //     range: {
        //       start: {
        //         col: 0,
        //         row: table.rowCount - 1,
        //       },
        //       end: {
        //         col: table.colCount - 1,
        //         row: table.rowCount - 1,
        //       },
        //     },
        //     style: {
        //       textAlign: 'left',
        //       cursor: 'pointer',
        //     },
        //   }
        // }

        // if (col >= 0 && col < table.colCount && row === table.rowCount - 1) {
        //   return {
        //     text: '总结栏：此数据为一份人员基本信息',
        //     range: {
        //       start: {
        //         col: 0,
        //         row: table.rowCount - 1,
        //       },
        //       end: {
        //         col: table.colCount - 1,
        //         row: table.rowCount - 1,
        //       },
        //     },
        //     style: {
        //       borderLineWidth: [6, 1, 1, 1],
        //       borderColor: ['gray'],
        //     },
        //   }
        // }
        if (row >= 1 && row < table.rowCount && col === table.colCount - 1) {
          return {
            text: '+',
            range: {
              start: {
                col: table.colCount - 1,
                row: 1,
              },
              end: {
                col: table.colCount - 1,
                row: table.rowCount - 1,
              },
            },
            style: {
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: 'red',
            },
          }
        }
      },
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
          width: 8,
        },
      }),
    }
    const tableInstance = new VTable.ListTable(elementRef.current!, options)

    // 添加日志确认实例创建成功
    console.log('表格实例创建成功:', tableInstance)

    // 确保实例被正确设置到上下文
    setVisTableInstance(tableInstance)

    // 再次确认实例已正确设置
    console.log('设置后的表格实例引用:', visTableRef.current)

    tableInitialized.current = true

    // 在表格初始化完成后立即添加事件监听
    setupEventListeners()
  }

  // 获取表头和初始化表格
  const getSheetInfo = async () => {
    try {
      // 使用 Promise.all 并发请求数据
      const [columnsResponse, rowIdsResponse] = await Promise.all([
        requestToWFCSuperlistFcs('superlist/excel/getSheetColumns', { sheetId }),
        requestToWFCSuperlistFcs('superlist/excel/getSheetAllRowIds', { sheetId }),
      ])
      // const columnsResponse = mockColumns
      // const rowIdsResponse = mockRowIds

      // 处理列数据
      const { Data: columnsResult } = columnsResponse
      const columns = columnsResult.columns.map((res) => handleColumnUtils(res))

      // 处理行ID数据
      const { Data: rowIdsResult } = rowIdsResponse
      setRowLength(rowIdsResult?.rowIds?.length ?? 0)
      console.log('🚀 ~ rowIdsResult ~ res:', rowIdsResult.rowIds)
      const rowIds = rowIdsResult.rowIds

      const initialColumns = [
        ...columns,
        {
          field: '操作',
          title: '',
          width: 40,
          headerIcon: IconTypeEnum.ADD,
        },
      ]

      // 初始化表格
      initializeTable(initialColumns, rowIds)

      // 更新列配置状态
      // setTableColumns(columns)
    } catch (error) {
      // 错误处理
      console.error('获取表格数据失败:', error)
      setRowLength(-1)
      // 可以根据需要显示错误提示
      // message.error('获取表格数据失败，请稍后重试')
      return {
        columns: [],
        rowIds: [],
      }
    }
  }

  // 定义刷新方法
  const onRefresh = (params: RefreshParams = {}) => {
    console.log('刷新表格数据，终极刷新', params.sheets)
    // 清空所有缓存的数据
    loadedData.current = {}
    // 重新获取表格数据并更新表格
    getSheetInfo()
  }

  const onRefreshToPosition = async (params: RefreshParams = {}) => {
    console.log('刷新表格数据，终极刷新', params.sheets)
    // 清空所有缓存的数据
    loadedData.current = {}
    // 重新获取表格数据并更新表格
    await getSheetInfo()
    if (params.position === 'bottom') {
      // 滚动到表格底部
      setTimeout(() => {
        visTableRef.current?.scrollToRow(visTableRef.current?.records.length - 1)
      }, 100)
    }
    if (params.position === 'right') {
      // 滚动到表格左侧
      setTimeout(() => {
        visTableRef.current?.scrollToCol(0)
      }, 100)
    }
  }

  // 使用useEffect监听并初始化表格
  useEffect(() => {
    getSheetInfo()

    // 将刷新方法绑定到refreshRef
    if (setRefreshRef) {
      setRefreshRef({
        current: {
          refresh: onRefreshToPosition,
        },
      })
    }

    // 使用useEffect作为安全机制，确保事件监听被设置
    if (visTableRef.current && !tableInitialized.current) {
      console.log('通过useEffect监控到visTableRef.current:', visTableRef.current)
      setupEventListeners()
      tableInitialized.current = true
    }

    // 返回清理函数
    return () => {
      console.log('组件卸载，清理表格实例')
      // 可以在这里进行必要的清理
    }
  }, [])

  return {
    visTableRef,
    getSheetInfo,
    setupEventListeners,
    initializeTable,
    onRefresh,
    rowLength,
  }
}
