import { getLegalPersonField } from '@/components/company/handle'
import { corpInfoEngNameRow, corpInfoUsedNamesRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import { CorpBasicInfoFront } from './handle.tsx'
import {
  corpInfoBizRegNoRow,
  corpInfoCreditCodeRow,
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
} from './rowsCommon/base.tsx'
import { corpInfoBussStateRow } from './rowsCommon/bussStateRow.tsx'
import {
  corpInfoBusAddressRow,
  corpInfoBussScopeRow,
  corpInfoEmployeeScaleRow,
  corpInfoEndowmentNumRow,
  corpInfoRegAddressRow,
  getCorpInfoScaleRow,
} from './rowsCommon/corpScaleRow.tsx'

export const getCorpInfoDefaultRows = (
  baseInfo: Partial<CorpBasicInfoFront>,
  onFeedbackClick: () => void
): HorizontalTableColumns<CorpBasicInfoFront> => [
  [corpInfoNameRow, corpInfoCreditCodeRow],
  [corpInfoEngNameRow, corpInfoBizRegNoRow],
  [corpInfoUsedNamesRow(baseInfo), corpInfoOrgCodeRow],
  [corpInfoTypeRow, corpInfoTaxIdRow],
  [getCorpInfoScaleRow(onFeedbackClick), corpInfoEmployeeScaleRow, corpInfoEndowmentNumRow],

  [
    {
      ...corpInfoLegalPersonRow,
      title: getLegalPersonField(baseInfo?.corp_type),
    },
    corpInfoTaxpayerQualificationRow,
  ],
  [corpInfoRegCapitalRow, corpInfoPaidInCapitalRow, corpInfoStartDateRow],
  [corpInfoOperPeriodBeginRow, corpInfoOperPeriodEndRow, corpInfoBussStateRow],
  [corpInfoProvinceRow, corpInfoRegAuthorityRow, corpInfoIssueDateRow],
  [corpInfoRegAddressRow],
  [corpInfoBusAddressRow],
  [corpInfoBussScopeRow],
]
