// 获取地盘数据
import { territoryList as getMapTerritory } from '@/api/mapApi.ts'
import global from '@/lib/global.ts'

export const getTerritoryList = async (set) => {
  const res = await getMapTerritory({
    pageNum: 1,
    pageSize: 50,
  })
  if (res.code === global.SUCCESS) {
    set({
      territoryList: res.data.list,
    })
    return res.data.list
  }
}
