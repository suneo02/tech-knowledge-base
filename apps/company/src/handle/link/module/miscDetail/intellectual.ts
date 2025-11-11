/** 知识产权 */

import { getPrefixUrl, handleAppendUrlPath } from '../../handle'

export const IntellectualTypeEnum = {
  BRAND: 'brand', // 商标
  PATENT: 'patent', // 专利 PatentTypeEnum
  STANDARD_INFO_DETAIL: 'standardInfoDetail', // 标准信息
  BID_DETAIL: 'biddingDetail', // 招投标
  todo: 'todo', // 作品著作权
  todo1: 'todo1', // 软件著作权
}

export const getIntellectualBySubModule = ({ subModule, id, params, standardLevelCode, type, env }) => {
  const baseUrl = new URL(
    getPrefixUrl({
      envParam: env,
    })
  )
  baseUrl.pathname = handleAppendUrlPath(baseUrl.pathname)
  switch (subModule) {
    case IntellectualTypeEnum.PATENT:
      if (!id) {
        return null
      }
      baseUrl.hash = '#/patentDetail'
      baseUrl.search = new URLSearchParams({
        detailId: id,
        ...params,
      }).toString()
      break
    case IntellectualTypeEnum.BRAND:
      if (!id) {
        return null
      }
      baseUrl.hash = '#/logoDetail'
      baseUrl.search = new URLSearchParams({
        detailid: id,
        ...params,
      }).toString()
      break
    case IntellectualTypeEnum.BID_DETAIL:
      if (!id) {
        return null
      }
      baseUrl.hash = IntellectualTypeEnum.BID_DETAIL
      baseUrl.search = new URLSearchParams({
        detailid: id,
        type: 'bid',
        ...params,
      }).toString()
      break
    case IntellectualTypeEnum.STANDARD_INFO_DETAIL:
      if (!id || !type || !standardLevelCode) {
        return null
      }
      baseUrl.hash = subModule
      baseUrl.search = new URLSearchParams({
        entityNumber: id,
        type,
        standardLevelCode,
        ...params,
      }).toString()
      break
    case IntellectualTypeEnum.todo:
    case IntellectualTypeEnum.todo1:
      return null
    default:
      return null
  }

  return baseUrl.toString()
}
