import { IEnterpriseStrategicEmergingIndustry } from '@/api/corp/info/otherInfo'
import { ApiResponse } from '@/api/types'

export type CorpInfoApiPaths = {
  'detail/company/getstrategicemergingindustry': {
    params: {
      companyCode: string
      pageNo: number
      pageSize: number
    }
    response: ApiResponse<IEnterpriseStrategicEmergingIndustry[]>
  }
}
