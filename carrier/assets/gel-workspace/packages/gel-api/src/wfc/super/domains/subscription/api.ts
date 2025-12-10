import { ApiResponseForWFC } from '@/types'
import { SUPER_API_PATHS } from '../../shared/constants'
import {
  DisableCDENewCompanyNoticeRequest,
  DisableCDENewCompanyNoticeResponse,
  GetCDENewCompanyRequest,
  GetCDENewCompanyResponse,
  GetSubscriptionListRequest,
  GetSubscriptionListResponse,
  UpdateSubscriptionRequest,
  UpdateSubscriptionResponse,
} from './types'

/**
 * 订阅领域 API 路径映射
 */
export interface SubscriptionApiPathMap {
  [SUPER_API_PATHS.GET_SUB_SUPER_LIST_CRITERION]: {
    data: GetSubscriptionListRequest
    response: ApiResponseForWFC<GetSubscriptionListResponse>
  }
  [SUPER_API_PATHS.UPDATE_SUB_SUPER_LIST_CRITERION]: {
    data: UpdateSubscriptionRequest
    response: ApiResponseForWFC<UpdateSubscriptionResponse>
  }
  [SUPER_API_PATHS.GET_CDE_NEW_COMPANY]: {
    data: GetCDENewCompanyRequest
    response: ApiResponseForWFC<GetCDENewCompanyResponse>
  }
  [SUPER_API_PATHS.DISABLE_CDE_NEW_COMPANY_NOTICE]: {
    data: DisableCDENewCompanyNoticeRequest
    response: ApiResponseForWFC<DisableCDENewCompanyNoticeResponse>
  }
}
