import axios from './index'

// 查询所有筛选项
export const getFilterItem = (data) => {
  return axios.request({
    url: '/api/portal/config/filteritem/v2',
    method: 'post',
    // data,
    data: { ...data, accountId: 'visa', cmdType: 'filterItem' },
    cmd: 'getcrossfilterquery',
    formType: 'payload',
  })
}

export const getListData = (data) => {
  return axios.request({
    url: '/rankinglist/getCorpListOfLists',
    method: 'post',
    data: { ...data },
    restfulApi: true,
    noProdcutName: true,
  })
}
