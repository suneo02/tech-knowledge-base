// 实体信息
export interface ChatEntityRecognize {
  key: string
  name: string
  code: string
  type: 'company' // 可以根据实际需要扩展类型
}

export interface WithEntities {
  entities: ChatEntityRecognize[]
}
