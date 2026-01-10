import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
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

export const corpInfoCORows = (
  baseInfo: Partial<CorpBasicInfo>,
  onClickFeedback: () => void
): HorizontalTableColumns => [
  [corpInfoNameRow, corpInfoCreditCodeRow],
  [corpInfoEngNameRow, corpInfoBizRegNoRow],
  [corpInfoUsedNamesRow(baseInfo), corpInfoOrgCodeRow],
  [corpInfoTypeRow, corpInfoTaxIdRow],
  [corpInfoLegalPersonRow, corpInfoTaxpayerQualificationRow],
  [corpInfoRegCapitalRow, corpInfoPaidInCapitalRow, corpInfoStartDateRow],
  [corpInfoOperPeriodBeginRow, corpInfoOperPeriodEndRow, corpInfoBussStateRow],
  [corpInfoProvinceRow, corpInfoRegAuthorityRow, corpInfoIssueDateRow],
  [getCorpInfoScaleRow(onClickFeedback), corpInfoEmployeeScaleRow, corpInfoEndowmentNumRow],
  [corpInfoIndustryRow()],
  [corpInfoRegAddressRow],
  [corpInfoBusAddressRow],
  [corpInfoBussScopeRow],
]
