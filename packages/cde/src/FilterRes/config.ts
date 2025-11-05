import { CDEMeasureItem } from 'gel-api'
import { intl } from 'gel-util/intl'

/**
 * 超级名单中 企业数据浏览器默认 measure
 *
 * 企业名称、统一社会信用代码、法定代表人、注册资本、省、市、注册地址、经营状态、成立日期、网址
 */
export const CDEMeasureDefaultForSL: CDEMeasureItem[] = [
  { field: 'corp_name', title: intl(258805, '企业名称') },
  { field: 'credit_code', title: intl('138808', '统一社会信用代码') },
  { field: 'artificial_person', title: intl(149509, '法定代表人') },
  { field: 'register_capital', title: intl(265705, '注册资本') },
  { field: 'register_address', title: intl(35776, '注册地址') },
  { field: 'govlevel', title: intl(261971, '经营状态') },
  { field: 'established_time', title: intl(138860, '成立日期') },
]
