import axios from './index'

// 招投标查询所有筛选项
export const getBiddingFilterItems = () => {
  return axios.request({
    url: '/api/portal/config/web/bidding/filterItems',
    method: 'post',
  })
}

// 招投标查询
export const biddingSearch = (data) => {
  return axios.request({
    url: '/api/search/bidding/filter/search',
    method: 'post',
    data,
  })
}

// 招投标推荐
export const biddingSuggest = (data) => {
  return axios.request({
    url: '/api/search/bidding/suggest',
    method: 'post',
    data,
  })
}

// 招投标公告详情
export const biddingDetail = (data) => {
  return axios.request({
    url: '/api/search/bidding/detail/v2',
    method: 'post',
    data,
  })
}

// 招投标公告详情页-参与主体
export const detailSub = (data) => {
  return axios.request({
    url: '/api/search/bidding/detailSub/v2',
    method: 'post',
    data,
  })
}

// 招投标公告详情页-关联主体
export const detailSubRel = (data) => {
  return axios.request({
    url: '/api/search/bidding/detailSubRel/v2',
    method: 'post',
    data,
  })
}

// 招投标历史记录
export const biddingHistory = (data) => {
  return axios.request({
    url: '/api/search/bidding/history',
    method: 'post',
    data,
  })
}

// 招投标新增历史记录
export const addHistory = (data) => {
  return axios.request({
    url: '/api/search/bidding/history/add',
    method: 'post',
    data,
  })
}

// 清空招投标历史
export const biddingDeleteAll = (data) => {
  return axios.request({
    url: '/api/search/bidding/history/deleteAll',
    method: 'post',
    data,
  })
}

// 删除单条招投标历史
export const biddingDeleteOne = (data) => {
  return axios.request({
    url: '/api/search/bidding/history/deleteOne',
    method: 'post',
    data,
  })
}

// 获取公告正文
export const getBiddingText = (content, sessionid) => {
  return axios.request({
    url: `/superlist/biddingText/6501/${content}`,
    method: 'get',
    extra: true,
    noProdcutName: true,
  })
}

// 获取公告附件
export const getBiddigAttachment = (data) => {
  return axios.request({
    url: '/api/search/bidding/detail/attachment/v2',
    method: 'post',
    data,
  })
}

// 获取公告正文
export const getBiddigProcess = (data) => {
  return axios.request({
    url: '/api/search/bidding/detail/process/v2',
    method: 'post',
    data,
  })
}
