import { ApiResponse } from '../types'

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
}
