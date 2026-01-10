/**
 * Home Reducer 类型定义
 */
import { ApiResponseForWFC } from 'gel-api'
import { UserPackageInfo } from 'gel-types'
import * as actionTypes from '../actions/actionTypes'

// ======== State 类型定义 ========

export interface HomeState {
  hotcorps: any[]
  lastIndex: number
  corpevents: any[]
  corpnews: any[]
  ads: any[]
  globalModalProps: any | null
  userPackageinfo: UserPackageInfo | null
  userPackageInfoApiLoaded: boolean
  preCorpList: any[]
  preGroupList: any[]
  vipPopupShow: boolean
  wechatQrcode: any | null
  paygoods: any[]
  globalSearchReloadCurrent: boolean
  bindPhoneModal: string
  globalVipModalProps?: any
}

// ======== Action 类型定义 ========

interface BaseAction<T extends string, P = any> {
  type: T
  data: P
}

// Home 相关 Actions
export type SetBindPhoneModalAction = BaseAction<typeof actionTypes.SET_BIND_PHONE_MODAL, string>

export type SetGlobalSearchAction = BaseAction<
  typeof actionTypes.SET_GLOBALSEARCH,
  {
    globalSearchReloadCurrent: boolean
  }
>

export type GetPayGoodsAction = BaseAction<
  typeof actionTypes.GET_PAYGOODS,
  {
    data: any[]
  }
>

export type GetPayOrderAction = BaseAction<
  typeof actionTypes.GET_PAYORDER,
  {
    data: any
  }
>

export type ShowVipPopupAction = BaseAction<
  typeof actionTypes.SHOW_VIPPOPUP,
  {
    visible: boolean
  }
>

export type GetUserPackageAction = BaseAction<
  typeof actionTypes.GET_USERPACKAGE,
  ApiResponseForWFC<UserPackageInfo> & {
    data?: UserPackageInfo
    code: string
  }
>

export type SetUserPackageLoadedAction = BaseAction<typeof actionTypes.SET_USERPACKAGE_LOADED, boolean>

export type GetPreCorpSearchAction = BaseAction<
  typeof actionTypes.GET_PRECORPSEARCH,
  {
    code: string
    data: any[]
  }
>

export type GetPreGroupSearchAction = BaseAction<
  typeof actionTypes.GET_PREGROUPSEARCH,
  {
    code: string
    data: any[]
  }
>

export type GetHotCorpAction = BaseAction<
  typeof actionTypes.GET_HOTCORP,
  {
    code: string
    data: {
      data: any[]
      lastIndex: number
    }
  }
>

export type GetCorpEventAction = BaseAction<
  typeof actionTypes.GET_CORPEVENT,
  {
    code: string
    data: any[]
  }
>

export type GetCorpNewsAction = BaseAction<
  typeof actionTypes.GET_CORPNEWS,
  {
    code: string
    data: any[]
  }
>

export type GetAdsAction = BaseAction<
  typeof actionTypes.GET_ADS,
  {
    errorCode: number
    data: {
      list: any[]
    }
  }
>

export type ToggleCollectAction = BaseAction<
  typeof actionTypes.TOGGLE_COLLECT,
  {
    code: string
    index: number
  }
>

export type SetGlobalModalAction = BaseAction<typeof actionTypes.SET_GLOBAL_MODAL, any>

export type ClearGlobalModalAction = BaseAction<typeof actionTypes.CLEAR_GLOBAL_MODAL, undefined>

export type SetGlobalVipModalAction = BaseAction<typeof actionTypes.SET_GLOBAL_VIP_MODAL, any>

// 联合所有 Home Action 类型
export type HomeAction =
  | SetBindPhoneModalAction
  | SetGlobalSearchAction
  | GetPayGoodsAction
  | GetPayOrderAction
  | ShowVipPopupAction
  | GetUserPackageAction
  | SetUserPackageLoadedAction
  | GetPreCorpSearchAction
  | GetPreGroupSearchAction
  | GetHotCorpAction
  | GetCorpEventAction
  | GetCorpNewsAction
  | GetAdsAction
  | ToggleCollectAction
  | SetGlobalModalAction
  | ClearGlobalModalAction
  | SetGlobalVipModalAction
