import { getFilterById } from '@/store/cde/helpers/getFilterById.tsx'
import { getFilterConfigList } from '@/store/cde/helpers/getFilterConfigList.tsx'
import { getPreItemInfo } from '@/store/cde/helpers/getPreItemInfo.tsx'
import { getTerritoryList } from '@/store/cde/helpers/getTerritoryList.tsx'
import { iteratorList } from '@/store/cde/helpers/iteratorList.tsx'
import { setDefaultFilters } from '@/store/cde/helpers/setDefaultFilters.tsx'
import { updateFilters } from '@/store/cde/helpers/updateFilters.tsx'
import { CDEFilterItem, CDERankQueryFilterValue } from 'gel-api'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type ConditionFilterStore = {
  filterConfigList: any[]
  filters: any[]
  geoFilters: any[]
  territoryList: any[]
  codeMap: any
  subEmail: string
  updateFilters: (params: {
    filter: CDEFilterItem & { labels4see?: string[] }
    value?: string[] | undefined | CDERankQueryFilterValue[]
    logic?: any
    confidence?: any
    valueRaw?: any
  }) => void
  setFilters: (filters: any[]) => void
  setGeoFilters: (geoFilters: any[]) => void
  getFilterById: (itemId: number) => any
  getFilterConfigList: () => void
  getTerritoryList: () => void
  getPreItemInfo: (itemId: number) => any
  setDefaultFilters: (key: string) => void
  resetFilters: () => void
  getFiltersVipCount: () => number
  setSubEmail: (email: string) => void
}
export const useConditionFilterStore = create<ConditionFilterStore>()(
  persist(
    (set, get) => ({
      filterConfigList: [],
      filters: [], // 配置项
      geoFilters: [], //地图配置项
      territoryList: [], //地盘数据
      codeMap: {},

      updateFilters: ({ filter, value, logic, confidence, valueRaw }) =>
        updateFilters(set, get, { filter, value, logic, confidence, valueRaw }),
      setFilters: (filters) => set({ filters }), // 设置配置项
      setGeoFilters: (geoFilters) => set({ geoFilters }), // 设置配置项
      getFilterById: (itemId) => getFilterById(get, itemId),
      getFilterConfigList: () => getFilterConfigList(set, get),
      getTerritoryList: () => getTerritoryList(set),

      getPreItemInfo: (itemId) => getPreItemInfo(get, itemId),
      setDefaultFilters: (key) => setDefaultFilters(set, key),
      resetFilters: () => set({ filters: [], geoFilters: [] }),

      getFiltersVipCount: () => getFiltersVipCount(get),

      subEmail: '', // 订阅邮箱
      setSubEmail: (email) => set({ subEmail: email }),
    }),
    {
      name: 'useConditionFilterStore',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

// 获取filters中count数量
const getFiltersVipCount = (get) => {
  const { filterConfigList, filters } = get()
  let count = 0
  iteratorList(filterConfigList, (item) => {
    if (item.isVip && filters.findIndex((filter) => filter.itemId === item.itemId) !== -1) {
      count++
    }
  })
  return count
}
