/**
 * tableApiExecutor.ts
 * 提供表格组件使用的API请求执行器
 */
import { RequestConfig } from '@/api/types/request'
import { corpBaseInfoStore } from '@/store'
import {
  CorpBasicInfo,
  ReportDetailNodeJson,
  ReportDetailTableJson,
  TCorpDetailNodeKey,
  TCorpDetailSectionKey,
} from 'gel-types'
import { ReportCfg } from 'report-util/constants'
import { ApiResponseForWFC } from 'report-util/types'
import { getUrlParamCorpCode } from 'report-util/url'
import { requestBaifenAigc } from '../baifen'
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
const executeConfigApiRequest = (
  apiType: ReportDetailNodeJson['apiType'],
  api: ReportDetailNodeJson['api'],
  data: Record<string, any>,
  extraParamsParsed: Record<string, any>,
  apiOptions: Record<string, any> | undefined,
  options: Pick<RequestConfig<Record<string, any>, ApiResponseForWFC<any> | string>, 'success' | 'error' | 'finish'>
): void => {
  const requestConfig = {
    data,
    method: apiOptions?.method,
    params: extraParamsParsed,
    ...options,
  }
  if (apiType === 'operation') {
    requestWfcGel(api, requestConfig)
  } else if (apiType === 'baifen') {
    requestBaifenAigc(api, requestConfig)
  } else {
    requestWfcEntity(api, getUrlParamCorpCode(), requestConfig)
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
    'api' | 'isBigData' | 'extraPayload' | 'apiOptions' | 'extraParams' | 'apiType'
  > & { key: TCorpDetailNodeKey | TCorpDetailSectionKey },
  options: Pick<RequestConfig<Record<string, any>, ApiResponseForWFC<any> | string>, 'success' | 'error' | 'finish'>
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
    executeConfigApiRequest(apiType, api, data, extraParamsParsed, apiOptions, options)
  } catch (error) {
    console.error(error)
  }
}
