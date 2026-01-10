import { pointBuriedByModule } from '@/api/pointBuried/bury'
import { wftCommon } from '@/utils/utils'
import { CorpEsgScore } from 'gel-api'
import { isValidEsgInfo } from 'gel-ui'
import { isArray } from 'lodash'

export const redirectChartFun = (t) => {
  if (t?.bury?.id) {
    pointBuriedByModule(t.bury.id)
  }
  wftCommon.jumpJqueryPage(t.url)
}

/**
 * @returns [科创分， 舆情， esg， 动态/舆情/商机]
 */
export const getCorpRiskRowSpan = (
  showTechScore: boolean,
  esgInfo: CorpEsgScore[],
  showKGChartInRowFirst: boolean
): {
  techScore?: number
  risk?: number
  esg?: number
  dynamic: number
} => {
  const showEsg = esgInfo && isArray(esgInfo) && esgInfo.length > 0 && isValidEsgInfo(esgInfo[0])
  if (showKGChartInRowFirst) {
    return {
      dynamic: 16,
    }
  }
  if (showTechScore) {
    if (showEsg) {
      return {
        techScore: 4,
        risk: 4,
        esg: 4,
        dynamic: 12,
      }
    } else {
      return {
        techScore: 4,
        risk: 4,
        dynamic: 16,
      }
    }
  } else {
    if (showEsg) {
      return {
        risk: 4,
        esg: 4,
        dynamic: 16,
      }
    } else {
      return {
        risk: 8,
        dynamic: 16,
      }
    }
  }
}
