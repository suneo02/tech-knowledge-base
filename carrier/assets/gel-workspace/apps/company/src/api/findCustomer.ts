import axios from './index'

// 热门问题推荐/问句举例
export const getQuestions = (lastIndex = -1) => {
  return axios.request({
    url: '/api/search/suggest/questions/v2',
    method: 'post',
    data: {
      lastIndex,
      location: '',
      pageSize: 10,
    },
  })
}

// 一句话搜索-切词转查询条件
export const speechSearch = (data) => {
  return axios.request({
    url: '/api/search/filter/speechSearch',
    method: 'post',
    data,
  })
}

// 预搜索
export const preSearch = (data) => {
  return axios.request({
    url: '/api/search/filter/preSearch',
    method: 'post',
    data: { ...data, accountId: 'visa' },
  })
}

// 查询数量
export const getTotal = (data) => {
  return axios.request({
    url: '/api/search/filter/total',
    method: 'post',
    data: { ...data, accountId: 'visa' },
  })
}

// 搜索-筛选&指标搜索
export const search = (data) => {
  return axios.request({
    url: '/api/search/filter/search',
    method: 'post',
    data: { ...data },
    cmd: 'getcrossfilter2',
    formType: 'payload',
  })
}

// 地图搜索-筛选&指标搜索
export const mapSearch = (data) => {
  return axios.request({
    url: '/api/search/filter/map/search',
    method: 'post',
    data: { ...data },
  })
}

// 搜索-筛选&指标搜索
export const measureSearch = (data) => {
  if (data && data.ids) {
    let newIds = []
    data.ids.forEach((d) => {
      let code = d
      if (d.length == 15) {
        code = d.slice(2, 12)
      }
      newIds.push(code)
    })
    data.ids = newIds
  }
  return axios.request({
    url: '/api/search/filter/measureSearch',
    method: 'post',
    data: { ...data, cmdType: 'measureSearch' },
    cmd: 'getcrossfilterquery',
    formType: 'payload',
  })
}

// 搜索-筛选&指标搜索 有fuse
export const measureSearchFuse = (data) => {
  if (data && data.ids) {
    let newIds = []
    data.ids.forEach((d) => {
      let code = d
      if (d.length == 15) {
        code = d.slice(2, 12)
      }
      newIds.push(code)
    })
    data.ids = newIds
  }
  return axios.request({
    url: '/Wind.WFC.Enterprise.Web/Enterprise/gel/dataexplorer/getcrossfilterquery',
    method: 'post',
    data: { ...data, cmdType: 'measureSearch' },
    formType: 'payload',
  })
}

// 搜索-筛选&指标搜索

// 我的订阅名单
export const getMySusList = (data) => {
  return axios.request({
    url: '/api/portal/web/namelist/list',
    method: 'post',
    data,
    cmd: 'getmostviewedcompany',
  })

  // return axios.request({
  //     cmd: 'getmostviewedcompany',
  //     method: 'post',
  //     data: { pcstatus: 0}
  // })
}
// 最近看过名单 （已废弃）
// export const getSeenList = data => {
//   return axios.request({
//     url: "/api/portal/web/recently/seen/list",
//     method: "post",
//     data,
//   })
// }
// 同行在看名单 （模板库）
export const getFellowList = (data) => {
  return axios.request({
    url: '/api/portal/web/template/fellow',
    // url: "/api/portal/common/template/fellow",
    method: 'post',
    data,
  })
}

// 自动匹配公司名称
export const autocompleteCompany = (data) => {
  return axios.request({
    url: '/api/search/suggest/corps/autocomplete',
    method: 'post',
    data,
    cancelTag: 'autocomplete',
  })
}

export const queryUserIndustries = (data) => {
  return axios.request({
    url: '/api/portal/web/template/queryUserIndustries',
    method: 'post',
    data,
  })
}

export const getIndustry = (data) => {
  return axios.request({
    url: '/api/search/suggest/corps/getIndustry',
    method: 'post',
    data,
  })
}

// 获取未混淆的手机号/邮箱
export const getContactByCropid = (data) => {
  return axios.request({
    url: '/api/search/corp/getContact',
    method: 'post',
    data,
  })
}

// 榜单名录搜索
export const getRankAndlist = (data) => {
  return axios.request({
    url: 'corplistpresearch',
    cmd: 'corplistpresearch',
    method: 'post',
    data,
  })
}

// 百分企业园区
export const getBFYQ = (parkName) => {
  return axios.request({
    url: '/baifen-api/dataset/datainfo/DDS20221013002/1?flag=wft',
    method: 'post',
    apiSource: 'baifen',
    formType: 'payload',
    data: {
      business: {
        dataSetCode: 'DDS20221013002',
        parkName: parkName,
        ifdgov: '1',
        size: '100',
        from: 0,
        dataConfig: {
          retType: 'list',
          ifArrData2ObjData: '1',
          dataPath: [
            { path: 'data', type: 'obj', ifover: '0' },
            { path: 'list', type: 'list', ifover: '1' },
          ],
        },
      },
    },
  })
}

// 百分企业赛道
export const getBFSD = (track) => {
  return axios.request({
    url: '/baifen-api/getTrackInfo',
    method: 'post',
    apiSource: 'baifen',
    formType: 'payload',
    data: {
      keywords: track ? track : '',
    },
  })
}

// 查询订阅 id 订阅id，不传代表查询全部
export const getCustomerSubList = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'operation/query/getsubcorpcriterion',
  })
}

// // 修改/编辑订阅
// export const updateCustomerSub = data => {
//     return axios.request({
//       method: "post",
//       data,
//       cmd:"operation/update/updatesubcorpcriterion"
//     })
// }

// 删除订阅
export const delCustomerSub = (data) => {
  return axios.request({
    method: 'post',
    data,
    cmd: 'operation/delete/deletesubcorpcriterion',
  })
}
