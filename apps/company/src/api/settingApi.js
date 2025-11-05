import axios from './index'

// 下载中心
// 名单下载文件-提交下载名单参数
export const postData = (data) => {
  return axios.request({
    url: '/api/search/download/center/namelist/postData',
    method: 'post',
    data,
    cmd: 'createcrossfilterdoctask2',
    formType: 'payload',
  })
}

// 名单下载文件-下载
export const fileDownload = (data) => {
  return axios.request({
    url: '/api/search/download/center/namelist/file/download',
    method: 'post',
    data,
    responseType: 'blob',
  })
}

// 名单下载文件分页列表
export const getFiles = (data) => {
  return axios.request({
    url: '/api/search/download/center/namelist/page',
    method: 'post',
    data,
  })
}

// 名单下载文件-重新生成
export const rebuild = (data) => {
  return axios.request({
    url: '/api/search/download/center/namelist/rebuild',
    method: 'post',
    data,
  })
}
