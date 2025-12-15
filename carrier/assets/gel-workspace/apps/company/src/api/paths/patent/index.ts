import { ApiResponseForWFC } from 'gel-api'

export interface PatentApiPaths {
  // 专利 PDF
  'detail/patentDetail/getPatentDetailPdf': {
    params: any
    response: ApiResponseForWFC<any>
  }
  // 专利 权利要求
  'detail/patentDetail/getpatentdetailright': {
    params: any
    response: ApiResponseForWFC<any>
  }
  // 专利 说明书
  'detail/patentDetail/getpatentdetailinstruction': {
    params: any
    response: ApiResponseForWFC<any>
  }
}
