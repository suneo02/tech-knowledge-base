import { ListTable, ColumnDefine } from '@visactor/vtable'
import {
  createContext,
  useContext,
  useRef,
  ReactNode,
  MutableRefObject,
  useCallback,
  useReducer,
  useEffect,
} from 'react'
import { CellRange, ColumnsDefine, SortState } from '@visactor/vtable/es/ts-types'
import { CellMetadata, RowData } from 'gel-api'
import { useUpdateEffect } from 'ahooks'

// 定义表格操作类型
export enum TableActionType {
  SET_CELL_VALUE = 'SET_CELL_VALUE', // 更改单元格的值

  ADD_COLUMN = 'ADD_COLUMN', // 增加一列

  SET_RECORDS = 'SET_RECORDS',
  ADD_RECORD = 'ADD_RECORD',
  ADD_RECORDS = 'ADD_RECORDS',
  DELETE_RECORDS = 'DELETE_RECORDS',
  UPDATE_RECORDS = 'UPDATE_RECORDS',
  REFRESH = 'REFRESH',
  REFRESH_WITH_RECREATE_CELLS = 'REFRESH_WITH_RECREATE_CELLS',

  UPDATE_COLUMNS = 'UPDATE_COLUMNS',
  SELECT_CELL = 'SELECT_CELL',
  CLEAR_SELECTION = 'CLEAR_SELECTION',
  SCROLL_TO_CELL = 'SCROLL_TO_CELL',
}

// 定义表格操作的Action类型
type TableAction =
  | {
      type: TableActionType.SET_CELL_VALUE
      payload: { col: number; row: number; value: string | number; workOnEditableCell?: boolean }
    }
  | {
      type: TableActionType.ADD_COLUMN
      payload: { col: number; row: number; value: string | number }
    }
  | {
      type: TableActionType.SET_RECORDS
      payload: { records: Record<string, unknown>[]; option?: { sortState?: SortState | SortState[] | null } }
    }
  | { type: TableActionType.ADD_RECORD; payload: { record: CellMetadata; recordIndex?: number } }
  | {
      type: TableActionType.ADD_RECORDS
      payload: { records: Record<string, unknown>[]; recordIndex?: number | number[] }
    }
  | { type: TableActionType.DELETE_RECORDS; payload: { recordIndexes: number[] } }
  | { type: TableActionType.UPDATE_RECORDS; payload: { records: Record<string, unknown>[]; recordIndexes: number[] } }
  | { type: TableActionType.REFRESH; payload?: undefined }
  | { type: TableActionType.REFRESH_WITH_RECREATE_CELLS; payload?: undefined }
  | { type: TableActionType.UPDATE_COLUMNS; payload: { columns: ColumnDefine[] } }
  | { type: TableActionType.SELECT_CELL; payload: { col: number; row: number } }
  | { type: TableActionType.CLEAR_SELECTION; payload?: undefined }
  | { type: TableActionType.SCROLL_TO_CELL; payload: { col: number; row: number } }

// 定义刷新参数接口
interface RefreshParams {
  sheets?: number[]
  row?: string[]
  position?: 'right' | 'bottom'
}

// 定义通用方法参数接口（可根据实际需求修改）
export interface CustomMethodParams {
  [key: string]: unknown
}

// 创建 VisTable 的 Context
interface VisTableContextType {
  visTableRef: MutableRefObject<ListTable | null>
  setVisTableInstance: (instance: ListTable | null) => void
  dispatch: React.Dispatch<TableAction>
  getCellMeta: <T = unknown>(col: number, row: number, ranges?: CellRange[]) => T | false
  getCellMetaById: <T = unknown>(columnId: string, rowId: string) => T | null
  getTableInstance: () => ListTable | null
  getAllColumns: () => ColumnsDefine
  startEditCell: (col: number, row: number, value?: string) => void
  getDisplayRowIds: () => string[]
  getColByColumnId: (columnId: string) => number | null
  getDisplayRow: () => RowData[]
  getColumnByCol: (col: number) => ColumnDefine | null
  getRecordByCell: (col: number, row: number) => RowData
  sheetId?: number // 当前工作表ID
  refreshRef: MutableRefObject<{
    refresh: (params?: RefreshParams) => void
  }>
  setRefreshRef: (
    ref: MutableRefObject<{
      refresh: (params?: RefreshParams) => void
    }>
  ) => void
  // 添加新的ref对象和设置函数
  customMethodRef: MutableRefObject<{
    executeMethod: (params?: CustomMethodParams) => void
  }>
  setCustomMethodRef: (
    ref: MutableRefObject<{
      executeMethod: (params?: CustomMethodParams) => void
    }>
  ) => void
  getSelectedCellInfos: ListTable['getSelectedCellInfos']
}

// 创建 Context
const VisTableContext = createContext<VisTableContextType | undefined>(undefined)

// 提供 hook 方便使用 context
export const useVisTableContext = () => {
  const context = useContext(VisTableContext)
  if (!context) {
    throw new Error('useVisTableContext 必须在 VisTableContextProvider 内部使用')
  }
  return context
}

// 创建表格操作的reducer
const tableReducer = (state: ListTable | null, action: TableAction): ListTable | null => {
  console.log('🚀 ~ tableReducer执行 action:', action.type, action.payload)

  if (!state) {
    console.warn('表格实例不存在，无法执行操作:', action.type)
    return null
  }

  try {
    switch (action.type) {
      case TableActionType.SET_CELL_VALUE:
        state.changeCellValue(
          action.payload.col,
          action.payload.row,
          action.payload.value,
          action.payload.workOnEditableCell || false
        )
        return state
      case TableActionType.ADD_COLUMN:
        state.changeCellValue(action.payload.col, action.payload.row, action.payload.value)
        return state
      case TableActionType.SET_RECORDS:
        state.setRecords(action.payload.records, action.payload.option)
        return state

      case TableActionType.ADD_RECORD:
        state.addRecord(action.payload.record, action.payload.recordIndex)
        state.selectCell(0, action.payload.recordIndex + 1)
        return state

      case TableActionType.ADD_RECORDS:
        state.addRecords(action.payload.records, action.payload.recordIndex)
        return state

      case TableActionType.DELETE_RECORDS:
        state.deleteRecords(action.payload.recordIndexes)
        return state

      case TableActionType.UPDATE_RECORDS:
        state.updateRecords(action.payload.records, action.payload.recordIndexes)
        return state

      case TableActionType.REFRESH:
        state.render()
        return state

      case TableActionType.REFRESH_WITH_RECREATE_CELLS:
        state.renderWithRecreateCells()
        return state

      case TableActionType.UPDATE_COLUMNS:
        console.log('🚀 ~ tableReducer执行 action:', action.type, action.payload)
        state.updateColumns(action.payload.columns)
        return state

      case TableActionType.SELECT_CELL:
        state.selectCell(action.payload.col, action.payload.row)
        return state

      case TableActionType.CLEAR_SELECTION:
        state.clearSelected()
        return state

      case TableActionType.SCROLL_TO_CELL:
        state.scrollToCell({ col: action.payload.col, row: action.payload.row })
        return state

      default:
        return state
    }
  } catch (error) {
    console.error('表格操作执行失败:', error)
    return state
  }
}

// 创建 Provider 组件
export const VisTableContextProvider: React.FC<{
  children: ReactNode
  sheetId?: number
  refreshTime?: string
  onRefresh?: (params?: RefreshParams) => void
}> = ({ children, sheetId, refreshTime, onRefresh }) => {
  const visTableRef = useRef<ListTable | null>(null)
  const refreshRef = useRef<{
    refresh: (params?: RefreshParams) => void
  }>({
    refresh: (params?: RefreshParams) => {
      console.log('refresh method not implemented yet, refreshing with params:', params)
      // 如果提供了onRefresh回调，则调用它
      if (onRefresh) {
        onRefresh(params)
      }
    },
  })

  // 初始化自定义方法ref
  const customMethodRef = useRef<{
    executeMethod: (params?: CustomMethodParams) => void
  }>({
    executeMethod: (params?: CustomMethodParams) => {
      console.log('executeMethod not implemented yet, called with params:', params)
    },
  })

  const [, dispatch] = useReducer((state: ListTable | null, action: TableAction) => {
    // 使用最新的表格实例作为state
    return tableReducer(visTableRef.current, action)
  }, null)

  // 当refreshTime改变时，触发表格刷新
  useUpdateEffect(() => {
    if (refreshTime) {
      console.log('refreshTime changed, triggering refresh:', refreshTime)
      refreshRef.current.refresh()
    }
  }, [refreshTime])

  // 表格实例改变时更新reducer状态
  useEffect(() => {
    console.log('visTableRef.current changed:', visTableRef.current)
  }, [visTableRef.current])

  const setVisTableInstance = (instance: ListTable | null) => {
    if (instance) {
      console.log('设置表格实例setVisTableInstance:', instance)
      visTableRef.current = instance
    }
  }

  const setRefreshRef = (
    ref: MutableRefObject<{
      refresh: (params?: RefreshParams) => void
    }>
  ) => {
    refreshRef.current = ref.current
  }

  // 设置自定义方法ref
  const setCustomMethodRef = (
    ref: MutableRefObject<{
      executeMethod: (params?: CustomMethodParams) => void
    }>
  ) => {
    customMethodRef.current = ref.current
  }

  // 获取表格实例
  const getTableInstance = useCallback((): ListTable | null => {
    return visTableRef.current
  }, [])

  // 获取单元格元数据
  const getCellMeta = useCallback(<T = unknown,>(col: number, row: number, ranges?: CellRange[]): T | false => {
    const table = visTableRef.current
    console.log('🚀 ~ table:', table)
    if (!table) return false

    if (ranges && (ranges.length > 1 || ranges[0].start.row === 0)) {
      console.warn('获取表头列失败: 暂不支持范围参数获取')
      return false
    }

    try {
      const columnId = table.getHeaderField(col, row)
      const record = table.getRecordByCell(col, row)
      const cellMeta = record[`${columnId}&`] as T
      return { ...cellMeta, columnId, rowId: record.rowId, value: record[columnId as string] }
    } catch (error) {
      console.error('获取单元格元信息失败:', error)
      return false
    }
  }, [])

  const getAllColumns = useCallback(() => {
    const table = visTableRef.current
    if (!table) return []
    return visTableRef.current.columns
  }, [])

  const getDisplayRowIds = useCallback((): string[] => {
    const table = visTableRef.current
    if (!table) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataSource = (visTableRef.current.dataSource as any)._recordCache
    return dataSource.map((record) => record.rowId)
  }, [])

  const getDisplayRow = useCallback((): RowData[] => {
    const table = visTableRef.current
    if (!table) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataSource = (visTableRef.current.dataSource as any)._recordCache
    return dataSource
  }, [])

  // 通过ID获取单元格元数据
  const getCellMetaById = useCallback(<T = unknown,>(columnId: string, rowId: string): T | null => {
    const table = visTableRef.current
    if (!table) return null

    try {
      const record = table.records.find((record) => record[rowId] === rowId)
      const cellMeta = record?.[`${columnId}&`] as T
      return cellMeta
    } catch (error) {
      console.error('获取单元格元信息失败:', error)
      return null
    }
  }, [])

  // 编辑单元格
  const startEditCell = useCallback((col: number, row: number, value?: string): void => {
    const table = visTableRef.current
    if (!table) return null

    try {
      return table.startEditCell(col, row, value)
    } catch (error) {
      console.error('获取单元格元信息失败:', error)
      return null
    }
  }, [])

  const getColByColumnId = useCallback((columnId: string): number | null => {
    const table = visTableRef.current
    if (!table) return null
    const index = table.columns.findIndex((col) => col.field === columnId)
    return index === -1 ? null : index + 1
  }, [])

  const getColumnByCol = useCallback((col: number): ColumnDefine | null => {
    const table = visTableRef.current
    if (!table) return null
    return table.columns[col - 1]
  }, [])

  const getRecordByCell = useCallback((col: number, row: number): RowData => {
    const table = visTableRef.current
    if (!table) return null
    return table.getRecordByCell(col, row)
  }, [])

  const getSelectedCellInfos = useCallback(() => {
    const table = visTableRef.current
    if (!table) return null
    return table.getSelectedCellInfos()
  }, [])

  return (
    <VisTableContext.Provider
      value={{
        visTableRef,
        setVisTableInstance,
        dispatch,
        getCellMeta,
        getCellMetaById,
        getTableInstance,
        getAllColumns,
        startEditCell,
        getDisplayRowIds,
        getColByColumnId,
        getDisplayRow,
        getColumnByCol,
        getRecordByCell,
        sheetId,
        refreshRef,
        setRefreshRef,
        customMethodRef,
        setCustomMethodRef,
        getSelectedCellInfos,
      }}
    >
      {children}
    </VisTableContext.Provider>
  )
}
