/**
 * tableApiExecutor.ts
 * 提供表格组件使用的API请求执行器
 */
import { AxiosInstance } from 'axios'
import { requestToWFCWithAxios, wfcApiPathMap } from 'gel-api'
import { ReportDetailTableJson } from 'gel-types'
import { ReportCfg } from 'report-util/constants'

/**
 * 准备请求数据
 */
const prepareRequestData = (
  isBigData: boolean | undefined,
  extraPayload: Record<string, any> | undefined
): Record<string, any> => {
  let data: Record<string, any> = {
    pageNo: 0,
    pageSize: isBigData ? ReportCfg.fallbackPageSize : ReportCfg.tablePageSize,
  }
  if (extraPayload && typeof extraPayload === 'object') {
    data = {
      ...data,
      ...extraPayload,
    }
  }
  return data
}

/**
 * 处理额外参数
 */
const processExtraParams = (extraParams: Record<string, any> | undefined, companyCode: string): Record<string, any> => {
  let extraParamsParsed = { ...extraParams }
  if (extraParams?.companyCode) {
    extraParamsParsed.companyCode = companyCode
  }
  return extraParamsParsed
}

/**
 * 默认API执行器，使用请求发送API请求
 * @param api - API路径
 * @param _key - 企业详情节点键
 * @param callback - 回调函数
 */
export const corpNodeApiExecutorWithAxios = (
  axiosInstance: AxiosInstance,
  config: Pick<
    ReportDetailTableJson,
    'api' | 'key' | 'isBigData' | 'extraPayload' | 'apiOptions' | 'extraParams' | 'apiType'
  >,
  companyCode: string
) => {
  const { api, isBigData, extraPayload, apiOptions, extraParams, apiType } = config

  if (!api) {
    console.error('API不能为空')
  }

  const data = prepareRequestData(isBigData, extraPayload)
  const extraParamsParsed = processExtraParams(extraParams, companyCode)
  if (apiType === 'operation') {
    return requestToWFCWithAxios(axiosInstance, api as keyof wfcApiPathMap, data as any, {
      method: apiOptions?.method,
      params: extraParamsParsed as any,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
  } else {
    return requestToWFCWithAxios(axiosInstance, api as keyof wfcApiPathMap, data as any, {
      method: apiOptions?.method,
      params: extraParamsParsed as any,
      appendUrl: companyCode,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
  }
}
