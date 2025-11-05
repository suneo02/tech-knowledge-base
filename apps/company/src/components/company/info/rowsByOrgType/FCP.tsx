import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { ICorpBasicInfoFront } from '../handle.tsx'
import {
  corpInfoBizRegNoRow,
  corpInfoBussStateRow,
  corpInfoCreditCodeRow,
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
} from '../rowsCommon'
import {
  corpInfoBusAddressRow,
  corpInfoBussScopeRow,
  corpInfoEmployeeScaleRow,
  corpInfoEndowmentNumRow,
  corpInfoScaleRow,
} from '../rowsCommon/corpScaleRow.tsx'

/**
 *   经营场所
 * @param baseInfo
 */
export const corpInfoFCPRows = (
  baseInfo: ICorpBasicInfoFront,
  onCorpScaleClick: () => void
): HorizontalTableColumns<ICorpBasicInfoFront> => [
  [corpInfoNameRow, corpInfoCreditCodeRow],
  [corpInfoEngNameRow, corpInfoBizRegNoRow],

  [corpInfoUsedNamesRow(baseInfo), corpInfoOrgCodeRow],
  [corpInfoTypeRow, corpInfoTaxIdRow],
  [
    {
      ...corpInfoLegalPersonRow,
      title: intl(139921, '负责人'),
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
  [corpInfoScaleRow(onCorpScaleClick), corpInfoEmployeeScaleRow, corpInfoEndowmentNumRow],
  [corpInfoIndustryRow()],
  [
    {
      ...corpInfoBusAddressRow,
      title: intl(406834, '经营场所'),
    },
  ],
  [corpInfoBussScopeRow],
]
