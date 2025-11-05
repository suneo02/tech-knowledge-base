import axios from "./index";

// 获取游戏审批详情 
export const getgameapprovaldetail = (id ) => {
  return axios.request({
    cmd: `detail/company/getgameapprovaldetail/${id}`,
    method: "post",
    data: {
        detailId: id,
    },
  })
}