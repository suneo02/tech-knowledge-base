import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { CorpBasicInfo } from 'gel-types'
import {
  corpInfoBizRegNoRow,
  corpInfoBusAddressRow,
  corpInfoBussScopeRow,
  corpInfoBussStateRow,
  corpInfoCreditCodeRow,
  corpInfoEmployeeScaleRow,
  corpInfoEndowmentNumRow,
  corpInfoEngNameRow,
  corpInfoIndustryRow,
  corpInfoIssueDateRow,
  corpInfoLegalPersonRow,
  corpInfoNameRow,
  corpInfoOperPeriodBeginRow,
  corpInfoOperPeriodEndRow,
  corpInfoOrgCodeRow,
  corpInfoPaidInCapitalRow,
  corpInfoProvinceRow,
  corpInfoRegAddressRow,
  corpInfoRegAuthorityRow,
  corpInfoRegCapitalRow,
  corpInfoStartDateRow,
  corpInfoTaxIdRow,
  corpInfoTaxpayerQualificationRow,
  corpInfoTypeRow,
  corpInfoUsedNamesRow,
  getCorpInfoScaleRow,
} from '../rowsCommon'

/**
 *
 * @param baseInfo
 */
export const corpInfoPERows = (
  baseInfo: Partial<CorpBasicInfo>,
  onClickFeedback
): HorizontalTableColumns<CorpBasicInfo> => [
  [corpInfoNameRow, corpInfoCreditCodeRow],
  [corpInfoEngNameRow, corpInfoBizRegNoRow],

  [corpInfoUsedNamesRow(baseInfo), corpInfoOrgCodeRow],
  [corpInfoTypeRow, corpInfoTaxIdRow],
  [
    {
      ...corpInfoLegalPersonRow,
      title: intl(410935, '执行事务合伙人'),
    },
    corpInfoTaxpayerQualificationRow,
  ],
  [
    {
      ...corpInfoRegCapitalRow,
      title: intl(121105, '出资额'),
    },
    {
      ...corpInfoPaidInCapitalRow,
      title: intl(323693, '实缴出资'),
    },
    corpInfoStartDateRow,
  ],
  [
    {
      ...corpInfoOperPeriodBeginRow,
      title: intl(410936, '合伙期限自'),
    },
    {
      ...corpInfoOperPeriodEndRow,
      title: intl(410937, '合伙期限至'),
    },
    corpInfoBussStateRow,
  ],
  [
    {
      ...corpInfoProvinceRow,
      title: intl(294490, '所属地区'),
    },
    corpInfoRegAuthorityRow,
    corpInfoIssueDateRow,
  ],
  [getCorpInfoScaleRow(onClickFeedback), corpInfoEmployeeScaleRow, corpInfoEndowmentNumRow],
  [corpInfoIndustryRow()],
  [
    {
      ...corpInfoRegAddressRow,
      title: intl(411314, '主要经营场所'),
    },
  ],
  [corpInfoBusAddressRow],
  [corpInfoBussScopeRow],
]
