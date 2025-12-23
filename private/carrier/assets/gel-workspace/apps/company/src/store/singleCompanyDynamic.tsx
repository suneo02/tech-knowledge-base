/** @format */

import { getCorpHeaderInfo } from '@/api/companyApi'
import { getMyCorpEventListNew } from '@/api/corp/event'
import { ICorpEvent } from '@/api/corp/eventTypes'
import { wftCommon } from '@/utils/utils'
import { getDynamicDetail } from 'gel-ui'
import { create } from 'zustand'

export const mapDynamicDetail = getDynamicDetail

// 格式化动态数据，同一天同类型的数据合并到一起
const format = (arr: ICorpEvent[]) => {
  if (!Array.isArray(arr) || !arr.length) return []
  const res = []
  let tmp = [arr[0]]
  for (let i = 1; i < arr.length; i++) {
    const pre = arr[i - 1]
    const cur = arr[i]
    if (pre?.event_date === cur?.event_date && pre?.event_type === cur?.event_type) {
      tmp.push(cur)
    } else {
      res.push(tmp)
      tmp = [cur]
    }
  }
  res.push(tmp)
  return res
}

// 定义 store 的状态接口
interface DynamicState {
  isLoading: boolean
  corp: Record<string, any> // 如果有具体类型可以替换
  dynamicList: ICorpEvent[]
  rawDynamicList: ICorpEvent[]
}

// 定义 store 的操作方法接口
interface DynamicActions {
  initStore: (companycode: string, dynamicListParam?: any) => void
  getcorpbasicinfo: (companycode: string) => Promise<void>
  getDynamicList: (data: {
    companyCode: string
    category?: string
    endDate: string
    dateRange?: number
    sortAfter?: string
  }) => Promise<void>
  addDynamicList: (data: {
    companyCode: string
    category?: string
    endDate: string
    dateRange?: number
  }) => Promise<void>
}

// 合并 State 和 Actions
type DynamicStore = DynamicState & DynamicActions

export const useSingleDynamicStore = create<DynamicStore>((set, get) => ({
  // 初始状态
  isLoading: false,
  corp: {},
  dynamicList: [],
  rawDynamicList: [],

  // Actions
  initStore: () => {
    // 实现初始化逻辑
  },

  getcorpbasicinfo: async (companycode) => {
    const { Data } = await getCorpHeaderInfo(companycode)
    wftCommon.translateService(Data, (corp) => {
      set({ corp })
    })
  },

  getDynamicList: async (data) => {
    set({ isLoading: true })
    const { Data } = await getMyCorpEventListNew(data)

    Data.forEach((item) => {
      // @ts-expect-error ttt
      item.text = mapDynamicDetail(item)
      // @ts-expect-error ttt
      item.event_type_raw = item.event_type
    })

    set({ isLoading: false })

    wftCommon.zh2enAlwaysCallback(
      Data,
      (enData) => {
        const dynamicList = format(enData)
        set({ dynamicList, rawDynamicList: Data })
      },
      null,
      null,
      ['event_type', 'corp_name', 'text']
    )
  },

  addDynamicList: async (data) => {
    const oldRawData = get().rawDynamicList
    // @ts-expect-error ttt
    const sortAfter = oldRawData[oldRawData.length - 1]?.sortAfter

    const { Data } = await getMyCorpEventListNew({
      ...data,
      sortAfter,
    })

    Data.forEach((item) => {
      // @ts-expect-error ttt
      item.text = mapDynamicDetail(item)
      // @ts-expect-error ttt
      item.event_type_raw = item.event_type
    })

    wftCommon.zh2enAlwaysCallback(
      Data,
      (enData) => {
        const oldData = get().dynamicList
        const dynamicList = format(enData)
        set({
          dynamicList: [...oldData, ...dynamicList],
          rawDynamicList: [...oldRawData, ...Data],
        })

        if (Data?.length && oldData?.length && oldData.length < 7) {
          setTimeout(() => {
            get().addDynamicList(data)
          }, 0)
        }
      },
      null,
      null,
      ['event_type', 'corp_name', 'text']
    )
  },
}))
