import { getLocale } from './intl'

const WX_URL = 'https://wx.wind.com.cn'
const GEL_PC_PREFIX = 'Wind.WFC.Enterprise.Web/PC.Front'
const COMPANY_SERVICE_PREFIX = 'Company'
const GEL_ORIGIN = 'https://gel.wind.com.cn'
const GEL_WEB = 'web'

export function getAgreementLink(lang: 'CN' | 'EN' = 'CN') {
  const base = `${WX_URL}/${GEL_PC_PREFIX}/${COMPANY_SERVICE_PREFIX}/index.html`
  const query = new URLSearchParams({ pure: '1', source: 'windzx' }).toString()
  const url = new URL(base)
  url.hash = `/agreement${lang}?${query}`
  return url.toString()
}

export const getVipServiceLink = () => {
  const locale = getLocale()
  const url = new URL(`${GEL_ORIGIN}/${GEL_WEB}/${COMPANY_SERVICE_PREFIX}/index.html`)
  url.search = new URLSearchParams({ nosearch: '1', lang: locale === 'zh-CN' ? 'cn' : 'en' }).toString()
  url.hash = '/versionPrice'
  return url.toString()
}

export const getLoginLink = () => {
  const locale = getLocale()
  const url = new URL(`${GEL_ORIGIN}/${GEL_WEB}/${locale === 'zh-CN' ? 'windLogin' : 'windLoginEn'}.html`)
  url.search = new URLSearchParams({ lang: locale === 'zh-CN' ? 'zh' : 'en' }).toString()
  return url.toString()
}
