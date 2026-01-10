import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { CorpBasicInfo } from 'gel-types'
import { CorpBasicInfoFront } from '../handle'
import {
  corpInfoBussScopeRow,
  corpInfoBussStateRow,
  corpInfoCreditCodeRow,
  corpInfoEngNameRow,
  corpInfoIndustryRow,
  corpInfoLegalPersonRow,
  corpInfoNameRow,
  corpInfoOperPeriodRangeRow,
  corpInfoRegAddressRow,
  corpInfoRegAuthorityRow,
  corpInfoRegCapitalRow,
  corpInfoStartDateRow,
  corpInfoTypeRow,
  corpInfoUsedNamesRow,
} from '../rowsCommon'

/**
 * @param baseInfo
 */
export const corpInfoNGORows = (baseInfo: Partial<CorpBasicInfo>): HorizontalTableColumns<CorpBasicInfoFront> => [
  [{ ...corpInfoNameRow, title: intl(410940, '社会组织名称') }, corpInfoCreditCodeRow],
  [
    corpInfoEngNameRow,
    {
      ...corpInfoStartDateRow,
      title: intl(448303, '成立登记日期'),
    },
  ],
  [
    corpInfoUsedNamesRow(baseInfo),
    {
      ...corpInfoOperPeriodRangeRow,
      title: intl(448305, '证书有效期'),
    },
  ],
  [
    {
      ...corpInfoTypeRow,
      title: intl(448304, '社会组织类型'),
    },
    {
      ...corpInfoBussStateRow,
      title: intl(138772, '登记状态'),
    },
  ],
  [corpInfoLegalPersonRow, { ...corpInfoRegAuthorityRow, title: intl(448324, '登记管理机关') }],
  [
    {
      ...corpInfoIndustryRow(),
      colSpan: 3,
    },
    {
      ...corpInfoRegCapitalRow,
      title: intl('448309', '注册资金'),
    },
  ],
  [
    {
      ...corpInfoRegAddressRow,
      title: intl(448326, '住所'),
    },
  ],
  [
    {
      ...corpInfoBussScopeRow,
      title: intl(149609, '业务范围'),
    },
  ],
]
