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
  corpInfoOrgAuthorityRow,
  corpInfoRegAddressRow,
  corpInfoRegAuthorityRow,
  corpInfoRegCapitalRow,
  corpInfoUsedNamesRow,
} from '../rowsCommon'

/**
 * @param baseInfo
 */
export const corpInfoSOERows = (baseInfo: Partial<CorpBasicInfo>): HorizontalTableColumns<CorpBasicInfoFront> => [
  [{ ...corpInfoNameRow, title: intl(215800, '单位名称') }, corpInfoCreditCodeRow],
  [corpInfoEngNameRow, corpInfoOrgAuthorityRow],
  [
    corpInfoUsedNamesRow(baseInfo),
    {
      ...corpInfoBussStateRow,
      title: intl(448354, '单位状态'),
    },
  ],
  [
    corpInfoLegalPersonRow,
    {
      ...corpInfoRegCapitalRow,
      title: intl(448355, '开办资金'),
    },
    ,
  ],
  [
    { ...corpInfoIndustryRow(), colSpan: 3 },
    { ...corpInfoRegAuthorityRow, title: intl(448324, '登记管理机关') },
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
