import intl from '@/utils/intl'
import { AnnouncementColumns } from './columns.tsx'
import { AnnouncementDataCallback, AnnouncementExtraParams } from './comp.tsx'
import { ECorpDetailTable } from '@/handle/corp/detail/module/type.ts'
import { ICorpTableCfg } from '@/components/company/type'

// 企业详情/股东信息/公告披露 cfg
export const CompanyDetailShareholderAnnouncementUnRegularCfg: ICorpTableCfg = {
  enumKey: ECorpDetailTable.ShareholderIrregularDisclosure,
  title: intl('392253', '非定期公告披露'),
  cmd: '/detail/company/getnewshareholdertunregular',
  downDocType: 'download/createtempfile/getnewshareholdertunregular',
  hint: intl('392254', '此为非定期报告，只展示报告中披露变动的股东数据，非十大股东完整数据。'),
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
