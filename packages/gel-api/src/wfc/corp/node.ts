import { IndustrySectorItem } from 'gel-types'
import { ApiResponseForWFC } from '../type'

export interface wfcCorpNodeApiPath {
  'detail/company/getcorpindustry': {
    response: ApiResponseForWFC<IndustrySectorItem[]>
  }
}
