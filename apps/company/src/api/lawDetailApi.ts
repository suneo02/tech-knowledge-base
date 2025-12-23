import axios from './index'

// 获取风险详情
export const getLegalDetail = (seqId, name) => {
  return axios.request({
    method: 'post',
    cmd: 'detail/risk/getLegalDetail',
    data: {
      reportName: name,
      __primaryKey: seqId,
    },
  })
}
