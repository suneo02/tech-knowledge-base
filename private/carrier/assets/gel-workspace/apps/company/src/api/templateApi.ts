import axios from './index'

// 投稿到模板库
export const templateShare = (data) => {
  return axios.request({
    url: '/api/portal/web/template/share',
    method: 'post',
    data,
  })
}

// 同行推荐/模板库列表
export const getTemplateList = (data) => {
  return axios.request({
    url: '/api/portal/web/template/fellow',
    // url: "/api/portal/common/template/fellow",
    method: 'post',
    data,
  })
}

// 使用模板
export const templateQuery = (data) => {
  return axios.request({
    url: '/api/portal/web/template/apply',
    method: 'post',
    data,
  })
}

// 好用
export const templatePraise = (data) => {
  return axios.request({
    url: '/api/portal/web/template/praise',
    method: 'post',
    data,
  })
}
