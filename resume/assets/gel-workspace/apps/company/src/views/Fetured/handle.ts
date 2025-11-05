import { codeNameMap } from '@/views/Fetured/nameCodeMap/codeNameMap.ts'

export const getFeaturedCompanyParam = (
  type: string,
  id: string,
  area: string,
  dateValue: string,
  includingExpired: boolean,
  qualificationStatus: string
) => {
  // 榜单用老接口
  let param: {
    includingExpired?: boolean
    id?: string
    area?: string
    type?: string
    date?: string
    corpListId?: string
    areaCode?: string
    qualificationStatus?: string
  }
  let restfulParam: {
    includingExpired?: boolean
    corpListId?: string
    areaName?: string
    rankOrList?: string
    queryType?: string
    rankListDate?: string
  }
  if (type == 'rank') {
    param = {
      id,
      area: area,
      type: 'rank',
      date: dateValue,
    }
    restfulParam = {
      corpListId: id,
      areaName: area,
      rankOrList: 'rank',
      queryType: 'listedStatus',
      rankListDate: dateValue,
    }
  } else {
    param = {
      corpListId: id,
      areaCode: area ? codeNameMap[area] : '',
    }
    if (qualificationStatus) param.qualificationStatus = qualificationStatus
  }

  // 不包含已失效
  if (!includingExpired) {
    param.includingExpired = false
    if (restfulParam) restfulParam.includingExpired = false
  }
  return { param, restfulParam }
}
