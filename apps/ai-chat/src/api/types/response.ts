// TODO 最新使用的规范 需要调整 先提供给后端
export interface ApiResponseForTable<T> {
  result: {
    pagination: {
      total: number
      current: number
      pageSize: number
    }
    data: T // 所有的数据放这里面
  }
  Data?: T
  message: string // 失败对应的消息提示
  code: number // 200 默认成功
}

export interface KnownError<T> {
  errorCode: string
  errorMessage: string
  data?: T
}
