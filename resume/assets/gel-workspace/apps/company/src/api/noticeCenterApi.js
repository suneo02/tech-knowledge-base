import axios from "./index";

// 消息列表，一键已读
export const setAllStatus = data => {
  return axios.request({
    url: "/api/portal/notice/center/all/read",
    method: "post",
    data,
  })
}

// 消息中心页面红点状态,新消息个数
export const getNewCount = data => {
  return axios.request({
    url: "/api/portal/notice/center/new/count",
    method: "post",
    data,
  })
}

// 分页列表
export const getNoticeList = data => {
  return axios.request({
    url: "/api/portal/notice/center/page",
    method: "post",
    data,
  })
}

// 查看，列表查看单条消息时调用
export const setStatus = data => {
  return axios.request({
    url: "/api/portal/notice/center/read",
    method: "post",
    data,
  })
}
