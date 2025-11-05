import { CorpBasicInfo, CorpBasicNum, CorpOtherInfo } from 'gel-types'
import { ApiResponseForWFC } from '../type'

export interface wfcCorpInfoApiPath {
  'detail/company/getcorpbasicinfo_basic': {
    response: ApiResponseForWFC<CorpBasicInfo>
  }
  'detail/company/getentbasicnum': {
    response: ApiResponseForWFC<CorpBasicNum>
  }
  'operation/insert/getOtherInfo': {
    response: ApiResponseForWFC<CorpOtherInfo>
    data: {
      companyCode: string
    }
  }
}
