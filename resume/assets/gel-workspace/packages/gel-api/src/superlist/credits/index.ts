import { ApiResponseForChat } from '@/chat'
import { GetPointsChangeListRequest, GetPointsChangeListResponse, GetUserPointsInfoResponse } from './type'

export * from '../../wfc/super/addDataToSheet'
export * from './type'

/** 积分管理 */
export interface superlistCreditsApiPathMap {
  /**
   * 积分变更记录列表
   */
  'points/getPointsChangeList': {
    data: GetPointsChangeListRequest
    response: ApiResponseForChat<GetPointsChangeListResponse>
  }
  /**
   * 用户剩余积分
   */
  'points/getUserPointsInfo': {
    data: {}
    response: ApiResponseForChat<GetUserPointsInfoResponse>
  }
}
