import { ApiResponse } from '../types'

export type Platform = 'pc' | 'mobile'

export type HomePageApiPaths = {
  // 首页获取企业数量
  getcrossfilterforhome: {
    params: {
      createDate: string
      govlevel: string
      PageSize: 0
    }
    response: ApiResponse<any>
  }
  // 首页获取榜单名录数量
  corplistrecommend: {
    params: {
      PageNo: 0
    }
    response: ApiResponse<any>
  }

  'operation/get/getFunc': {
    params: {
      platform: Platform
      pageIndex: number
      pageSize: number
    }
    response: ApiResponse<
      {
        idFunc: string
        nameFunc: string
        descriptionFunc: string
        iconFunc: string
        tagsFunc: string
        typeFunc: string
      }[]
    >
  }
}
