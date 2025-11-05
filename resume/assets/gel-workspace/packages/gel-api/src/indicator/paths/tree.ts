export interface IndicatorTreeIndicator {
  baseInfo: {
    unit: string | null
    dataType: string
    accuracy: string
    definition: string | null
    displaywordwarp: number
    displaylen: string
    displaylentype: number
    __typename?: 'Indicator' | 'BaseIndicatorInfo'
  }
  indicatorDisplayName: string
  key: string
  classificationId: number
  __typename: 'Indicator'
  points: number
  spId: number // 唯一键id
}

export interface IndicatorTreeClassification {
  level: number
  __typename: 'Classification'
  children?: IndicatorTreeClassification[]
  title: string
  key: number
  parentId: number
  indicators?: IndicatorTreeIndicator[]
}
export interface IndicatorTreeResponse {
  classifications: IndicatorTreeClassification[]
}
