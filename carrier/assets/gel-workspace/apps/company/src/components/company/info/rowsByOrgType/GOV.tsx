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
  corpInfoRegAddressRow,
  corpInfoRegAuthorityRow,
  corpInfoRegCapitalRow,
  corpInfoStartDateRow,
  corpInfoTypeRow,
  corpInfoUsedNamesRow,
} from '../rowsCommon'

export const corpInfoGOVRows = (baseInfo: ICorpBasicInfoFront): HorizontalTableColumns => [
  [{ ...corpInfoNameRow, title: intl(215800, '单位名称') }, corpInfoCreditCodeRow],
  [
    corpInfoEngNameRow,
    {
      ...corpInfoRegAuthorityRow,
      title: intl(0, '批准机构'), // FIXME
      render: (txt) => (txt ? txt : intl(410957, '未公示')),
    },
  ],
  [
    {
      ...corpInfoUsedNamesRow(baseInfo),
      colSpan: undefined,
    },
    {
      ...corpInfoBussStateRow,
      title: intl(410939, '机构状态'),
    },
    { ...corpInfoTypeRow, title: intl(31990, '机构类型'), colSpan: undefined },
  ],
  [
    corpInfoStartDateRow,
    {
      ...corpInfoLegalPersonRow,
      colSpan: undefined,
    },
    corpInfoRegCapitalRow,
  ],
  [
    {
      ...corpInfoIndustryRow(),
      colSpan: 5,
    },
  ],

  [corpInfoRegAddressRow],
  [corpInfoBussScopeRow],
]
