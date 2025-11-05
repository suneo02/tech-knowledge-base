import axios from './index'

// 榜单名录菜单树
export const getCorpListTree = (data = {}) => {
  return axios.request({
    cmd: `detail/ranklist/getCorpListTree/01000000`,
    method: 'post',
    data,
  })
}

// 榜单名录飕飕
export const selectbykeywordV2 = (data) => {
  return axios.request({
    cmd: `search/ranklist/selectbykeywordV2`,
    method: 'post',
    data,
  })
}

// 企业名称搜索
export const selectbycompcodeV2 = (data) => {
  return axios.request({
    cmd: `search/ranklist/selectbycompcodeV2`,
    method: 'post',
    data,
  })
}

// 预搜索-搜榜单名录
export const corplistpresearch = (data) => {
  return axios.request({
    cmd: `corplistpresearch`,
    method: 'post',
    data,
  })
}

/**
 * 预搜索-企业名称
 * @param {*} data
 * @returns
 */
export const getclassifycompanynew = (data) => {
  return axios.request({
    cmd: `getclassifycompanynew`,
    method: 'post',
    data,
  })
}
