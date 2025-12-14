import path from 'path-browserify'

export const HTTPS_Protocol = 'https:'
export const HTTP_Protocol = 'http:'

export const HTMLPath = {
  index: 'index.html',
  search: 'SearchHomeList.html',
}

/**
 * 常用的 gel search param
 */
export const GELSearchParam = {
  NoSearch: 'nosearch', // header search bar
  NoToolbar: 'notoolbar', // header toolbar
  IS_SEPARATE: 'isSeparate',
}

export const WFC_Enterprise_Web = 'Wind.WFC.Enterprise.Web'
export const PC_Front = 'PC.Front'
export const GEL_WEB_TEST = 'wind.ent.web/gel'
export const GEL_WEB = 'web'

export const STATIC_FILE_PATH = `/${path.join(WFC_Enterprise_Web, PC_Front, 'resource', 'static')}`
