import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { ICorpBasicInfoFront } from '../handle'
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
export const corpInfoNGORows = (baseInfo: ICorpBasicInfoFront): HorizontalTableColumns<ICorpBasicInfoFront> => [
  [{ ...corpInfoNameRow, title: intl(410940, '社会组织名称') }, corpInfoCreditCodeRow],
  [
    corpInfoEngNameRow,
    {
      ...corpInfoStartDateRow,
      title: intl(207784, '成立登记日期'),
    },
  ],
  [
    corpInfoUsedNamesRow(baseInfo),
    {
      ...corpInfoOperPeriodRangeRow,
      title: intl(207789, '证书有效期'),
    },
  ],
  [
    {
      ...corpInfoTypeRow,
      title: intl(207787, '社会组织类型'),
    },
    {
      ...corpInfoBussStateRow,
      title: intl(138772, '登记状态'),
    },
  ],
  [corpInfoLegalPersonRow, { ...corpInfoRegAuthorityRow, title: intl(208889, '登记管理机关') }],
  [
    {
      ...corpInfoIndustryRow(),
      colSpan: 3,
    },
    {
      ...corpInfoRegCapitalRow,
      title: intl('138473', '注册资金'),
    },
  ],
  [
    {
      ...corpInfoRegAddressRow,
      title: intl(207785, '住所'),
    },
  ],
  [
    {
      ...corpInfoBussScopeRow,
      title: intl(145358, '业务范围'),
    },
  ],
]
