import * as VTable from '@visactor/vtable'
import { CellAddress } from '@visactor/vtable-editors'
import { SearchComponent } from '@visactor/vtable-search'
import { useSetState } from 'ahooks'
import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react'
import { ISheetInfo, useTableContext } from './TableContext'
import { fetchPoints, useAppDispatch } from '@/store'
import { createWFCSuperlistRequestFcs } from '@/api'
import type { Sheet as SheetInfoWithIndex } from 'gel-api'

export interface SheetContextState {
  /** 当前激活的 Sheet（标签页）的 ID */
  activeSheetId: string
  /** 设置当前激活的 Sheet ID 的方法 */
  setActiveSheetId: (sheetId: string) => void
  /** 存储所有已挂载 Sheet 的 VTable 实例的引用，键为 sheetId */
  sheetRefs: Record<string, VTable.ListTable | null>
  /**
   * 注册或注销一个 Sheet 的 VTable 实例。
   * @param tabKey - Sheet 的 ID。
   * @param node - VTable 实例，或在卸载时传入 null。
   */
  registerTabRef: (tabKey: string, node: VTable.ListTable | null) => void
  /**
   * 滚动到指定 Sheet 的特定单元格。
   * @param tabKey - 目标 Sheet 的 ID。
   * @param cellAddress - 目标单元格的地址，如 { row: 10, col: 2 }。
   * @returns - 如果操作被接受（无论是立即执行还是加入待办队列），则返回 true。
   */
  scrollToCell: (tabKey: string, cellAddress: CellAddress) => boolean
  /**
   * 刷新一个指定的 Sheet。
   * 这通常通过更新一个版本号来实现，从而触发对应的组件重新渲染。
   * @param sheetId - 要刷新的 Sheet 的 ID。
   * @returns - 如果 Tab 已加载并已请求刷新，则返回 true。
   */
  refreshTab: (sheetId: string, placement?: 'right' | 'bottom') => boolean
  /**
   * 检查一个 Sheet 是否已经被加载过（即其组件是否至少挂载过一次）。
   * @param tabKey - 要检查的 Sheet 的 ID。
   * @returns - 如果已加载则返回 true，否则返回 false。
   */
  isTabLoaded: (tabKey: string) => boolean
  /** 存储每个 Sheet 版本号的记录，用于驱动刷新 */
  tabVersions: Record<string, number>
  /**
   * 注册一个用于取消该 Sheet 内所有请求的清理函数。
   * @param tabKey - Sheet 的 ID。
   * @param clearFn - 执行清理操作的函数，或传入 null 以注销。
   */
  registerClearFn: (tabKey: string, clearFn: (() => void) | null) => void
  /**
   * 调用已注册的清理函数，取消指定 Sheet 的所有请求。
   * @param tabKey - 目标 Sheet 的 ID。
   */
  cancelAllRequests: (tabKey: string) => void
  /** 存储所有已挂载 Sheet 的 SearchComponent 实例的引用，键为 sheetId */
  searchInstances: Record<string, SearchComponent | null>
  /**
   * 注册或注销一个 Sheet 的 SearchComponent 实例。
   * @param tabKey - Sheet 的 ID。
   * @param instance - SearchComponent 实例，或在卸载时传入 null。
   */
  registerSearchInstance: (tabKey: string, instance: SearchComponent | null) => void

  /**
   * 添加数据到当前 Sheet。
   * @param placement - 添加数据的位置，可以是 'bottom' 或 'right'。
   * @param newSheetInfos - 要添加的数据，通常是新添加的 Sheet 信息。
   */
  addDataToCurrentSheet: (placement: 'bottom' | 'right') => (newSheetInfos: ISheetInfo[]) => void
  /**
   * 删除指定的 Sheet：清理请求、调用后端删除接口并更新本地状态与激活态
   * @param sheetId 要删除的 SheetId（字符串形式）
   */
  deleteSheet: (sheetId: string) => Promise<void>
}

export const SheetContext = createContext<SheetContextState | undefined>(undefined)

export const useSheetContext = () => {
  const context = useContext(SheetContext)
  if (!context) {
    throw new Error('useSheetContext must be used within a SheetProvider')
  }
  return context
}

interface SheetProviderProps {
  children: ReactNode
  activeSheetId: string
  setActiveSheetId: (sheetId: string) => void
}

const START_POSITION = 0
const END_POSITION = 99999

export const SheetProvider = ({ children, activeSheetId, setActiveSheetId }: SheetProviderProps) => {
  const { sheetInfos, updateSheetInfos, updateTableInfo } = useTableContext()
  const [sheetRefs, setSheetRefs] = useSetState<Record<string, VTable.ListTable | null>>({})
  const [searchInstances, setSearchInstances] = useSetState<Record<string, SearchComponent | null>>({})
  const [tabStatus, setTabStatus] = useState<Record<string, { isLoaded: boolean; isMounted: boolean }>>({})
  const [tabVersions, setTabVersions] = useState<Record<string, number>>({})
  const pendingActions = useRef<Record<string, ((element: VTable.ListTable) => void)[]>>({})
  const clearFns = useRef<Record<string, () => void>>({})
  const dispatch = useAppDispatch()

  const registerClearFn = useCallback((tabKey: string, clearFn: (() => void) | null) => {
    if (clearFn) {
      clearFns.current[tabKey] = clearFn
    } else {
      delete clearFns.current[tabKey]
    }
  }, [])

  const cancelAllRequests = useCallback((tabKey: string) => {
    const clearFn = clearFns.current[tabKey]
    if (clearFn) {
      clearFn()
      // console.log(`Tab ${tabKey} 的所有请求已被取消。`)
      return true
    }
    // console.log(`未找到 Tab ${tabKey} 的取消函数。`)
    return false
  }, [])

  const registerSearchInstance = useCallback(
    (tabKey: string, instance: SearchComponent | null) => {
      setSearchInstances((prev) => ({ ...prev, [tabKey]: instance }))
    },
    [setSearchInstances]
  )

  const pollAndScrollOnValueChange = useCallback(
    ({
      tabKey,
      getValue,
      onSuccess,
      onTimeout,
      maxWaitTime = 3000,
      pollInterval = 100,
    }: {
      tabKey: string
      getValue: (instance: VTable.ListTable) => number
      onSuccess: (currentValue: number, initialValue: number, instance: VTable.ListTable) => void
      onTimeout: () => void
      maxWaitTime?: number
      pollInterval?: number
    }) => {
      const tableInstance = sheetRefs[tabKey]
      if (!tableInstance) return

      const initialValue = getValue(tableInstance)
      let elapsedTime = 0

      const pollTimer = setInterval(() => {
        const currentInstance = sheetRefs[tabKey]
        elapsedTime += pollInterval

        if (!currentInstance) {
          clearInterval(pollTimer)
          return
        }

        const currentValue = getValue(currentInstance)

        if (currentValue !== initialValue) {
          clearInterval(pollTimer)
          onSuccess(currentValue, initialValue, currentInstance)
        } else if (elapsedTime >= maxWaitTime) {
          clearInterval(pollTimer)
          console.warn(`Polling for value change timed out after ${maxWaitTime}ms. Forcing action.`)
          onTimeout()
        }
      }, pollInterval)
    },
    [sheetRefs]
  )

  const registerTabRef = useCallback(
    (tabKey: string, node: VTable.ListTable | null) => {
      setSheetRefs((prev) => ({ ...prev, [tabKey]: node }))

      setTabStatus((prev) => {
        const currentStatus = prev[tabKey] || { isLoaded: false, isMounted: false }
        const newStatus = { ...prev }
        if (node) {
          newStatus[tabKey] = { isLoaded: true, isMounted: true }
        } else if (currentStatus.isMounted) {
          newStatus[tabKey] = { ...currentStatus, isMounted: false }
        }
        return newStatus
      })

      if (node && pendingActions.current[tabKey]) {
        pendingActions.current[tabKey].forEach((action) => action(node))
        delete pendingActions.current[tabKey]
      }
    },
    [setSheetRefs]
  )

  const isTabLoaded = useCallback(
    (tabKey: string) => {
      return !!tabStatus[tabKey]?.isLoaded
    },
    [tabStatus]
  )

  const scrollToCell = useCallback(
    (tabKey: string, cellAddress: CellAddress) => {
      const tabElement = sheetRefs[tabKey]
      console.log('🚀 ~ scrollToCell ~ tabElement:', tabElement?.columns.length)
      if (tabElement) {
        tabElement.scrollToCell(cellAddress)
        return true
      }

      // If the tab is not yet mounted, queue the scroll action.
      // It will be executed once the tab mounts and `registerTabRef` is called.
      if (!pendingActions.current[tabKey]) {
        pendingActions.current[tabKey] = []
      }
      pendingActions.current[tabKey].push((element) => element.scrollToCell(cellAddress))

      // console.log(`Tab ${tabKey} is not mounted yet. Scroll request has been queued.`)
      return true // Always return true as the action is queued.
    },
    [sheetRefs]
  )

  const refreshTab = useCallback(
    (tabKey: string, placement?: 'right' | 'bottom') => {
      console.log('🚀 ~ refreshTab ~ tabKey:Boolean', tabKey, activeSheetId)
      if (!isTabLoaded(tabKey) && activeSheetId !== tabKey) {
        console.warn(`Tab ${tabKey} 未加载，忽略刷新请求`)
        return false
      }
      setTabVersions((prev) => ({
        ...prev,
        [tabKey]: (prev[tabKey] || 0) + 1,
      }))
      if (placement) {
        if (placement === 'right') {
          pollAndScrollOnValueChange({
            tabKey,
            getValue: (instance) => instance.columns.length,
            onSuccess: (currentValue, initialValue, instance) => {
              // Select the first row of the new columns
              instance.selectCells([
                {
                  start: { row: START_POSITION, col: initialValue + 1 },
                  end: { row: END_POSITION, col: currentValue },
                },
              ])
              scrollToCell(tabKey, { row: START_POSITION, col: END_POSITION })
            },
            onTimeout: () => {
              scrollToCell(tabKey, { row: START_POSITION, col: END_POSITION })
            },
          })
        } else if (placement === 'bottom') {
          pollAndScrollOnValueChange({
            tabKey,
            getValue: (instance) => instance.records.length,
            onSuccess: (currentValue, initialValue, instance) => {
              instance.selectCells([
                {
                  start: { row: initialValue + 1, col: START_POSITION },
                  end: { row: currentValue, col: START_POSITION },
                },
              ])
              scrollToCell(tabKey, { row: currentValue, col: START_POSITION })
            },
            onTimeout: () => {
              scrollToCell(tabKey, { row: END_POSITION, col: START_POSITION })
            },
          })
        }
      }
      return true
    },
    [isTabLoaded, scrollToCell, pollAndScrollOnValueChange, activeSheetId]
  )

  const addDataToCurrentSheet = useCallback(
    (placement: 'bottom' | 'right') => (newSheetInfos) => {
      if (!newSheetInfos || newSheetInfos.length === 0) return

      const newSheetIds = newSheetInfos.map((res) => res.sheetId)
      const currentSheetIds = sheetInfos?.map((res) => res.sheetId)

      const isAllExisting = newSheetIds.every((id) => currentSheetIds?.includes(id))
      if (!isAllExisting) {
        updateSheetInfos?.(newSheetInfos)
      } else {
        // All IDs exist; check if any name/total changed and propagate updates
        const needsUpdate = newSheetInfos.some((incoming) => {
          const existing = sheetInfos.find((s) => s.sheetId === incoming.sheetId)
          return existing && (existing.sheetName !== incoming.sheetName || existing.total !== incoming.total)
        })
        if (needsUpdate) updateSheetInfos?.(newSheetInfos)
        else setActiveSheetId(newSheetInfos[0].sheetId.toString())
      }

      newSheetInfos.forEach((item) => {
        refreshTab(item.sheetId.toString(), placement)
      })
      dispatch(fetchPoints())
    },
    [refreshTab, setActiveSheetId, sheetInfos, updateSheetInfos]
  )

  const deleteSheet = useCallback(
    async (sheetId: string) => {
      if (!sheetId) return
      const idNum = Number(sheetId)
      if (Number.isNaN(idNum)) return

      if (!sheetInfos || sheetInfos.length === 0) return
      // 不允许删除最后一个
      if (sheetInfos.length <= 1) {
        console.warn('Cannot delete the last sheet.')
        return
      }

      // 取消该 sheet 的所有请求
      cancelAllRequests(sheetId)

      // 调后端删除接口
      const deleteApi = createWFCSuperlistRequestFcs('superlist/excel/deleteSheet')
      await deleteApi({ sheetId: idNum })

      // 计算新列表并迁移激活态
      const removedIndex = sheetInfos.findIndex((s) => s.sheetId === idNum)
      const nextSheets = sheetInfos.filter((s) => s.sheetId !== idNum)

      if (activeSheetId === sheetId) {
        const neighbor = removedIndex > 0 ? sheetInfos[removedIndex - 1] : nextSheets[0]
        setActiveSheetId(neighbor ? neighbor.sheetId.toString() : '')
      }

      // 清理本地引用与注册项
      setSheetRefs((prev) => {
        const next = { ...prev }
        delete next[sheetId]
        return next
      })
      setSearchInstances((prev) => ({ ...prev, [sheetId]: null }))
      registerClearFn(sheetId, null)

      // 覆盖更新表结构（需要包含 sheetIndex 字段）
      const nextSheetsWithIndex: SheetInfoWithIndex[] = nextSheets.map((s, index) => ({
        ...s,
        sheetIndex: index,
      }))
      updateTableInfo({ sheetInfos: nextSheetsWithIndex })
    },
    [
      sheetInfos,
      activeSheetId,
      setActiveSheetId,
      updateTableInfo,
      cancelAllRequests,
      setSheetRefs,
      setSearchInstances,
      registerClearFn,
    ]
  )

  const value = {
    activeSheetId,
    setActiveSheetId,
    sheetRefs,
    registerTabRef,
    scrollToCell,
    refreshTab,
    isTabLoaded,
    tabVersions,
    registerClearFn,
    cancelAllRequests,
    searchInstances,
    registerSearchInstance,
    addDataToCurrentSheet,
    deleteSheet,
  }

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
}
