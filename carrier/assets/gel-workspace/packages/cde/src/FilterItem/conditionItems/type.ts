import { UseFilterOperationsReturn } from '@/FilterList'
import { CDEFilterItemFront, CDEFilterItemUser } from '@/types'
import { ApiResponseForWFC, CDEFilterCategory, getCorpListPresearchResponse } from 'gel-api'
import { FC } from 'react'

export type CDEFilterItemApi = {
  getBFSD?: (inputVal: string) => Promise<any>
  getBFYQ?: (inputVal: string) => Promise<any>
  getCorpListPresearch?: (inputVal: string) => Promise<ApiResponseForWFC<getCorpListPresearchResponse[]> | undefined>
}
export type CDEFilterCompType = FC<
  {
    item: CDEFilterItemFront
    parent: CDEFilterCategory | CDEFilterItemFront // 有的有 extra config
    filter: CDEFilterItemUser | undefined
  } & Pick<UseFilterOperationsReturn, 'updateFilter' | 'getFilterById' | 'removeFilter'> &
    CDEFilterItemApi
>
