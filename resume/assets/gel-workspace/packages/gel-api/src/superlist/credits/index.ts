import { ApiResponseForWFC } from '@/types'
import { GetPointsChangeListRequest, GetPointsChangeListResponse, GetUserPointsInfoResponse } from './type'

export * from '../../wfc/super/domains/sheet/addDataToSheet'
export * from './type'

/** 积分管理 */
export interface superlistCreditsApiPathMap {
  /**
   * 积分变更记录列表
   */
  'points/getPointsChangeList': {
    data: GetPointsChangeListRequest
    response: ApiResponseForWFC<GetPointsChangeListResponse>
  }
  /**
   * 用户剩余积分
   */
  'points/getUserPointsInfo': {
    data: {}
    response: ApiResponseForWFC<GetUserPointsInfoResponse>
  }
}
