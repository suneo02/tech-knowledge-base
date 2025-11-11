import { ApiResponseForWFC } from '@/types'
import { CorpBasicInfo, CorpBasicNum, CorpBasicNumBeneficial, CorpBasicNumStock, CorpOtherInfo } from 'gel-types'

export interface wfcCorpInfoApiPath {
  'detail/company/getcorpbasicinfo_basic': {
    response: ApiResponseForWFC<CorpBasicInfo>
  }
  'detail/company/getentbasicnum': {
    params: {
      // 最终受益人 或者 股东
      type?: 'beneficial' | 'stock'
    }
    response: ApiResponseForWFC<CorpBasicNum | CorpBasicNumBeneficial | CorpBasicNumStock>
  }
  'operation/insert/getOtherInfo': {
    response: ApiResponseForWFC<CorpOtherInfo>
    data: {
      companyCode: string
    }
  }
}
