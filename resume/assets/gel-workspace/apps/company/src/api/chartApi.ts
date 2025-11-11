import axios from './index'

export const getpersoncard = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'getpersoncard',
    data,
  })
}
export const getcorpcard = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'getcorpcard',
    data,
  })
}
export const getgraphrelationperperty = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'getgraphrelationperperty',
    data,
  })
}
export const getIpoNodeData = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'getIpoNodeData', // IPO股东核查企业列表
    data,
  })
}

// 关联方图谱
export const getIpoRelationship = (data) => {
  return axios.request({
    method: 'post',
    cmd: '/graph/company/getIPOGraph/' + data.companycode, // IPO股东核查企业列表
    data,
  })
}

// 查关系
export const getrelationpath = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'relation/getrelationpath',
    data,
  })
}

// 多对一触达
export const getrelationpathmulti = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'relation/getrelationpathmulti',
    data,
  })
}

// 查股权关系 持股路径
export const getinvestpath = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'getinvestpath',
    data,
  })
}

export const getuserinfo = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'apigetuserdetailinfo',
    data,
  })
}

export const getCompanyMap = (code, data) => {
  return axios.request({
    method: 'post',
    cmd: `graph/company/getCorpGraphV2/${code}`,
    data,
  })
}

export const getCompanyMapLists = (code, data) => {
  return axios.request({
    method: 'post',
    cmd: `graph/company/getCorpGraphNodeV2/${code}`,
    data,
  })
}
