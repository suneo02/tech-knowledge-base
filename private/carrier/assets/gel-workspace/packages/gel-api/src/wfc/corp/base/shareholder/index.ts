/**
 * 企业详情-股东信息-公示信息
 */

export enum EBJEEShareholderSource {
  BJEE_SHANGHAI = '35827361198',
  BJEE_BEIJING = '35827361197',
}

export type CorpBJEEShareholder = {
  actContrl: boolean
  benifciary: boolean
  number: number
  percentage: number
  participation?: string
  shareRoute: string[]
  shareholder: string
  shareholderId: string
  shareholderType: string
  source: EBJEEShareholderSource
}
