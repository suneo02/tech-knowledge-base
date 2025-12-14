import { requestToWFCSuperlistFcs } from '@/api'
import { AiModelEnum, AiToolEnum } from 'gel-api'

interface PrecheckRunAllPointsOptions {
  sheetId: number
  aiModel?: AiModelEnum | number | string
  tool?: Record<AiToolEnum, object>
}

export const precheckRunAllPoints = async ({ sheetId, aiModel, tool }: PrecheckRunAllPointsOptions) => {
  try {
    const { Data } = await requestToWFCSuperlistFcs('superlist/excel/customerPointCountByAIColumn', {
      sheetId,
      aiModel: (aiModel as AiModelEnum) ?? AiModelEnum.ALICE,
      tool: tool ?? {},
    })
    return typeof Data?.pointTotal === 'number' ? Data.pointTotal : null
  } catch {
    return null
  }
}

export default precheckRunAllPoints
