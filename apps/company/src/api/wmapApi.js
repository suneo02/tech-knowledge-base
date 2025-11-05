import axios from "./index";

// 地址搜索
export const searchplace = data => {
  return axios.request({
    url: "/wmap/api/lbs/searchplace",
    method: "post",
    data,
    extra: true,
    noProdcutName: true,
  })
}

// 逆地理编码
export const getAddressByLocation = data => {
  return axios.request({
    url: "/wmap/api/lbs/reversegeocoding",
    method: "post",
    data: {
      ...data,
      extension: "all",
    },
    extra: true,
    noProdcutName: true,
  })
}