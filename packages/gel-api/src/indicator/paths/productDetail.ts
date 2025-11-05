export const indicatorProductDetailPath = 'product/detail' as const

export interface IndicatorProductDetailRes {
  detailType: string
  downloadUrl: string
  matchCount: number
  matchCountWithDay: {
    VIP: number
    SVIP: number
  }
  matchReportCount: number
  pathIndicatorIds: number[]
  permissionDescription: string
  permissionDescriptionEn: string
  productId: number
  productName: string
  reportParentId: number
}
