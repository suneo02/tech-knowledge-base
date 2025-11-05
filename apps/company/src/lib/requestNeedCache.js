import * as configApi from '../api/configApi'
import store from '../store/store'
import * as ConfigActions from '../actions/config'

// 数据缓存在redux中，不直接从这里返回数据
// 这里只监听promise状态

let config = null
const dispatch = store.dispatch

// 查询所有筛选项
export const getFilterItem = () => {
  config = store.getState().config
  return config.filters.length === 0
    ? configApi.getFilterItem().then((res) => {
        dispatch(ConfigActions.getFilterItem(res))
        return res.data
      })
    : new Promise((resolve, reject) => {
        resolve(config.filters)
      })
}

// 查询地区信息
export const getRegions = () => {
  config = store.getState().config
  return config.regions.length === 0
    ? configApi.getRegions().then((res) => {
        dispatch(ConfigActions.getRegions(res))
        return res.data
      })
    : new Promise((resolve, reject) => {
        resolve(config.regions)
      })
}

// 查询行业信息
export const getIndustries = () => {
  config = store.getState().config
  return config.industries.length === 0
    ? configApi.getIndustries().then((res) => {
        dispatch(ConfigActions.getIndustries(res))
        return res.data
      })
    : new Promise((resolve, reject) => {
        resolve(config.industries)
      })
}
