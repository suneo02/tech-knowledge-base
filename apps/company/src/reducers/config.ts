// 需要缓存的低频配置数据
import * as actionTypes from '../actions/actionTypes'
import global from '../lib/global'
// import { translation } from '../locales/i18n';
import { arrayToMap } from '../lib/utils'

const initialState = {
  filters: [],
  regions: [],
  industries: [],
  areaMap: {},
  industryMap: {},
  industry2Map: {},
  industryLevelMap: {},
}

const reducer = (state = initialState, action) => {
  // @ts-expect-error
  const translation = window.intl
  switch (action.type) {
    case actionTypes.GET_FILTER_ITEM:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        let regions, industries, areaMap, industryMap, industry2Map, industryLevelMap
        action.data.data.forEach((element) => {
          // 地区行政区划数据处理
          if (element.categoryEn === 'area_code') {
            element.categoryOption.unshift({
              code: '0000',
              name: translation(51886),
              node: [],
            })
            regions = element.categoryOption
            areaMap = arrayToMap(element.categoryOption, 'code', 'name')
          }
          // 国标行业处理
          if (element.categoryEn === 'industry_code' || element.categoryEn === 'industry_gb') {
            element.categoryOption.unshift({
              code: '0000',
              name: translation(272165),
              node: [],
            })
            industries = element.categoryOption
            industryMap = arrayToMap(element.categoryOption, 'code', 'name')
            industry2Map = arrayToMap(element.categoryOption, 'name', 'code')
            industryLevelMap = arrayToMap(element.categoryOption, 'name', 'level')
          }
        })
        return {
          ...state,
          filters: action.data.data,
          regions,
          industries,
          areaMap,
          industryMap,
          industry2Map,
          industryLevelMap,
        }
      }
      break
    case actionTypes.GET_REGIONS:
      console.log(action)
      if (action.data.code === global.SUCCESS) {
        let regions, areaMap
        // 地区行政区划数据处理
        action.data.data.unshift({
          code: '0000',
          name: translation(51886),
          node: [],
        })
        regions = action.data.data
        areaMap = arrayToMap(action.data.data, 'code', 'name')
        return {
          ...state,
          regions,
          areaMap,
        }
      }
      break
    case actionTypes.GET_INDUSTRIES:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        let industries, industryMap, industry2Map, industryLevelMap
        // 地区行政区划数据处理
        action.data.data.unshift({
          code: '0000',
          name: translation(272165),
          node: [],
        })
        industries = action.data.data
        industryMap = arrayToMap(action.data.data, 'code', 'name')
        industry2Map = arrayToMap(action.data.data, 'name', 'code')
        industryLevelMap = arrayToMap(action.data.data, 'name', 'level')
        return {
          ...state,
          industries,
          industryMap,
          industry2Map,
          industryLevelMap,
        }
      }
      break
    default:
      return state
  }
  return state
}
export default reducer
