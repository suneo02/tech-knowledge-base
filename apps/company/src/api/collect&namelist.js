import axios from './index'

// 通过公司id单个删除收藏
export const deleteByCorpId = (data) => {
  return axios.request({
    url: '/api/portal/usercollect/deleteByCorpId',
    method: 'post',
    data,
  })
}

// 通过收藏id单个or批量删除收藏
export const deleteById = (data) => {
  return axios.request({
    url: '/api/portal/usercollect/deleteById',
    method: 'post',
    data,
  })
}

// 查询收藏
export const collectQuery = (data) => {
  return axios.request({
    url: '/api/search/suggest/userCollect/list',
    method: 'post',
    data,
  })
}

// 订阅名单更新通知
export const namelistAddOld = (data) => {
  return axios.request({
    url: '/api/portal/web/namelist/add',
    method: 'post',
    data: { ...data, cmdType: 'addSubscribe' },
    cmd: 'getcrossfilterquery',
  })
}

// // 订阅名单删除
// export const namelistDelete = data => {
//   return axios.request({
//     url: "/api/portal/web/namelist/delete",
//     method: "post",
//     data: {...data, cmdType: 'delSubscribe'},
//     cmd: 'getcrossfilterquery',
//   })
// }

// // 订阅名单名称修改
// export const namelistEdit = data => {
//   return axios.request({
//     url: "/api/portal/web/namelist/editName",
//     method: "post",
//     data: {...data, cmdType: 'updateSubscribeName'},
//     cmd: 'getcrossfilterquery',
//   })
// }

// 订阅绑定邮箱
export const namelistBind = (data) => {
  return axios.request({
    url: '/api/portal/web/namelist/email/binding',
    method: 'post',
    data: { ...data, cmdType: 'openSubscribe' },
    cmd: 'getcrossfilterquery',
  })
}

// 最近看过保存
export const seensave = (data) => {
  return axios.request({
    url: '/api/portal/web/recently/seen/save',
    method: 'post',
    data,
  })
}

// 订阅名单-刷新查询总量
export const updateSearchAmount = (data) => {
  return axios.request({
    url: '/api/portal/web/namelist/updateSearchAmount',
    method: 'post',
    data,
  })
}

// 订阅名单-根据订阅id查询订阅模板信息
export const getConditionBySid = (id) => {
  return axios.request({
    url: '/api/portal/web/namelist/getFromId?id=' + id,
    method: 'get',
  })
}

// 添加订阅
export const namelistAdd = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'operation/insert/addsubcorpcriterion',
    //   formType: 'payload',
  })
}

// 修改/编辑订阅
export const namelistEdit = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'operation/update/updatesubcorpcriterion',
  })
}

// 删除订阅
export const namelistDelete = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'operation/delete/deletesubcorpcriterion',
  })
}
