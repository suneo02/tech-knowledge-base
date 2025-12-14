/**
 * 企业基本信息API
 * 提供企业基本信息相关API请求
 */
import { requestWfcEntity, requestWfcGel } from '@/api/services/wfc'
import { RequestConfig } from '@/api/types/request'
import { getUrlParamCorpCode } from 'report-util/url'
import { requestWfcSecure } from '../wfcSecure'

/**
 * 获取企业基本信息
 * @param callback - 回调函数
 */
export const corpInfoApiExecutor = (options: Pick<RequestConfig, 'success' | 'error' | 'finish'>): void => {
  // 使用回调式API
  requestWfcEntity('detail/company/getcorpbasicinfo_basic', getUrlParamCorpCode(), {
    data: {},
    ...options,
  })
}

/**
 * 获取企业统计数字
 */
export const corpBasicNumApiExecutor = (options: Pick<RequestConfig, 'success' | 'error' | 'finish'>): void => {
  requestWfcEntity('detail/company/getentbasicnum', getUrlParamCorpCode(), {
    data: {},
    ...options,
  })
}

/**
 * 获取专利统计数字
 */
export const corpPatentBasicNumApiExecutor = (options: Pick<RequestConfig, 'success' | 'error' | 'finish'>): void => {
  requestWfcEntity('detail/company/patent_statistical_number', getUrlParamCorpCode(), {
    data: {},
    ...options,
  })
}

/**
 * 获取商标统计数字
 */
export const corpTrademarkBasicNumApiExecutor = (
  options: Pick<RequestConfig, 'success' | 'error' | 'finish'>
): void => {
  requestWfcSecure('getintellectual', {
    data: {
      type: 'trademark_sum_corp',
      companyType: 0,
      companycode: getUrlParamCorpCode(),
      pageNo: 0,
      pageSize: 1,
    },
    ...options,
  })
}
/**
 * 获取企业其他信息
 */
export const corpOtherInfoApiExecutor = (options: Pick<RequestConfig, 'success' | 'error' | 'finish'>): void => {
  requestWfcGel('operation/insert/getOtherInfo', {
    data: {
      companyCode: getUrlParamCorpCode(),
    },
    ...options,
  })
}
