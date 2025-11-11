import intl from '@/utils/intl'
import { AnnouncementColumns } from './columns.tsx'
import { AnnouncementDataCallback, AnnouncementExtraParams } from './comp.tsx'
import { ECorpDetailTable } from 'gel-types'
import { ICorpTableCfg } from '@/components/company/type'

// 企业详情/股东信息/公告披露 cfg
export const CompanyDetailShareholderAnnouncementUnRegularCfg: ICorpTableCfg = {
  enumKey: ECorpDetailTable.ShareholderIrregularDisclosure,
  title: intl('392253', '非定期公告披露'),
  cmd: '/detail/company/getnewshareholdertunregular',
  downDocType: 'download/createtempfile/getnewshareholdertunregular',
  hint: intl('462074', '依据上市公司非定期报告综合计算的最新股东持股情况。'),
  modelNum: 'shareholdertUnregular',
  modelNumUseTotal: true,
  comment: true,
  menuClick: true,
  numHide: true,
  columns: AnnouncementColumns,

  hideWhenNumZero: true,
  extraParams: AnnouncementExtraParams,
  dataCallback: AnnouncementDataCallback,
}
