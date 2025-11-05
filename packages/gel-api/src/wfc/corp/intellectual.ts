import { PatentBasicNumData } from 'gel-types'
import { ApiResponseForWFC } from '../type'

export interface wfcCorpIntellectualApiPath {
  'detail/company/patent_statistical_number': {
    response: ApiResponseForWFC<PatentBasicNumData>
  }
}
