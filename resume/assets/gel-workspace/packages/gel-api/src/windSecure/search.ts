/**
 * 榜单名录
 *
 */
export type FeturedSearchResponse = {
  _score: number
  category: string
  objectId: string
  objectName: string
  priority: number
  showOriginalName: boolean
  type: string
  updatefreq: number
}[]
