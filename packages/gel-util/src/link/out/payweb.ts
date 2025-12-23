import { isTerminalTestSite, WindSessionHeader } from '@/env'
import { stringifyObjectToParams } from '../../common'

export enum PayWebModule {
  // https://wx.wind.com.cn/payweb/check.html?orderNo=xxx&invoiceMode=append#/invoice
  CHECK,
}

export const PayWebConfigMap: Record<
  PayWebModule,
  {
    path: string
    hash: string
    appendParamsToHash?: boolean // 是否将查询参数附加到hash后面而不是作为URL的search部分
  }
> = {
  [PayWebModule.CHECK]: {
    path: '/payweb/check.html',
    hash: 'invoice',
  },
}

export interface PayWebParams {
  [PayWebModule.CHECK]: {
    orderNo: string
    invoiceMode: 'append'
    [WindSessionHeader]?: string
  }
}

export const getPayWebLink = (
  module: PayWebModule,
  params: PayWebParams[PayWebModule],
  isDev: boolean = false
): string | undefined => {
  try {
    let origin: string
    if (isDev) {
      origin = 'https://wx.wind.com.cn'
    }
    if (isTerminalTestSite()) {
      origin = 'https://test.wind.com.cn'
    } else {
      origin = 'https://wx.wind.com.cn'
    }
    const config = PayWebConfigMap[module]
    const baseUrl = new URL(config.path, origin)
    baseUrl.hash = config.hash
    if (config.appendParamsToHash) {
      const paramsString = stringifyObjectToParams(params)
      baseUrl.hash = baseUrl.hash + (paramsString ? `?${paramsString}` : '')
    } else {
      baseUrl.search = stringifyObjectToParams(params)
    }
    return baseUrl.toString()
  } catch (error) {
    console.error('getPayWebLink error', error)
  }
}
