import { ApiResponseForWFC } from '@/types'
import { IndustrySectorItem } from 'gel-types'

export interface wfcCorpNodeApiPath {
  'detail/company/getcorpindustry': {
    response: ApiResponseForWFC<IndustrySectorItem[]>
  }
}
