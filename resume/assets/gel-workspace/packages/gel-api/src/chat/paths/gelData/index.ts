import { GelCardTypeEnum } from './card'
export * from './card'
export * from './table'

export type GelData = {
  type: GelCardTypeEnum

  total: number
  data: {
    1: number
    person: number
  }[]
  params: {
    companyCode: string
    companyName: string
  }
}
