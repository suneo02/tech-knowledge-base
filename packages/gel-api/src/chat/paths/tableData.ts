export interface RefTableHeader {
  DataType: 'string' | 'double' | 'composite' // 数据类型 composite为需要跳转的
  Id: string // 表头ID
  Name: string // 表头名称
  // Magnitudes?: string //没用到
}

export interface RefTableData {
  rawSentence: string // 原始句子
  // State: string // 状态 没用到
  Headers: RefTableHeader[] // 表头
  Content: (string | number | null)[][] // 表内容
  Total: number // 总条数
  NewName: string // 新名称

  // 没用到
  // model: {
  //   Expression: string
  //   ExpendTime: string
  // }
  id: string
}
