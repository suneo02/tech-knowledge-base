import { arrayFind } from '@/misc'
import { TIntl } from '@/types'
import { ReportDetailCustomNodeJson, ReportDetailTableJson, TCorpDetailNodeKey } from 'gel-types'
import { configDetailIntlHelper } from './intlHelper'

const ReportQuarterDescMap = [
  {
    desc: '一季报',
    dateStr: '0331',
    descId: '16154',
  },
  {
    desc: '中报',
    dateStr: '0630',
    descId: '36384',
  },
  {
    desc: '三季报',
    dateStr: '0930',
    descId: '19476',
  },
  {
    desc: '年报',
    dateStr: '1231',
    descId: '355074',
  },
]
/**
 *公告披露 获取季度 及年份
 * @param {string} dateStr
 * @returns
 */
const getRpCategory = (dateStr: string, t: TIntl) => {
  try {
    const monthStr = dateStr.slice(-4)
    const quarterDescItem = arrayFind(ReportQuarterDescMap, (item) => item.dateStr == monthStr)

    const quarterStr = t(quarterDescItem.descId, quarterDescItem.desc)

    const year = dateStr.slice(0, 4) || ''
    return [year, quarterStr]
  } catch (e) {
    console.error(e)
    return []
  }
}
/**
 * TODO intl
 * @param {*} dateStr
 * @returns
 */
export const getAnnouncementReportComment = (dateStr: string, t: TIntl, isEn: boolean) => {
  try {
    if (!dateStr) {
      return null
    }
    // 模块描述 公告披露
    const [year, quarter] = getRpCategory(dateStr, t)
    if (!year || !quarter) {
      return null
    }
    // Top ten shareholders from 2023 annual report
    // Top ten shareholders from 18/08/2023 announcement
    return isEn ? `Top ten shareholders from ${year}/${quarter}/ announcement` : `取自公司${year}年${quarter}前十大股东`
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getAnnouncementUnRegularComment = (dateStr: string | undefined, t: TIntl) => {
  if (!dateStr) {
    return ''
  }
  const dateStrConvert = String(dateStr)
  const year = dateStrConvert?.slice(0, 4) || ''
  const month = dateStrConvert?.slice(4, 6) || ''
  const day = dateStrConvert?.slice(6, 8) || ''
  return `${t('451119', '报告日期')}: ${year}-${month}-${day}`
}

export const getMajorReportComment = (dateStr: string, isEn: boolean) => {
  if (!dateStr) {
    return ''
  }
  const dateStrConvert = String(dateStr)
  const year = dateStrConvert?.slice(0, 4) || ''
  const month = dateStrConvert?.slice(4, 6) || ''
  const day = dateStrConvert?.slice(6, 8) || ''
  return isEn
    ? `Excerpt from the company's announcement on ${month} ${day}, ${year}.`
    : `取自公司${year}年${month}月${day}日公告`
}

/**
 * 获取 表格 前缀 comment
 * 处理公告披露 定期和非定期的 comment
 * @param {*} eachTable
 * @param {Object} resultFirst api 请求得到的数据的第一条
 * @returns
 */
export const getReportNodePrefixComment = (
  key: TCorpDetailNodeKey,
  resultFirst,
  config: ReportDetailTableJson | undefined,
  t: TIntl,
  isEn: boolean
) => {
  try {
    if (config && (config.commentPrefix || config.commentPrefixIntl)) {
      return configDetailIntlHelper(config, 'commentPrefix', t)
    }
    switch (key) {
      case 'ShareholderReport': {
        return getAnnouncementReportComment(resultFirst?.annance_date, t, isEn)
      }
      case 'ShareholderUnregular': {
        return getAnnouncementUnRegularComment(resultFirst?.annance_date, t)
      }
      case 'ShareholderBig': {
        return getMajorReportComment(resultFirst?.annance_date, isEn)
      }
    }
  } catch (e) {
    console.error(e)
    return ''
  }
}

/**
 * 获取 表格 后缀 comment
 * @param {*} eachTable
 * @param {Object} resultFirst api 请求得到的数据的第一条
 * @returns
 */
export const getReportNodeSuffixComment = (
  _key: TCorpDetailNodeKey,
  config: ReportDetailTableJson | ReportDetailCustomNodeJson | undefined,
  t: TIntl,
  isEn: boolean
): string | string[] => {
  if (config && (config.commentSuffix || config.commentSuffixIntl)) {
    return configDetailIntlHelper(config, 'commentSuffix', t)
  }
  if (config && config.commentSuffixArr) {
    return config.commentSuffixArr.map((item) => {
      return isEn ? item.en : item.cn
    })
  }
  return ''
}
