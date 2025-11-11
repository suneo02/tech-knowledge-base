import { getLocalStorage } from './ls'
export const getTableDataApi = async (params: any, sort?: any, filter?: any) => {
  const { current, api, apiSuffix, ...rest } = params

  params.pageNo = current - 1
  const formData = new FormData() // 创建一个新的FormData实例
  if (sort?.field && sort?.order) {
    formData.append('sortFieldType', `${sort?.field}_${sort.order === 'ascend' ? 'asc' : 'desc'}`)
  }
  for (const key in { ...rest, pageNo: params.pageNo, ...filter }) {
    if (params[key] || params[key] === 0) formData.append(key, params[key])
  }
  const windParams = getLocalStorage('WindParams')
  const response = await fetch(
    `/api/Wind.WFC.Enterprise.Web/Enterprise/gel/${api}/1056422353?api=${api}&gelmodule=gelpc`,
    {
      method: 'POST', // 根据实际情况调整请求方法
      body: formData,
      headers: {
        'Wind.Sessionid': getLocalStorage('sessionId'),
      },
    }
  )
  const data = await response.json()
  let d = []
  if (Array.isArray(data.Data)) {
    d = data.Data
  } else if (Array.isArray(data.Data?.list)) {
    d = data.Data.list
  }
  let filterList = null
  if (data?.Data?.aggregations) {
    filterList = []
    Object.entries(data.Data.aggregations).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length) {
        const defaultItem = { label: '全部', value: '', default: true }
        const _data = {
          key: key.replace('aggs_', ''),
          options: [defaultItem, ...value.map((res) => ({ ...res, label: res.key, value: res.key }))],
        }
        filterList.push(_data)
      }
    })
  }
  const res = {
    data: d.map((res: any, index: number) => ({
      ...res,
      index: (params.current - 1) * params.pageSize + index + 1,
    })),
    highlight: data?.Data?.highlight,
    filterList,
    total: data?.Page?.Records || 0,
    success: true,
  }
  return res
}

export const getServerApi = async (api: string, params: { id: string; [key: string]: any }) => {
  const formData = new FormData() // 创建一个新的FormData实例
  for (const key in params) {
    formData.append(key, params[key])
  }
  const windParams = getLocalStorage('WindParams')
  const url = `${windParams?.server || 'https://gel.wind.com.cn'}/Wind.WFC.Enterprise.Web/Enterprise/gel/${api}/${
    params.id
  }`
  const suffix = `?api=${api}&gelmodule=gelpc`
  const data = await fetch(`${url}${suffix}`, {
    method: 'POST', // 根据实际情况调整请求方法
    body: formData,
    headers: {
      'Wind.Sessionid': getLocalStorage('sessionId'),
    },
  })
  return data.json()
}

/**
 * 为了测试样例专用，正常调用接口严禁使用该接口
 * @param params
 * @param sort
 * @param filter
 * @returns
 */
export const getForTestApi = async (params: any, sort?: any, filter?: any) => {
  try {
    const { current, api, id, ...rest } = params
    params.pageNo = current - 1
    const formData = new FormData() // 创建一个新的FormData实例
    for (const key in { ...rest, pageNo: params.pageNo, ...sort, ...filter }) {
      formData.append(key, params[key])
    }

    const startTime = performance.now()

    const windParams = getLocalStorage('WindParams')
    const response = await fetch(
      `${
        windParams?.server || 'https://gel.wind.com.cn'
      }/Wind.WFC.Enterprise.Web/Enterprise/gel/detail/company/${api}/${id}?api=${api}&gelmodule=gelpc`,
      {
        method: 'POST', // 根据实际情况调整请求方法
        body: formData,
        headers: {
          'Wind.Sessionid': getLocalStorage('sessionId'),
        },
      }
    )
    const data = await response.json()
    const endTime = performance.now()
    const duration = Math.floor(endTime - startTime)
    const res = {
      duration,
      status: data.Page.Records > 0 ? (duration > 1200 ? 3 : 2) : 3,
      message: duration > 1200 ? '性能测试未通过' : data.Page.Records > 0 ? '' : '无数据',
      // errorMessage: data.ErrorMessage,
    }
    return res
  } catch (e) {
    return {
      status: 3,
      message: `程序报错:${e}`,
    }
  }
}
