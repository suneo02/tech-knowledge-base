import { CDEMeasureItem } from 'gel-api'
import { t } from 'gel-util/intl'

/**
 * 超级名单中 企业数据浏览器默认 measure
 *
 * 企业名称、统一社会信用代码、法定代表人、注册资本、省、市、注册地址、经营状态、成立日期、网址
 */
export const CDEMeasureDefaultForSL: CDEMeasureItem[] = [
  { field: 'corp_name', title: t('258805', '企业名称') },
  { field: 'corp_id', title: t('455039', '企业ID') },
  { field: 'credit_code', title: t('138808', '统一社会信用代码') },
  { field: 'artificial_person', title: t('149509', '法定代表人') },
  { field: 'register_capital', title: t('265705', '注册资本') },
  { field: 'register_address', title: t('35776', '注册地址') },
  { field: 'govlevel', title: t('261971', '经营状态') },
  { field: 'established_time', title: t('138860', '成立日期') },
  { field: 'domain', title: t('26583', '网址') },
  { field: 'brief', title: t('32912', '公司简介') },
]
