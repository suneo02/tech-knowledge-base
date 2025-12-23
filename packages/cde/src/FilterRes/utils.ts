import { CDEFilterResItem, CDEMeasureField } from 'gel-api'
import { intl, isEn } from 'gel-util/intl'

export function getColumnsWidth(key: CDEMeasureField): number {
  const defaultWidth: Partial<Record<CDEMeasureField, number>> = {
    'No.': 50,
    corp_name: 300,
    credit_code: 240,
    region: 160,
    industry_gb: 160,
    artificial_person: 100,
    govlevel: 100,
    established_time: 130,
    register_capital: 160,
    capital_unit: 120,
    register_address: 300,
    tel: 160,
    mail: 240,
    biz_scope: 300,
    brief: 300,
    eng_name: 240,
    oper_period_end: 240,
    endowment_num: 100,
    ent_scale_num_indicator: 100,
    'count.patent_num': 100,
    'count.trademark_num': 100,
  }
  return defaultWidth[key] || 300
}

export function formatDate(date: string): string {
  if (!date) return ''
  return `${date.substring(0, 4)}${isEn() ? '/' : '年'}${date.substring(4, 6)}${
    isEn() ? '/' : '月'
  }${date.substring(6, 8)}${isEn() ? '/' : '日'}`
}

export function operPeriodFormat(props: CDEFilterResItem): string {
  const { oper_period_begin, oper_period_end } = props

  const startText = oper_period_begin
    ? isEn()
      ? oper_period_begin
      : formatDate(oper_period_begin)
    : intl('271247', '无固定期限')

  const endText = oper_period_end
    ? isEn()
      ? oper_period_end
      : formatDate(oper_period_end)
    : intl('271247', '无固定期限')

  return `${startText} ${intl('271245', '至')} ${endText}`
}
