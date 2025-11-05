// API 超时时间（毫秒）
export const API_TIMEOUT = 180000

export const WFC_PATH = '/Wind.WFC.Enterprise.Web'

// 内容类型
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
} as const

export const wfcGelPath = `${WFC_PATH}/Enterprise/gel`

export const wfcSecurePath = `${WFC_PATH}/Enterprise/WindSecureApi.aspx`
