import axios from './index'

// 地图获客预搜索
// export const autocompleteMap = data => {
//   return axios.request({
//     url: "/api/search/suggest/web/map/autocomplete",
//     method: "post",
//     data,
//   })
// }

// 我的地盘
export const territoryList = (data) => {
  return axios.request({
    url: '/api/search/map/territory/list',
    method: 'post',
    data,
  })
}

// 保存为我的地盘
export const territorySave = (data) => {
  return axios.request({
    url: '/api/search/map/territory/save',
    method: 'post',
    data,
  })
}

// 我的地盘修改名称
export const territoryUpdate = (data) => {
  return axios.request({
    url: '/api/search/map/territory/name/update',
    method: 'post',
    data,
  })
}

// 删除我的地盘
export const territoryDelete = (data) => {
  return axios.request({
    url: '/api/search/map/territory/remove',
    method: 'post',
    data,
  })
}

// 用户ip获取定位城市
export const ip2Location = () => {
  return axios.request({
    url: '/api/search/map/territory/ip2Location',
    method: 'post',
    extra: true,
  })
}
