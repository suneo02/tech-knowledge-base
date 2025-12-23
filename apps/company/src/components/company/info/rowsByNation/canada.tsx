import { corpInfoAnotherNameRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { ICorpBasicInfoFront } from '../handle'
import {
  corpInfoAreaRow,
  corpInfoBussNoRow,
  corpInfoBussStateRow,
  corpInfoCreditCodeRow,
  corpInfoNameRow,
  corpInfoRegAddressRow,
  corpInfoRegAuthorityRow,
  corpInfoStartDateRow,
  corpInfoTypeRow,
} from '../rowsCommon'

export const canadaRows: HorizontalTableColumns<ICorpBasicInfoFront> = [
  [
    {
      ...corpInfoNameRow,
      colSpan: 5,
    },
  ],
  [
    {
      ...corpInfoAnotherNameRow,
      colSpan: 5,
    },
  ],
  [
    {
      ...corpInfoBussStateRow,
      colSpan: 2,
    },
    { ...corpInfoRegAuthorityRow, colSpan: 2 },
  ],
  [
    {
      ...corpInfoAreaRow,
      colSpan: 2,
    },
    { ...corpInfoStartDateRow, colSpan: 2 },
  ],
  [
    {
      ...corpInfoBussNoRow,
      colSpan: 2,
    },
    {
      ...corpInfoCreditCodeRow,
      title: intl(0, '商业编号'),
      colSpan: 2,
    },
  ],
  [
    {
      ...corpInfoTypeRow,
      colSpan: 5,
    },
  ],
  [corpInfoRegAddressRow],
]
