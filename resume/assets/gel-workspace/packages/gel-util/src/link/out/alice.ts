import { stringifyObjectToParams } from '../handle/param'

export enum AliceLinkModule {
  EDITOR,
}

export const AliceLinkConfigMap: Record<
  AliceLinkModule,
  {
    path: string
    appendParamsToHash?: boolean // 是否将查询参数附加到hash后面而不是作为URL的search部分
  }
> = {
  [AliceLinkModule.EDITOR]: {
    path: '/Wind.SmartEditor.Web/index.html#/main',
    appendParamsToHash: true,
  },
}

export interface AliceLinkParams {
  [AliceLinkModule.EDITOR]: {
    templateType: 'dueDiligence'
    windCode?: string
    windName?: string
  }
}

export const getAlickLink = (
  module: AliceLinkModule,
  params: AliceLinkParams[AliceLinkModule],
  isDev: boolean = false
): string | undefined => {
  try {
    let origin = window.location.origin
    if (isDev) {
      origin = 'https://wx.wind.com.cn'
    }
    const config = AliceLinkConfigMap[module]
    const baseUrl = new URL(config.path, origin)
    if (config.appendParamsToHash) {
      const paramsString = stringifyObjectToParams(params)
      baseUrl.hash = baseUrl.hash + (paramsString ? `?${paramsString}` : '')
    } else {
      baseUrl.search = stringifyObjectToParams(params)
    }
    return baseUrl.toString()
  } catch (error) {
    console.error('getAlickLink error', error)
  }
}
