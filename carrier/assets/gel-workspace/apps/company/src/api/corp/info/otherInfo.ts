import { myWfcAjax } from '@/api/common.ts'
import { ApiResponse } from '@/api/types'
import { useAsync } from '@/utils/api'
import { CorpOtherInfo } from 'gel-types'
import { XxIndustry } from './basicInfo'

// 获取企业是否收藏、是否异议处理中标识
export const getCorpOtherInfo = (companyCode: string): Promise<ApiResponse<CorpOtherInfo>> => {
  return myWfcAjax('operation/insert/getOtherInfo', {
    companyCode,
  })
}

export const useGetCorpOtherInfo = () => {
  const [execute, data] = useAsync(getCorpOtherInfo)
  return {
    execute,
    data,
  }
}

// 企业 战新 产业
export type IEnterpriseStrategicEmergingIndustry = {
  industry: ({
    finalIndustryCode: number
    industryCode: number
    level: number
    rank: number
  } & Pick<XxIndustry, 'industryName' | 'windId'>)[]
  rank: number // 关联度
}
