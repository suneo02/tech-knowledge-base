import { stringifyObjectToParams } from '../../common'
import { WX_WIND_HOST } from '../constant'

export enum AliceLinkModule {
  EDITOR,
}

export const AliceLinkConfigMap: Record<
  AliceLinkModule,
  {
    path: string
    appendParamsToHash?: boolean // 是否将查询参数附加到hash后面而不是作为URL的search部分
    defaultParams?: Record<string, string | boolean | number> // 默认查询参数
  }
> = {
  [AliceLinkModule.EDITOR]: {
    path: '/Wind.SmartEditor.Web/index.html#/main',
    appendParamsToHash: true,
    defaultParams: {
      hideMenu: true,
    },
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
      origin = `https://${WX_WIND_HOST}`
    }
    const config = AliceLinkConfigMap[module]
    const baseUrl = new URL(config.path, origin)

    // 合并默认参数和传入参数
    const mergedParams = {
      ...(config.defaultParams || {}),
      ...(params || {}),
    }

    if (config.appendParamsToHash) {
      const paramsString = stringifyObjectToParams(mergedParams)
      baseUrl.hash = baseUrl.hash + (paramsString ? `?${paramsString}` : '')
    } else {
      baseUrl.search = stringifyObjectToParams(mergedParams)
    }
    return baseUrl.toString()
  } catch (error) {
    console.error('getAlickLink error', error)
  }
}
