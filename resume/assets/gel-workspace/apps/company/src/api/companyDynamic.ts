import axios from './index'

// 获取收藏分组及统计数字
export const getcustomercountgroupnew = () => {
  return axios.request({
    method: 'post',
    cmd: 'operation/get/getcustomercountgroupnew',
    data: {
      __primaryKey: '',
    },
  })
}

//收藏列表筛选
export const searchcollectlist = (data) => {
  if (data.keyWord) {
    return axios.request({
      method: 'post',
      cmd: 'operation/query/searchcollectlist',
      data,
    })
  } else {
    return axios.request({
      method: 'post',
      cmd: 'operation/query/getcustomerlist',
      data,
    })
  }
}

//添加收藏分组
export const addCustomerBatch = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/insert/addCustomerBatch',
    data,
  })
}

//修改收藏组
export const updatecustomergroup = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/insert/updatecustomergroup',
    data,
  })
}

//删除收藏组
export const deletecustomergroups = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/delete/deletecustomergroups',
    data,
  })
}

//移动收藏（含批量）
export const movecollectionentity = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/update/movecollectionentity',
    data,
  })
}

//复制收藏（含批量）
export const copycollectionentity = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/insert/copycollectionentity',
    data,
  })
}

// 取消收藏

export const DeleteCustomer = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'DeleteCustomer',
    data,
  })
}

// 批量添加收藏

export const addtomycustomer = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'addtomycustomer',
    data,
  })
}
//清空收藏组
export const cleancollectiongroup = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/delete/cleancollectiongroup',
    data,
  })
}

//自选股分组
export const getusersector = (data = {}) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/query/getusersector',
    data,
  })
}

// 获取自选股分组详情
export const getsectorstockinfobysectorid = (data = {}) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/query/getsectorstockinfobysectorid',
    data,
  })
}

//添加自选股
export const addsectorstock = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/add/addsectorstock',
    data,
  })
}

//批量匹配（批量导入，先匹配，在调用批量添加收藏接口）
export const batchquerycorp = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/query/batchquerycorp',
    data,
  })
}

//获取企业动态
export const getcorpeventlist = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/query/getcorpeventlist',
    data,
  })
}

// 搜索列表获取对应企业是否收藏标志
export const getcorpiscollect = (data) => {
  return axios.request({
    method: 'post',
    cmd: 'operation/query/IsCollect',
    data,
  })
}
