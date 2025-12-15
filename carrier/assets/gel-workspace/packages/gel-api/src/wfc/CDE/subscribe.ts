import { CDESuperQueryLogic } from '@/windSecure'

export interface CDESubscribeItem {
  id: string
  subName: string
  subPush: boolean
  subEmail?: string
  /**
   * json 字符串
   */
  superQueryLogic: string
}

export interface CDESubscribeListResponse {
  mail?: string
  records: CDESubscribeItem[]
  total: number
}
export const getCDESubscribeListPath = `operation/query/getsubcorpcriterion`

export const addCDESubscribePath = `operation/insert/addsubcorpcriterion`
export const updateCDESubscribePath = `operation/update/updatesubcorpcriterion`
export const deleteCDESubscribePath = `operation/delete/deletesubcorpcriterion`

export type CDEAddSubscribePayload = Pick<CDESubscribeItem, 'subName' | 'superQueryLogic'> & {
  /**
   * 后端整出来的恶心东西 ！！！ 出参和入参不一致
   */
  subPush: 0 | 1
  /**
   * 后端整出来的恶心东西 ！！！ 出参和入参不一致
   */
  mail?: string
}

export type CDEUpdateSubscribePayload = CDEAddSubscribePayload & Pick<CDESubscribeItem, 'id'>

export type CDEDeleteSubscribePayload = Pick<CDESubscribeItem, 'id'>

export const parseSuperQueryLogic = (superQueryLogic: string) => {
  try {
    return JSON.parse(superQueryLogic) as CDESuperQueryLogic
  } catch (error) {
    console.error(error)
    return null
  }
}
