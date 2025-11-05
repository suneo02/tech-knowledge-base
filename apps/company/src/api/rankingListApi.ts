import axios from "./index";

// 榜单名录查询历史查询
export const getSearchHistory = () => {
  return axios.request({
    url: "/api/search/billboarddirectory/history?source=0",
    method: "get",
  })
}

// 榜单名录浏览历史查询
export const getVisitHistory = () => {
  return axios.request({
    url: "/api/search/billboarddirectory/history?source=1",
    method: "get",
  })
}

// 新增榜单名录搜索历史
export const addSearchHistory = (data) => {
  return axios.request({
    url: "/api/search/billboarddirectory/history/add",
    method: "post",
    data: Object.assign({ source: 0 }, data),
  })
}

// 新增榜单名录浏览历史
export const addVisitHistory = (data) => {
  return axios.request({
    url: "/api/search/billboarddirectory/history/add",
    method: "post",
    data: Object.assign({ source: 1 }, data),
  })
}

// 榜单名录搜索历史记录删除所有
export const deleteAllSearchHistory = () => {
  return axios.request({
    url: "/api/search/billboarddirectory/history/deleteAll?source=0",
    method: "get",
  })
}

// 榜单名录浏览历史记录删除所有
export const deleteAllVisitHistory = () => {
  return axios.request({
    url: "/api/search/billboarddirectory/history/deleteAll?source=1",
    method: "get",
  })
}

// 榜单名录搜索历史记录删除单条
export const deleteOneSearchHistory = (rankId) => {
  return axios.request({
    url: "/api/search/billboarddirectory/history/deleteOne?source=0&rank=" + rankId,
    method: "get",
  })
}

// 榜单名录浏览历史记录删除单条
export const deleteOneVisitHistory = (rankId) => {
  return axios.request({
    url: "/api/search/billboarddirectory/history/deleteOne?source=1&rank=" + rankId,
    method: "get",
  })
}

// 榜单名录搜索
export const rankingListSearch = (data) => {
  return axios.request({
    url: "/api/search/billboarddirectory/search",
    method: "post",
    data: data,
  })
}

// 榜单名录-企业搜索
export const rankingListSearchCorps = (data) => {
  return axios.request({
    url: "/api/search/billboarddirectory/search/corps",
    method: "post",
    data: data,
  })
}

// 榜单名录推荐
export const rankingListSuggest = (data) => {
  // return axios.request({
  //   url: "/api/search/billboarddirectory/suggest",
  //   method: "post",
  //   data: data,
  // })
  return axios.request({
    cmd: 'corplistrecommend',
    method: 'post',
    data: data
  })
}

// 榜单名录-统计
// 统计类型 0 按地区统计 1 按行业分布 2 按上市状态 3 按企业类型 4 按注册资本(/range支持) 5按企业人员规模（/range支持）
export const rankingListStatistics = (data) => {
  if (data.type < 4) {
    return axios.request({
      url: "/api/search/billboarddirectory/statistics",
      method: "post",
      data: data,
    })
  }
  return axios.request({
    url: "/api/search/billboarddirectory/statistics/range",
    method: "post",
    data: data,
  })
}

// 获取全部榜单菜单列表
export const getRankingListType = () => {
  return axios.request({
    cmd: 'corplistsearch',
    method: "post",
    data: {
        keyword: '',
        pageno: 0,
        category: '01010100',
        pagesize: 16
    }
  })
}
