import { ApiResponse } from '../types'

export type IntegratedCircuitLayoutParams = {
  companycode: string
}

export type IntegratedCircuitLayoutResponse = {
  list: {
    name: string
  }[]
}

export type GetIntegratedCircuitLayoutDetailParams = {
  exclusiveRightId: string
}

export type ContentItems = {
  after: {
    name: string
    windId: string
  }[]
  before: {
    name: string
    windId: string
  }[]
  content: string
  type: string
}

export type GetIntegratedCircuitLayoutDetailResponse = {
  baseInfo: {
    agency: []
    agent: []
    announcementDate: string
    announcementNumber: string
    applicationDate: string
    creationCompletionDate: string
    creator: {
      name: string
      windId: string
    }[]
    firstBusinessApplicationDate: string
    name: string

    protectionEndDate: string
    registerNumber: string
    rightsHolder: {
      name: string
      windId: string
    }[]
    waiverEffectiveDate: string
  }
  category: {
    function: string
    structure: string
    technology: string
  }
  entriesChangeRecords: {
    announcementDate: string
    changeEffectiveDate: string
    contentItems: ContentItems[]
    type: string
  }[]
  exclusiveTransferRecords: {
    announcementDate: string
    changeEffectiveDate: string
    contentItems: ContentItems[]
    type: string
  }[]
}

export type IcLayoutApiPaths = {
  // 集成电路布图 获取列表
  'detail/company/getIntegratedCircuitLayout': {
    params: IntegratedCircuitLayoutParams
    response: ApiResponse<IntegratedCircuitLayoutResponse>
  }
  // 集成电路布图相关主实体（创作人，代理人，代理机构等所有变更前后的地方会用）
  'detail/icLayout/getIntegratedCircuitLayoutDetail': {
    params: GetIntegratedCircuitLayoutDetailParams
    response: ApiResponse<GetIntegratedCircuitLayoutDetailResponse>
  }
  //   // 集成电路布图详情-基本信息
  //   'detail/icLayout/IntegratedCircuitLayoutBaseInfo': {
  //     params: any
  //     response: ApiResponse<any>
  //   }
  //   // 集成电路布图详情-种类
  //   'detail/icLayout/IntegratedCircuitLayoutCategory': {
  //     params: any
  //     response: ApiResponse<any>
  //   }
  //   // 集成电路布图详情-变更记录（按公告日期、生效日期分组）
  //   'detail/icLayout/IntegratedCircuitLayoutChangeRecord': {
  //     params: any
  //     response: ApiResponse<any>
  //   }
  //   // 集成电路布图详情-变更内容（按公告日期、生效日期分组后继续按变更内容分组，比如按权利人）
  //   'detail/icLayout/ContentItem': {
  //     params: any
  //     response: ApiResponse<any>
  //   }
}
