import { pointBuriedNew } from '@/api/configApi.ts'
import { commonBuryList } from '@/api/pointBuried/config'

export const pointBuriedByModule = (
  moduleId: number,
  options?: {
    [key: string]: string
    opEntity?: string // 功能点名称
    listName?: string // 名录名称专用
    moduleName?: string // 集团系详情模块名称专用
    ruleName?: string // 企业详情模块名称专用
    tab?: string // 人物详情模块名称专用
    company_id?: string // 企业详情报告 中 企业id
    currentPage?: string
    // 数据出境整改中用到的参数 企业详情 id
    companyID?: string
  }
) => {
  try {
    if (typeof moduleId === 'string') moduleId = Number(moduleId) // 容错
    const cfg = commonBuryList.find((res) => res.moduleId === moduleId)
    const { moduleId: buryModuleId, opActive, describe } = cfg
    pointBuriedNew(buryModuleId, { opActive, opEntity: describe, ...options })
  } catch (error) {
    console.error(error)
  }
}
