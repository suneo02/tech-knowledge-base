import { ApiResponse } from '@/api/types'
import { CorpEsgScore } from 'gel-api'

export type CorpMiscApiPaths = {
  'detail/company/getEsgScore': {
    params: {}
    response: ApiResponse<CorpEsgScore[]>
  }
}
