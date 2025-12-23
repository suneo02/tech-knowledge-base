import { formatTime } from '@/format/time'
import { intl, isEn, t } from '@/intl'
import { TIntl } from '@/types'
import { CorpBJEEShareholder, EBJEEShareholderSource } from 'gel-api'

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
    descId: '234305',
  },
]
/**
 *公告披露 获取季度 及年份
 * @param {string} dateStr
 * @returns
 */
const getRpCategory = (dateStr: string) => {
  try {
    const monthStr = dateStr.slice(-4)
    const quarterDescItem = ReportQuarterDescMap.find((item) => item.dateStr == monthStr)

    if (!quarterDescItem) {
      return []
    }
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
export const getAnnouncementReportComment = (dateStr: string) => {
  try {
    if (!dateStr) {
      return null
    }
    // 模块描述 公告披露
    const [year, quarter] = getRpCategory(dateStr)
    if (!year || !quarter) {
      return null
    }
    // Top ten shareholders from 2023 annual report
    // Top ten shareholders from 18/08/2023 announcement
    return isEn()
      ? `Top ten shareholders from ${year}/${quarter}/ announcement`
      : `取自公司${year}年${quarter}前十大股东`
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getAnnouncementUnRegularComment = (dateStr: string | undefined) => {
  if (!dateStr) {
    return ''
  }
  const dateStrConvert = String(dateStr)
  const year = dateStrConvert?.slice(0, 4) || ''
  const month = dateStrConvert?.slice(4, 6) || ''
  const day = dateStrConvert?.slice(6, 8) || ''
  return `${intl(1836, '报告日期')}: ${year}-${month}-${day}`
}
/**
 * 大股东公示信息
 * @param dateStr
 * @returns
 */
export const getMajorReportComment = (dateStr: string) => {
  if (!dateStr) {
    return ''
  }
  const dateStrConvert = String(dateStr)
  const year = dateStrConvert?.slice(0, 4) || ''
  const month = dateStrConvert?.slice(4, 6) || ''
  const day = dateStrConvert?.slice(6, 8) || ''
  return isEn()
    ? `Excerpt from the company's announcement on ${month} ${day}, ${year}.`
    : `取自公司${year}年${month}月${day}日公告`
}

/**
 * 公示信息 北交所
 * @param dateStr
 * @returns
 */
export const getBJEEReportComment = (record: CorpBJEEShareholder, t: TIntl) => {
  if (!record) {
    return ''
  }
  const { participation, source } = record
  const sourceStr =
    source === EBJEEShareholderSource.BJEE_SHANGHAI ? t('462075', '上海股权交易中心') : t('112363', '北京股权交易中心')

  const sourceStrFinal = `${t('462076', '取自')}${sourceStr}`
  if (!participation) {
    return sourceStrFinal
  } else {
    return `${sourceStrFinal} ${t('273669', '更新日期')}: ${formatTime(participation)}`
  }
}
