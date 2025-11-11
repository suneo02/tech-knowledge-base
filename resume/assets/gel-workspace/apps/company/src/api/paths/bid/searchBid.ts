import { ApiResponse } from '../../types'

export type SearchBidApiPaths = {
  // 招投标搜索历史 获取列表
  'operation/get/bidbrowsehistorylist': {
    params: {
      exclusiveRightId: string
    }
    response: ApiResponse<any>
  }
  // 招投标搜索历史 插入数据
  'operation/insert/bidbrowsehistoryadd': {
    params: {
      exclusiveRightId: string
    }
    response: ApiResponse<any>
  }
  // 招投标搜索历史 删除数据
  'operation/delete/bidbrowsehistorydelete': {
    params: {
      exclusiveRightId: string
    }
    response: ApiResponse<any>
  }
  // 招投标搜索历史 删除所有数据
  'operation/delete/bidbrowsehistorydeleteall': {
    params: {
      exclusiveRightId: string
    }
    response: ApiResponse<any>
  }
}
