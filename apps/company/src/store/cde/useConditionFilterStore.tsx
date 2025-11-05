import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { iteratorList } from '@/store/cde/helpers/iteratorList.tsx'
import { setDefaultFilters } from '@/store/cde/helpers/setDefaultFilters.tsx'
import { getFilterConfigList } from '@/store/cde/helpers/getFilterConfigList.tsx'
import { getFilterById } from '@/store/cde/helpers/getFilterById.tsx'
import { getTerritoryList } from '@/store/cde/helpers/getTerritoryList.tsx'
import { updateFilters } from '@/store/cde/helpers/updateFilters.tsx'
import { getPreItemInfo } from '@/store/cde/helpers/getPreItemInfo.tsx'

export const useConditionFilterStore = create<any>(
  persist(
    (set, get) => ({
      filterConfigList: [],
      filters: [], // 配置项
      geoFilters: [], //地图配置项
      territoryList: [], //地盘数据
      codeMap: {},

      updateFilters: ({ filter, value, logic, confidence }) =>
        updateFilters(set, get, { filter, value, logic, confidence }),
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
