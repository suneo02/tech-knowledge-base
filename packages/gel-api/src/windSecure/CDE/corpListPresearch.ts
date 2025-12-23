export interface getCorpListPresearchParams {
  cmd: 'corplistpresearch'
}

export interface getCorpListPresearchPayload {
  keyword: string
}

export interface getCorpListPresearchResponse {
  _score: number
  category: string
  objectId: string
  objectName: string
  priority: number
  showOriginalName: boolean
  type: string
  updatefreq: number
}
