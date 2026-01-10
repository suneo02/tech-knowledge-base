import { WindSessionHeader } from '@/env'

export enum EIsSeparate {
  True = 1,
  False = 0,
}
export enum ENoToolbar {
  True = 1,
  False = 0,
}
export enum ENoSearch {
  True = 1,
  False = 0,
}

export const COMMON_PARAM_KEYS = {
  NOSEARCH: 'nosearch',
  NOTOOLBAR: 'notoolbar',
  ISSEPARATE: 'isSeparate',
  WIND_SESSION_HEADER: WindSessionHeader,
  SNAPSHOT: 'snapshot',
  LINKSRC: 'linksource',
} as const

export type CommonLinkParams = {
  [COMMON_PARAM_KEYS.NOSEARCH]?: ENoSearch
  [COMMON_PARAM_KEYS.NOTOOLBAR]?: ENoToolbar
  [COMMON_PARAM_KEYS.ISSEPARATE]?: EIsSeparate
  [COMMON_PARAM_KEYS.WIND_SESSION_HEADER]?: string
  [COMMON_PARAM_KEYS.SNAPSHOT]?: '1' | '0'
  // TODO 待完善
  [COMMON_PARAM_KEYS.LINKSRC]?: 'pcai' | 'rimepevc'
}
