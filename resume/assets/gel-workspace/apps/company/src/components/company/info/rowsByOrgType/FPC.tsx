import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { ICorpBasicInfoFront } from '../handle'
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
  corpInfoScaleRow,
  corpInfoStartDateRow,
  corpInfoTaxIdRow,
  corpInfoTaxpayerQualificationRow,
  corpInfoTypeRow,
  corpInfoUsedNamesRow,
} from '../rowsCommon'

/**
 * 出资额 住所
 * @param baseInfo
 */
export const corpInfoFPCRows = (
  baseInfo: ICorpBasicInfoFront,
  onCorpScaleClick: () => void
): HorizontalTableColumns<ICorpBasicInfoFront> => [
  [corpInfoNameRow, corpInfoCreditCodeRow],
  [corpInfoEngNameRow, corpInfoBizRegNoRow],
  [corpInfoUsedNamesRow(baseInfo), corpInfoOrgCodeRow],
  [corpInfoTypeRow, corpInfoTaxIdRow],
  [corpInfoLegalPersonRow, corpInfoTaxpayerQualificationRow],
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
  [corpInfoScaleRow(onCorpScaleClick), corpInfoEmployeeScaleRow, corpInfoEndowmentNumRow],
  [corpInfoIndustryRow()],
  [
    {
      ...corpInfoRegAddressRow,
      title: intl(207785, '住所'),
    },
  ],
  [corpInfoBusAddressRow],
  [corpInfoBussScopeRow],
]
