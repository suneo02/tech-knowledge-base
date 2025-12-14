export interface DetachGraphProps {
  companyCode: string
  waterMask: string
  filter?: any
  config?: any
  saveImgName?: string
  width?: number
  height?: number
  apiParams?: any
  graphMenuType?: string
  linkSourceRIME?: boolean
  enableFit?: boolean
}

export interface MulitListItem {
  id: string
  name: string
  key: number
}
