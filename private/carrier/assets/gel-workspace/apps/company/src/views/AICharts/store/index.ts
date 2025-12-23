/** @format */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { AIGRAPH_EXCEL_SHEET_KEYS, AIGraphExcelSheetKey, AIGraphFetchingType, AIGraphRightTabKey } from '../types'
import dayjs from 'dayjs'
import { getAiGraphChatInfo } from '@/api/ai-graph'
import { InitialMsgList, ROBOT_THINKING_MESSAGE_ID } from '../comp/AiChat/constant'

export interface AIChartsStoreState {
  historyPanelShow: boolean
  setHistoryPanelShow: (bol: boolean) => void

  historyChatList: any[] | null
  addHistoryChatList: (items: any[]) => void
  updateChatTitle: (chatId: string, title: string) => void
  deleteChatByChatId: (chatId: string) => void
  handleRefreshHistoryChatListAfterChatResponse: (chatId: string, version?: number) => Promise<void>

  activeChatId: string
  setActiveChatId: (chatId: string) => void

  chatMessageList: any[]
  setChatMessageList: (chatMessageList: any[]) => void
  updateChatMessageThumbnail: (messageId: string, thumbnail: string) => void
  replaceLastChatMessage: (newItem: any) => void
  addChatMessageItems: (items: any[]) => void
  finishChatMessageSummaryStatus: () => void
  handleUpdateChatMessageAfterAiSummaryResponse: (activeChatId: string, content: string, itemId: string) => void

  currentVersion: number
  setCurrentVersion: (version: number) => void

  totalVersionCount: number
  setTotalVersionCount: (version: number) => void

  fetchingStatus: { type?: AIGraphFetchingType; value: boolean }
  setFetchingStatus: (val: { type?: AIGraphFetchingType; value: boolean }) => void

  resetAiChatStatus: () => void

  aiGraphRightActiveTabKey: AIGraphRightTabKey
  setAiGraphRightActiveTabKey: (key: AIGraphRightTabKey) => void

  editMode: boolean
  setEditMode: (editMode: boolean) => void
  reverseEditMode: () => void

  chartDataMap: any
  handleUpdateChartDataMap: (chatId: string, version: number, data: any) => void
  getCurrentChartData: () => any

  changedTableValueMap: Record<string, any>
  setChangedTableValueMap: (val: Record<string, any>) => void
  addChangedTableValue: (rowId: string, value: any) => void
  deleteTempChangedTableValueByRowId: (rowId: string) => void
  recordDeletedChangedTableValue: (rowId: string, rowIndex: number, sheetType: AIGraphExcelSheetKey) => void
  recordUpdatedChangedTableValue: (
    rowId: string,
    rowIndex: number,
    sheetType: AIGraphExcelSheetKey,
    columnId: string,
    columnValue: string
  ) => void
}

export const useAIChartsStore = create(
  immer<AIChartsStoreState>((set, get) => ({
    historyPanelShow: false,
    historyChatList: null,
    activeChatId: '',

    chatMessageList: [], // 对话列表
    currentVersion: 0,
    totalVersionCount: 0,

    fetchingStatus: { type: 'user', value: false },

    aiGraphRightActiveTabKey: 'graph',
    editMode: false,
    chartDataMap: {}, // 生成的图谱数据 {chatId: [v1ChartData, v2ChartData]}

    changedTableValueMap: {}, // 数据表格编辑保存的变更数据信息

    setHistoryPanelShow: (bol: boolean) => {
      set({ historyPanelShow: bol })
    },

    setActiveChatId: (chatId: string) => {
      set({ activeChatId: chatId })
    },
    setFetchingStatus: (fetchingStatus) => {
      set({ fetchingStatus })
    },
    setCurrentVersion: (currentVersion: number) => {
      return set({ currentVersion })
    },
    setTotalVersionCount: (totalVersionCount: number) => {
      set({ totalVersionCount })
    },
    setAiGraphRightActiveTabKey: (activeTabKey: AIGraphRightTabKey) => {
      set({ aiGraphRightActiveTabKey: activeTabKey })
    },
    setEditMode: (bol: boolean) => {
      set({ editMode: bol })
    },
    reverseEditMode: () => {
      set((state) => {
        state.editMode = !state.editMode
      })
    },

    resetAiChatStatus: () => {
      get().setActiveChatId('')
      get().setCurrentVersion(0)
      get().setTotalVersionCount(0)

      get().setChatMessageList(InitialMsgList)
      get().setAiGraphRightActiveTabKey(AIGRAPH_EXCEL_SHEET_KEYS.GRAPH)
    },

    setChatMessageList: (chatMessageList: any[]) => {
      set({
        chatMessageList,
      })
    },
    updateChatMessageThumbnail: (messageId, thumbnail) =>
      set((state) => {
        const index = state.chatMessageList.findIndex((item) => item.id === messageId)
        if (index !== -1) {
          state.chatMessageList[index].thumbnail = thumbnail // 直接修改
        }
      }),
    setChangedTableValueMap: (changedTableValueMap: any) => {
      set({
        changedTableValueMap,
      })
    },
    addChangedTableValue: (rowId: string, value: any) => {
      set((state) => {
        state.changedTableValueMap[rowId] = value
      })
    },
    deleteTempChangedTableValueByRowId: (rowId: string) => {
      set((state) => {
        delete state.changedTableValueMap[rowId]
      })
    },
    recordDeletedChangedTableValue: (rowId: string, rowIndex: number, sheetType: AIGraphExcelSheetKey) => {
      set((state) => {
        state.changedTableValueMap[rowId] = {
          ...(state.changedTableValueMap[rowId] || {}),
          action: 'delete',
          rowIndex,
          sheetType,
          rowId,
        }
      })
    },
    recordUpdatedChangedTableValue: (
      rowId: string,
      rowIndex: number,
      sheetType: AIGraphExcelSheetKey,
      columnId: string,
      columnValue: string
    ) => {
      set((state) => {
        const prevAction = state.changedTableValueMap[rowId]?.action
        state.changedTableValueMap[rowId] = {
          ...(state.changedTableValueMap[rowId] || {}),
          [columnId]: columnValue,
          action: prevAction === 'add' ? 'add' : 'update',
          rowIndex,
          sheetType,
        }
      })
    },
    replaceLastChatMessage: (newItem: any) =>
      set((state) => {
        const lastIndex = state.chatMessageList.length - 1
        if (lastIndex >= 0) {
          state.chatMessageList[lastIndex] = newItem
        }
      }),

    addChatMessageItems: (items) =>
      set((state) => {
        state.chatMessageList.push(...items)
      }),

    finishChatMessageSummaryStatus: () =>
      set((state) => {
        const lastIndex = state.chatMessageList.length - 1
        const lastItem = state.chatMessageList[lastIndex]
        lastItem['summarizing'] = false
      }),

    handleUpdateChatMessageAfterAiSummaryResponse: (activeChatId: string, content: string, itemId: string) => {
      set((state) => {
        const newChatItem = {
          activeChatId,
          role: 2, // 假设2代表机器人
          content,
          id: itemId,
          questionSource: 'summary',
          summarizing: true,
        }

        const lastIndex = state.chatMessageList.length - 1
        const lastItem = state.chatMessageList[lastIndex]

        if (lastItem.id === ROBOT_THINKING_MESSAGE_ID) {
          // 替换思考消息
          state.chatMessageList[lastIndex] = newChatItem
        } else {
          // 更新最后一条消息
          lastItem.content += content
        }
      })
    },

    addHistoryChatList: (items: any[]) => {
      set((state) => {
        // 第一次请求数据
        if(!state.historyChatList){
          state.historyChatList = []
        }
        state.historyChatList.push(...items)
      })
    },
    deleteChatByChatId: (chatId: string) => {
      set((state) => {
        state.historyChatList = state.historyChatList.filter((item) => item.chatId !== chatId)
      })
    },
    updateChatTitle: (chatId: string, title: string) => {
      set((state) => {
        const findIndex = state.historyChatList.findIndex((c) => c.chatId === chatId)
        if (findIndex !== -1) {
          state.historyChatList[findIndex].title = title
        }
      })
    },
    // 对话响应后，更新历史消息列表标题
    handleRefreshHistoryChatListAfterChatResponse: async (chatId: string, version?: number) => {
      const currentChatInfo = get().historyChatList.find((chat) => chat.chatId === chatId)
      // 没有生成版本成功，且是新对话
      if (!version && !currentChatInfo) {
        set((state) => {
          state.historyChatList.unshift({
            chatId,
            title: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            updatedAt: new Date(),
          })
        })
        return
      }
      // 第一次生成版本成功（标题由第一个生成版本决定）
      if (version === 1) {
        try {
          const res = await getAiGraphChatInfo(chatId)
          // 第一次对话
          if (!currentChatInfo) {
            set((state) => {
              state.historyChatList.unshift(res.data)
            })
            // 之前生成过对话，但是没有版本数据，当前标题是时间，现在需要更新
          } else {
            const updateIndex = get().historyChatList.find((c) => c.chatId === chatId)
            set((state) => {
              state.historyChatList[updateIndex] = res.data
            })
          }
        } catch (err) {}
      }
    },
    handleUpdateChatMessageList: () => {},
    handleUpdateChartDataMap: (chatId: string, version: number, data: any) => {
      set((state) => {
        if (!state.chartDataMap[chatId]) {
          state.chartDataMap[chatId] = []
        }
        state.chartDataMap[chatId][version - 1] = data
      })
    },
    // 当前图谱数据
    getCurrentChartData: () => {
      const state = get()
      const { activeChatId, chartDataMap, currentVersion } = state
      if (!activeChatId || Object.keys(chartDataMap).length === 0 || !currentVersion) {
        return null
      }
      return chartDataMap[activeChatId]?.[currentVersion - 1]
    },

    // 生成图谱的几种方式：
    handleSendChatFromHome: () => {}, // 0.从入口页发送消息跳转过来生成图谱
    handleSendChat: () => {}, // 1.发送消息(文本+文件)生成图谱
    handleModifyChartSheetData: () => {}, // 2.修改数据表格生成图谱
    handleGenerateChartByMarkdown: () => {}, // 3.markdown直接生成图谱
    handleGenerateChartByExcel: () => {}, // 4.excel直接生成图谱
    handleGenerateChartByOtherAgent: () => {}, // 5.供应链探查等其它方式生成图谱
    // 6.查看历史记录消息数据生成图谱
  }))
)
