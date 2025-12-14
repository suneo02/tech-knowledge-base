import { IEnterpriseStrategicEmergingIndustry } from '@/api/corp/info/otherInfo'
import { ApiResponse } from '@/api/types'
import { CorpBasicNum, CorpBasicNumBeneficial, CorpBasicNumStock } from 'gel-types'

export type CorpInfoApiPaths = {
  'detail/company/getstrategicemergingindustry': {
    params: {
      companyCode: string
      pageNo: number
      pageSize: number
    }
    response: ApiResponse<IEnterpriseStrategicEmergingIndustry[]>
  }
  'detail/company/getentbasicnum': {
    params: {
      type?: 'beneficial' | 'stock'
    }
    response: ApiResponse<CorpBasicNum | CorpBasicNumStock | CorpBasicNumBeneficial>
  }
}
