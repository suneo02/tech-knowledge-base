import { ApiResponseForWFC } from '@/types'
import { PatentBasicNumData } from 'gel-types'

export interface wfcCorpIntellectualApiPath {
  'detail/company/patent_statistical_number': {
    response: ApiResponseForWFC<PatentBasicNumData>
  }
}
