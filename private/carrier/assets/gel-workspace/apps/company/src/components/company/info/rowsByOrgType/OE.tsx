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
 * @param baseInfo
 */
export const corpInfoOERows = (
  baseInfo: Partial<CorpBasicInfo>,
  onClickFeedback: () => void
): HorizontalTableColumns<CorpBasicInfo> => [
  [corpInfoNameRow, corpInfoCreditCodeRow],
  [corpInfoEngNameRow, corpInfoBizRegNoRow],

  [corpInfoUsedNamesRow(baseInfo), corpInfoOrgCodeRow],
  [corpInfoTypeRow, corpInfoTaxIdRow],
  [
    {
      ...corpInfoLegalPersonRow,
      title: intl(448323, '负责人'),
    },
    corpInfoTaxpayerQualificationRow,
  ],
  [
    {
      ...corpInfoRegCapitalRow,
      title: intl(121105, '出资额'),
    },
    corpInfoPaidInCapitalRow,
    corpInfoStartDateRow,
  ],
  [corpInfoOperPeriodBeginRow, corpInfoOperPeriodEndRow, corpInfoBussStateRow],
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
      ...corpInfoBusAddressRow,
      title: intl(406834, '经营场所'),
    },
  ],
  [corpInfoBussScopeRow],
]
