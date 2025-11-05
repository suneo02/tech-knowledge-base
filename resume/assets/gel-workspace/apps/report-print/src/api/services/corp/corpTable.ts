/**
 * tableApiExecutor.ts
 * 提供表格组件使用的API请求执行器
 */
import { RequestConfig } from '@/api/types/request'
import { ApiResponseForWFC } from '@/api/types/response'
import { corpBaseInfoStore } from '@/store'
import { CorpBasicInfo, ReportDetailTableJson } from 'gel-types'
import { ReportCfg } from 'report-util/constants'
import { getUrlParamCorpCode } from 'report-util/url'
import { requestWfcEntity, requestWfcGel } from '../wfc'

/**
 * 处理BussInfo特殊情况
 */
const handleBussInfo = (
  options: Pick<RequestConfig<Record<string, any>, ApiResponseForWFC<CorpBasicInfo>>, 'success' | 'error' | 'finish'>
): void => {
  corpBaseInfoStore.fetchData({}, (_response, error) => {
    if (error) {
      options.error?.(error)
    } else {
      options.success?.(corpBaseInfoStore.getRawData())
    }
    options.finish?.(corpBaseInfoStore.getRawData(), error)
  })
}

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
const processExtraParams = (extraParams: Record<string, any> | undefined): Record<string, any> => {
  let extraParamsParsed = { ...extraParams }
  if (extraParams?.companyCode) {
    extraParamsParsed.companyCode = getUrlParamCorpCode()
  }
  return extraParamsParsed
}

/**
 * 执行API请求
 */
const executeApiRequest = (
  apiType: string | undefined,
  api: string,
  data: Record<string, any>,
  extraParamsParsed: Record<string, any>,
  apiOptions: Record<string, any> | undefined,
  options: Pick<RequestConfig, 'success' | 'error' | 'finish'>
): void => {
  if (apiType === 'operation') {
    requestWfcGel(api, {
      data,
      method: apiOptions?.method,
      params: extraParamsParsed,
      ...options,
    })
  } else {
    requestWfcEntity(api, getUrlParamCorpCode(), {
      data,
      method: apiOptions?.method,
      params: extraParamsParsed,
      ...options,
    })
  }
}

/**
 * 默认API执行器，使用请求发送API请求
 * @param api - API路径
 * @param _key - 企业详情节点键
 * @param callback - 回调函数
 */
export const corpNodeApiExecutor = (
  config: Pick<
    ReportDetailTableJson,
    'api' | 'key' | 'isBigData' | 'extraPayload' | 'apiOptions' | 'extraParams' | 'apiType'
  >,
  options: Pick<RequestConfig, 'success' | 'error' | 'finish'>
): void => {
  try {
    const { api, key, isBigData, extraPayload, apiOptions, extraParams, apiType } = config

    // 处理BussInfo特殊情况
    if (key === 'BussInfo') {
      handleBussInfo(options)
      return
    }

    if (!api) {
      options.error?.(new Error('API不能为空'))
      return
    }

    const data = prepareRequestData(isBigData, extraPayload)
    const extraParamsParsed = processExtraParams(extraParams)
    executeApiRequest(apiType, api, data, extraParamsParsed, apiOptions, options)
  } catch (error) {
    console.error(error)
  }
}
