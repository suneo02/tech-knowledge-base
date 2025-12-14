import { useCallback } from 'react'
import { TabsProps } from 'antd/lib'
import { ContainerRefreshParams } from '../components/VisTableContainer'
import { saveActiveSheet } from '../utils/localStorage'
import { useChatRoomSuperContext } from '@/contexts/ChatRoom/super'

interface RefreshOptions {
  sheets?: number[]
  forceRerender?: boolean
}

interface RefreshManager {
  refresh: (options?: RefreshOptions) => Promise<void>
  refreshSheet: (sheetId: number) => Promise<void>
  refreshAll: () => Promise<void>
  forceRerenderSheet: (sheetId: string) => void
}

interface UseRefreshManagerProps {
  tableId: string
  conversationId: string
  list: TabsProps['items']
  setList: React.Dispatch<React.SetStateAction<TabsProps['items']>>
  setActiveKey: React.Dispatch<React.SetStateAction<string>>
  activeKey: string // 添加当前活跃的 sheet key
  containerRefs: React.MutableRefObject<Record<string, { refresh: (params?: ContainerRefreshParams) => void }>>
  getTableInfo: (tableId: string, conversationId: string) => Promise<void>
  createContainerComponent: (sheetId: number) => React.ReactElement
}

export const useRefreshManager = ({
  tableId,
  conversationId,
  list,
  setList,
  setActiveKey,
  activeKey,
  containerRefs,
  getTableInfo,
  createContainerComponent,
}: UseRefreshManagerProps): RefreshManager => {
  const { visTableRef } = useChatRoomSuperContext()
  // 检查指定的 sheets 是否都在当前 list 中
  const checkSheetsExist = useCallback(
    (sheets: number[]) => {
      const currentSheetIds = (list || []).map((item) => Number(item.key))
      // console.log('🚀 ~ checkSheetsExist ~ currentSheetIds:', currentSheetIds, sheets)
      return sheets.every((sheetId) => currentSheetIds.includes(sheetId))
    },
    [list]
  )

  // 切换到指定的 Sheet
  const switchToSheet = useCallback(
    (sheetId: string) => {
      setActiveKey(sheetId)
      saveActiveSheet(tableId, sheetId)
    },
    [tableId, setActiveKey]
  )

  // 调用容器组件的刷新方法
  const refreshContainer = useCallback(
    (sheetId: number) => {
      const containerRef = containerRefs.current[String(sheetId)]
      if (containerRef && typeof containerRef.refresh === 'function') {
        containerRef.refresh({ sheets: [sheetId] })
      }
    },
    [containerRefs]
  )

  // 强制重渲染指定的 Sheet
  const forceRerenderSheet = useCallback(
    (sheetId: string) => {
      const RERENDER_DELAY = 100 // 魔法数字统一管理

      // 设置临时 key 强制组件刷新
      setList((prevList) => {
        if (!prevList) return prevList
        return prevList.map((item) => {
          if (item.key === sheetId) {
            return {
              ...item,
              key: `${item.key}-${Date.now()}`, // 临时更新 key 触发重渲染
              children: createContainerComponent(Number(sheetId)),
            }
          }
          return item
        })
      })

      // 恢复正确的 key
      setTimeout(() => {
        setList((prevList) => {
          if (!prevList) return prevList
          return prevList.map((item) => {
            if (item.key.startsWith(`${sheetId}-`)) {
              return {
                ...item,
                key: sheetId,
              }
            }
            return item
          })
        })
      }, RERENDER_DELAY)
    },
    [setList, createContainerComponent]
  )

  // 刷新指定的 sheets
  const refreshSheets = useCallback(
    async (sheets: number[]) => {
      // console.log('🚀 ~ refreshSheets ~ checkSheetsExist(sheets):', checkSheetsExist(sheets))
      if (!checkSheetsExist(sheets)) {
        // 如果有 sheet 不存在，需要重新获取表格信息
        await getTableInfo(tableId, conversationId)
        switchToSheet(String(sheets[0]))
        return
      }
      // console.log('🚀 ~ refreshSheets ~ activeKey:', activeKey, String(sheets[0]))
      if (activeKey === String(sheets[0])) {
        // @ts-expect-error ttt
        visTableRef?.current?.refresh({ position: 'right' })
        return
      }

      const firstSheetId = String(sheets[0])
      const isCurrentSheetFirst = activeKey === firstSheetId

      // 如果第一个要刷新的 sheet 就是当前活跃的 sheet
      if (isCurrentSheetFirst) {
        // console.log('🚀 ~ refreshSheets ~ 刷新当前活跃的 sheet:', firstSheetId)
        // 直接刷新所有指定的 sheets，不需要切换
        sheets.forEach((sheetId) => {
          refreshContainer(sheetId)
          forceRerenderSheet(String(sheetId))
        })
      } else {
        // console.log('🚀 ~ refreshSheets ~ 切换到第一个 sheet:', firstSheetId)
        // 先切换到第一个 sheet
        switchToSheet(firstSheetId)

        // 然后刷新所有指定的 sheets
        sheets.forEach((sheetId) => {
          refreshContainer(sheetId)
          forceRerenderSheet(String(sheetId))
        })
      }
    },
    [
      activeKey,
      checkSheetsExist,
      getTableInfo,
      tableId,
      conversationId,
      switchToSheet,
      refreshContainer,
      forceRerenderSheet,
      visTableRef.current,
    ]
  )

  // 主刷新方法
  const refresh = useCallback(
    async (options?: RefreshOptions) => {
      // console.log('🚀 ~ RefreshManager.refresh ~ options:', options)

      if (options?.sheets && options.sheets.length > 0) {
        await refreshSheets(options.sheets)
      } else {
        // 刷新所有 sheets
        await getTableInfo(tableId, conversationId)
      }
    },
    [refreshSheets, getTableInfo, tableId, conversationId]
  )

  // 刷新单个 Sheet
  const refreshSheet = useCallback(
    async (sheetId: number) => {
      const sheetIdStr = String(sheetId)
      const sheetExists = list?.some((item) => item.key === sheetIdStr)

      if (sheetExists) {
        const isCurrentSheet = activeKey === sheetIdStr

        if (isCurrentSheet) {
          // console.log('🚀 ~ refreshSheet ~ 刷新当前活跃的 sheet:', sheetIdStr)
          // 如果是当前活跃的 sheet，直接刷新不切换
          refreshContainer(sheetId)
          forceRerenderSheet(sheetIdStr)
        } else {
          // console.log('🚀 ~ refreshSheet ~ 切换到指定 sheet:', sheetIdStr)
          // 如果不是当前活跃的 sheet，先切换再刷新
          switchToSheet(sheetIdStr)
          refreshContainer(sheetId)
          forceRerenderSheet(sheetIdStr)
        }
      } else {
        // Sheet 不存在，重新获取表格信息后切换
        await getTableInfo(tableId, conversationId)
        switchToSheet(sheetIdStr)
      }
    },
    [activeKey, list, switchToSheet, refreshContainer, forceRerenderSheet, getTableInfo, tableId, conversationId]
  )

  // 刷新所有 sheets
  const refreshAll = useCallback(async () => {
    await getTableInfo(tableId, conversationId)
  }, [getTableInfo, tableId, conversationId])

  return {
    refresh,
    refreshSheet,
    refreshAll,
    forceRerenderSheet,
  }
}
