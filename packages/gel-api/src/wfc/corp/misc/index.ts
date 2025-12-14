import { ApiResponseForWFC } from '@/types'

export * from './tag'

export type CorpEsgScore = {
  Rating: 'A' | 'AA' | 'AAA' | 'B' | 'BB' | 'BBB' | 'CCC'
  WindCode: string
  RatingDate: string
}

export interface wfcCorpMiscApiPath {
  'detail/company/getcorpEsgScore': {
    response: ApiResponseForWFC<CorpEsgScore[]>
  }
}
