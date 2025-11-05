import { myWfcAjax } from '@/api/common.ts'
import { useAsync } from '@/utils/api'
import { XxIndustry } from './basicInfo'
import { ApiResponse } from '@/api/types.ts'

export type THKModuleType = 'companyInfo'
//
/**
 * 香港代查 公司信息下子模块 cmd
 * @description 表示公司相关信息的类型，用于区分不同类别的公司数据。
 */
export type HKCompanyInfoSubModule =
  | 'equityStructure' // 股权结构：表示公司的股权分配和所有权结构信息
  | 'shareholderInfo' // 股东信息：表示公司的股东详情，包括股东姓名、持股比例等
  | 'directorInfo' // 董事信息：表示公司的董事会成员信息，包括董事姓名、职位等
  | 'secretaryInfo' // 秘书信息：表示公司的秘书信息，包括秘书姓名、联系方式等

export type ICorpPurchaseData = {
  // 0 = 未购买, 1 = 初次购买但未处理, 2 = 已购买且处理完成, 3 = 再次购买 处理中
  processingStatus: 0 | 1 | 2 | 3
  dataModule: THKModuleType
  childDataModule: HKCompanyInfoSubModule[]
  lastedProcessTime: string // 数据的最后更新时间 时间戳
}

export interface ICorpOtherInfo {
  isCollect: true
  isObjection?: string
  userPurchaseInfo?: ICorpPurchaseData[]
}

// 获取企业是否收藏、是否异议处理中标识
export const getCorpOtherInfo = (companyCode: string): Promise<ApiResponse<ICorpOtherInfo>> => {
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
