import axios from './index'

// 查询所有筛选项
export const getFilterItem = (data?) => {
  return axios.request({
    url: '/api/portal/config/filteritem/v2',
    method: 'post',
    data: { ...(data || {}), accountId: 'visa', cmdType: 'filterItem' },
    cmd: 'getcrossfilterquery',
    formType: 'payload',
  })
}

// 查询城市列表
export const getRegions = (data) => {
  return axios.request({
    url: '/api/portal/config/area',
    method: 'post',
    data,
  })
}

// 查询行业列表
export const getIndustries = (data) => {
  return axios.request({
    url: '/api/portal/config/industry',
    method: 'post',
    data,
  })
}

// 所有可选指标
export const getIndicator = (data) => {
  return axios.request({
    url: '/api/portal/config/indicator',
    method: 'post',
    data: { ...data, accountId: 'visa', cmdType: 'indicator' },
    // cmd: 'getcrossfilterindicator',
    cmd: 'getcrossfilterquery',
    formType: 'payload',
  })
}

// 功能点埋点入栈
/**
 * @deprecated
 */
export const pointBuried = (_a) => {}

export const pointBuriedGel = (code, opEntity, funcType, dicParam?, productId?) => {
  try {
    let str = ''
    const data: any = {
      functionCode: code,
      opEntity,
      funcType,
    }
    if (productId) {
      data.productId = productId
    }

    if (dicParam) {
      for (const k in dicParam) {
        str += str ? ',' + `${k}=${dicParam[k]}` : `${k}=${dicParam[k]}`
      }
      data.strParam = str
      data.dicParam = JSON.stringify(dicParam)
    } else {
      data.strParam = 'opActive=click'
      data.dicParam = JSON.stringify({
        opActive: 'click',
      })
    }
    // 后端不支持批量上传 先每次单独上传
    data && postPointBuried(data)
  } catch (e) {
    console.error(e)
  }
}

// 主要的六个参数
// functionCode功能点  opEntity功能名称  currentId当前id  opActive触发类型  currentPage当前页面 opSystem终端类型
const functionCodes = [
  {
    functionCode: '922602100791',
    opEntity: '榜单名录-列表页-特色企业名录',
    opActive: 'click',
    currentPage: 'futureList',
  },
  {
    functionCode: '922602100854',
    opEntity: '榜单名录-首页-特色企业名录',
    opActive: 'loading',
    currentPage: 'SearchFetured',
  },
  {
    functionCode: '922602100855',
    opEntity: '榜单名录-首页-特色企业名录-搜索',
    opActive: 'click',
    currentPage: 'SearchFetured',
  },

  {
    opEntity: '榜单名录-企业列表',
    functionCode: '922602100765',
    opActive: 'click',
    currentPage: 'futurecompany',
  },
  {
    opEntity: '榜单名录-地区分布',
    functionCode: '922602100764',
    opActive: 'click',
    currentPage: 'futurecompany',
  },
  {
    opEntity: '榜单名录-行业分析',
    functionCode: '922602100763',
    opActive: 'click',
    currentPage: 'futurecompany',
  },
  {
    opEntity: '榜单名录-更多统计',
    functionCode: '922602100762',
    opActive: 'click',
    currentPage: 'futurecompany',
  },
]

export const pointBuriedNew = (code, options = {}) => {
  let data = functionCodes.find((i) => i.functionCode === code)
  if (!data) {
    // @ts-expect-error ttt
    data = {
      functionCode: code,
    }
  }

  data && postPointBuried({ ...data, ...options })
}

// 功能点埋点，集中发送请求
// 超过20条直接抛弃
const postPointBuried = (data) => {
  try {
    const params = []
    if (data) {
      for (const k in data) {
        if (k !== 'functionCode') {
          params.push({
            paramName: k,
            paramValue: data[k],
          })
        }
      }
    }

    axios
      .requestToEntWeb('user-log/add?api=buryCode', {
        userLogItems: [
          {
            action: data.functionCode,
            params,
          },
        ],
      })
      .catch(console.error)
  } catch (e) {
    console.error(e)
  }
}
