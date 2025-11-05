// 收藏相关接口

import { ApiResponseForWFC } from '../type'

export interface wfcCorpCollectApiPath {
  // 删除收藏
  'operation/delete/deleteCustomer': {
    data: {
      termTyp?: string
      groupId?: string
      entityID: string | number // 删除id组
    }
    response: ApiResponseForWFC<boolean>
  }

  // 添加收藏
  'operation/insert/addtomycustomer': {
    data: {
      termTyp?: string
      groupIdArray?: string
      entityID: string // 删除id组
    }
    response: ApiResponseForWFC<boolean>
  }
}
