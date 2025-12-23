import { useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { AIGRAPH_EXCEL_SHEET_KEYS, AIGraphExcelSheetKey } from '../types'
import { cellConfig } from '../comp/AiChartsExcel/config'
import { formatRelation, parseConfig } from '../utils'
import { useAIChartsStore } from '../store'

function useTableData() {
  const { getCurrentChartData } = useAIChartsStore()
  const chatData = getCurrentChartData()
  const [graphConfig, setGraphConfig] = useState(parseConfig(chatData?.config, chatData?.name))
  const [graphRelations, setGraphRelations] = useState(formatRelation(chatData?.relations, chatData?.nodeInfo?.list))
  const [graphNodeList, setGraphNodeList] = useState(chatData?.nodeInfo?.list)

  useUpdateEffect(() => {
    setGraphConfig(parseConfig(chatData?.config, chatData?.name))
  }, [chatData?.config, chatData?.name])

  useUpdateEffect(() => {
    setGraphRelations(formatRelation(chatData?.relations, chatData?.nodeInfo?.list))
  }, [chatData?.relations, chatData?.nodeInfo?.list])

  useUpdateEffect(() => {
    setGraphNodeList(chatData?.nodeInfo?.list)
  }, [chatData?.nodeInfo?.list])

  function handleResetTableData(sheetKey: AIGraphExcelSheetKey) {
    if (sheetKey === AIGRAPH_EXCEL_SHEET_KEYS.BASIC) {
      setGraphConfig(parseConfig(chatData?.config, chatData?.name))
    } else if (sheetKey === AIGRAPH_EXCEL_SHEET_KEYS.RELATION) {
      setGraphRelations(formatRelation(chatData?.relations, chatData?.nodeInfo?.list))
    } else if (sheetKey === AIGRAPH_EXCEL_SHEET_KEYS.NODE) {
      setGraphNodeList(chatData?.nodeInfo?.list)
    }
  }

  // 编辑
  function handleUpdateTableCellData(sheetKey: AIGraphExcelSheetKey, rowId: string, columnId: string, value: any) {
    if (sheetKey === AIGRAPH_EXCEL_SHEET_KEYS.BASIC) {
      setGraphConfig((prevItems) => {
        const next = { ...prevItems }
        if (columnId === 'graphType') {
          const GraphTypeConfig = cellConfig['graphType']
          const option = GraphTypeConfig.options.find((o) => o.key === value)
          next['type'] = option?.type
          next['layout'] = option?.layout
        } else {
          next[columnId] = value
        }
        return next
      })
      return
    }
    if (sheetKey === AIGRAPH_EXCEL_SHEET_KEYS.NODE) {
      setGraphNodeList((prevItems) =>
        prevItems.map((item) => {
          if (item.rowId === rowId) {
            if (columnId === 'nodeName') {
              return { ...item, ['nodeName']: value }
            }
            return {
              ...item,
              properties: {
                ...item.properties,
                [columnId]: value,
              },
            }
          }
          return item
        })
      )
      return
    }

    setGraphRelations((prevItems) =>
      prevItems.map((item) => {
        return item.rowId === rowId ? { ...item, [columnId]: value } : item
      })
    )
  }

  return {
    graphConfig,
    setGraphConfig,
    graphRelations,
    setGraphRelations,
    graphNodeList,
    setGraphNodeList,
    handleResetTableData,
    handleUpdateTableCellData,
  }
}

export default useTableData
