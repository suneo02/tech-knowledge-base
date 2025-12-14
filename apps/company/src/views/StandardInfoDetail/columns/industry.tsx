//行业标准
import intl from '../../../utils/intl'
import {
  AbolishDate,
  DraftNum,
  DraftUnit,
  EstablishDate,
  filingsColumns,
  ImplementDate,
  PublishDate,
  RegisterCapital,
  ScopeOfUse,
  StandardCategory,
  StandardClassifyCN,
  StandardClassifyInternational,
  StandardName,
  StandardNature,
  StandardNo,
  StandardStatus,
} from './common'

import { ManageUnit, TechnicalOwnerUnit } from './common/department'

export const standardDataIndustry = {
  standard: {
    columns: [
      [StandardName, StandardNo],
      [StandardStatus, StandardCategory],
      [StandardNature, PublishDate],
      [ImplementDate, AbolishDate],
      [StandardClassifyCN, StandardClassifyInternational],
      [ManageUnit, TechnicalOwnerUnit],
      [ScopeOfUse],
    ],
    horizontal: true,
    name: intl('328180', '标准信息详情'),
  },
  filing: {
    columns: filingsColumns,
    horizontal: true,
    name: intl('328161', '备案信息'),
  },
  draft: {
    columns: [DraftUnit, DraftNum, RegisterCapital, EstablishDate],
    horizontal: false,
    name: intl('328188', '起草单位'),
  },
}
