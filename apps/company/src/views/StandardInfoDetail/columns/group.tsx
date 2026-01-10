//行业标准
import { EStandard, STANDARD_LEVEL_MAP } from '@/handle/link'
import intl from '../../../utils/intl'
import {
  DraftNum,
  DraftUnit,
  EstablishDate,
  ImplementDate,
  PublishDate,
  RegisterCapital,
  ScopeOfUse,
  StandardClassifyCN,
  StandardClassifyInternational,
  StandardLevel,
  StandardName,
  StandardNo,
  StandardStatus,
} from './common'

export const StandardLevelGroup = {
  ...StandardLevel,
  render: () => STANDARD_LEVEL_MAP[EStandard.GROUP],
}

export const standardDataGroup = {
  standard: {
    columns: [
      [StandardName, StandardNo],
      [StandardLevelGroup, StandardStatus],
      [PublishDate, ImplementDate],
      [StandardClassifyCN, StandardClassifyInternational],
      [
        {
          ...ScopeOfUse,
          title: intl(0, '主要技术内容'),
        },
      ],
    ],
    horizontal: true,
    name: intl('478706', '标准信息详情'),
  },
  draft: {
    columns: [DraftUnit, DraftNum, RegisterCapital, EstablishDate],
    horizontal: false,
    name: intl('478702', '起草单位'),
  },
}
