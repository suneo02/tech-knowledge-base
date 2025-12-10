import { createWFCSuperlistRequestFcs } from '@/api'
import { useRequest } from 'ahooks'
import { GetTableInfoResponse, Sheet } from 'gel-api'
import { createContext, ReactNode, useContext, useEffect, useState, useCallback, useRef } from 'react'

export interface ISheetInfo {
  sheetId: number
  sheetName: string
  total: number
}

export interface TableContextState {
  tableInfo?: GetTableInfoResponse
  updateSheetInfos: (newSheets: ISheetInfo[]) => void
  refreshTableInfo: () => void
  updateTableInfo: (newTableInfo: Partial<GetTableInfoResponse>) => void
  sheetInfos: ISheetInfo[]
}

export const TableContext = createContext<TableContextState | undefined>(undefined)

export const useTableContext = () => {
  const context = useContext(TableContext)
  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider')
  }
  return context
}

interface TableProviderProps {
  children: ReactNode
  tableId: string
  conversationId: string
  setActiveSheetId: (sheetId: string) => void
}

export const TableProvider = ({ children, tableId, conversationId, setActiveSheetId }: TableProviderProps) => {
  const [tableInfo, setTableInfo] = useState<GetTableInfoResponse>()

  const tableIdCache = useRef(tableId)

  const getTableInfoApi = createWFCSuperlistRequestFcs('superlist/excel/getTableInfo')

  const {
    run: getTableInfo,
    loading,
    data,
  } = useRequest(getTableInfoApi, {
    manual: true,
    refreshDeps: [tableId],
  })

  const updateSheetInfos = useCallback(
    (newSheets: ISheetInfo[]) => {
      if (!newSheets || newSheets.length === 0) return

      let nextActiveSheetId: string | null = null

      setTableInfo((prevTableInfo) => {
        if (!prevTableInfo) {
          const newSheetInfos: Sheet[] = newSheets.map((sheet, index) => ({
            ...sheet,
            sheetIndex: index,
          }))

          return {
            tableName: '',
            sheetInfos: newSheetInfos,
            cdeFilter: [],
          }
        }

        const existingById = new Map(prevTableInfo.sheetInfos.map((s) => [s.sheetId, s]))
        const incomingById = new Map(newSheets.map((s) => [s.sheetId, s]))

        let hasExistingUpdates = false
        const updatedExisting: Sheet[] = prevTableInfo.sheetInfos.map((existing) => {
          const incoming = incomingById.get(existing.sheetId)
          if (!incoming) return existing
          if (incoming.sheetName !== existing.sheetName || incoming.total !== existing.total) {
            hasExistingUpdates = true
            return { ...existing, sheetName: incoming.sheetName, total: incoming.total }
          }
          return existing
        })

        const sheetsToAdd: Sheet[] = newSheets
          .filter((s) => !existingById.has(s.sheetId))
          .map((s, index) => ({ ...s, sheetIndex: updatedExisting.length + index }))

        if (sheetsToAdd.length > 0) {
          nextActiveSheetId = sheetsToAdd[0].sheetId.toString()
        }

        if (!hasExistingUpdates && sheetsToAdd.length === 0) return prevTableInfo

        return {
          ...prevTableInfo,
          sheetInfos: [...updatedExisting, ...sheetsToAdd],
        }
      })

      if (nextActiveSheetId) {
        setTimeout(() => {
          setActiveSheetId(nextActiveSheetId as string)
        }, 200)
      }
    },
    [setActiveSheetId]
  )

  useEffect(() => {
    if (tableIdCache.current === tableId) return
    tableIdCache.current = tableId
    if (tableId && conversationId) {
      getTableInfo({ tableId, conversationId })
    }
  }, [tableId, conversationId, getTableInfo])

  useEffect(() => {
    if (data?.Data) {
      setTableInfo(data.Data)
    }
  }, [data])

  const refreshTableInfo = useCallback(() => {
    getTableInfo({ tableId, conversationId })
  }, [getTableInfo, tableId, conversationId])

  const updateTableInfo = useCallback((newTableInfo: Partial<GetTableInfoResponse>) => {
    setTableInfo((prevTableInfo) => {
      if (!prevTableInfo) return prevTableInfo
      return { ...prevTableInfo, ...newTableInfo }
    })
  }, [])

  const value = {
    tableInfo,
    loading,
    sheetInfos: tableInfo?.sheetInfos || [],
    updateSheetInfos,
    refreshTableInfo,
    updateTableInfo,
  }

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>
}
