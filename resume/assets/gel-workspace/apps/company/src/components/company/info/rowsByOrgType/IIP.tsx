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
} from '@/components/company/info/rowsCommon/base.tsx'
import { corpInfoBussStateRow } from '@/components/company/info/rowsCommon/bussStateRow.tsx'
import {
  corpInfoBusAddressRow,
  corpInfoBussScopeRow,
  corpInfoEmployeeScaleRow,
  corpInfoEndowmentNumRow,
  corpInfoRegAddressRow,
  getCorpInfoScaleRow,
} from '@/components/company/info/rowsCommon/corpScaleRow.tsx'
import { corpInfoIndustryRow } from '@/components/company/info/rowsCommon/industryGBRow.tsx'
import { corpInfoEngNameRow, corpInfoUsedNamesRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable'
import intl from '@/utils/intl'
import { ICorpBasicInfoFront } from '../handle'

export const getIndividualBusinessRows = (
  baseInfo: ICorpBasicInfoFront,
  onClickFeedback: () => void
): HorizontalTableColumns<ICorpBasicInfoFront> => {
  return [
    [corpInfoNameRow, corpInfoCreditCodeRow],
    [corpInfoEngNameRow, corpInfoBizRegNoRow],
    [corpInfoUsedNamesRow(baseInfo), corpInfoOrgCodeRow],
    [corpInfoTypeRow, corpInfoTaxIdRow],
    [getCorpInfoScaleRow(onClickFeedback), corpInfoEmployeeScaleRow, corpInfoEndowmentNumRow],
    [
      {
        ...corpInfoLegalPersonRow,
        title: intl(406833, '经营者'),
      },
      corpInfoTaxpayerQualificationRow,
    ],
    [
      {
        ...corpInfoRegCapitalRow,
        title: intl(406814, '资金数额'),
      },
      corpInfoPaidInCapitalRow,
      corpInfoStartDateRow,
    ],
    [corpInfoOperPeriodBeginRow, corpInfoOperPeriodEndRow, corpInfoBussStateRow],
    [corpInfoProvinceRow, corpInfoRegAuthorityRow, corpInfoIssueDateRow],
    [corpInfoIndustryRow()],
    [
      {
        ...corpInfoRegAddressRow,
        title: intl(406834, '经营场所'),
      },
    ],
    [corpInfoBusAddressRow],
    [corpInfoBussScopeRow],
  ]
}
