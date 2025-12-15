import { EStandard, STANDARD_URL_PARAM_MAP } from '@/handle/link'
import { standardDataGroup } from './group'
import { standardDataIndustry } from './industry'
import { standardDataLocal } from './local'
import { standardDataCountry } from './nation'
import { standardPlan } from './nationPlan'

export const standardTableColumn: Record<string, any> = {
  [STANDARD_URL_PARAM_MAP[EStandard.INDUSTRY]]: standardDataIndustry,
  [STANDARD_URL_PARAM_MAP[EStandard.NATION_PLAN]]: standardPlan,
  [STANDARD_URL_PARAM_MAP[EStandard.NATION]]: standardDataCountry,
  [STANDARD_URL_PARAM_MAP[EStandard.LOCAL]]: standardDataLocal,
  [STANDARD_URL_PARAM_MAP[EStandard.GROUP]]: standardDataGroup,
}
