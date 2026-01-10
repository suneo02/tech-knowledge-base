interface BaseAction<T extends string, P = any> {
  type: T
  data: P
}

export type GetMySusListAction = BaseAction<
  'GET_MYSUSLIST',
  {
    code: string
    data: {
      records: any[]
      mail?: string
    }
    pageNum?: number
  }
>

export type GetSeenListAction = BaseAction<
  'GET_SEENLIST',
  {
    code: string
    data: {
      list?: any[]
    }
    pageNum?: number
  }
>

export type GetFellowListAction = BaseAction<
  'GET_FELLOWLIST',
  {
    code: string
    data: {
      list?: any[]
    }
    pageNum?: number
  }
>

export type QueryUserIndustriesAction = BaseAction<
  'QUERY_USER_INDUSTRIES',
  {
    code: string
    data: {
      company?: string
      industryList?: any[]
    }
  }
>

export type ResetFindCustomerAction = {
  type: 'RESET'
  data: undefined
}

export type FindCustomerAction =
  | GetMySusListAction
  | GetSeenListAction
  | GetFellowListAction
  | QueryUserIndustriesAction
  | ResetFindCustomerAction
