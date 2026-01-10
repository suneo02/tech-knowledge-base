import intl from '../../../utils/intl'
import { wftCommon } from '../../../utils/utils'
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
  StandardClassifyCN,
  StandardClassifyInternational,
  StandardName,
  StandardNo,
  StandardStatus,
} from './common'
import { ManageUnit, TechnicalOwnerUnit } from './common/department'

import { EStandard, STANDARD_LEVEL_MAP } from '@/handle/link'
import { StandardLevel } from './common'

export const StandardLevelLocal = {
  ...StandardLevel,
  render: () => STANDARD_LEVEL_MAP[EStandard.LOCAL],
}

const Region = {
  title: intl('437319', '所属省份'),
  dataIndex: 'district',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: wftCommon.formatCont,
}
/**
 * 地方标准
 */
export const standardDataLocal = {
  standard: {
    columns: [
      [StandardName, StandardNo],
      [StandardLevelLocal, StandardStatus],
      [Region, PublishDate],
      [ImplementDate, AbolishDate],
      [StandardClassifyCN, StandardClassifyInternational],
      [TechnicalOwnerUnit, ManageUnit],
      [ScopeOfUse],
    ],
    horizontal: true,
    name: intl('478706', '标准信息详情'),
  },
  filing: {
    columns: filingsColumns,
    horizontal: true,
    name: intl('468637', '备案信息'),
  },
  draft: {
    columns: [DraftUnit, DraftNum, RegisterCapital, EstablishDate],
    horizontal: false,
    name: intl('478702', '起草单位'),
  },
}
