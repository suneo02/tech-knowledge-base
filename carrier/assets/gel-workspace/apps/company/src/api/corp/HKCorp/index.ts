import { IPagParam } from '@/api/types.ts'
import { HKCompanyInfoSubModule, THKModuleType } from 'gel-types'
export type IHKCorpPayload = IPagParam & {
  companyCode: string
  dataModule: THKModuleType
  childDataModule: HKCompanyInfoSubModule
}

// 股权结构参数定义
interface IHKCorpEquityStructure {
  totalIssuedAmount: number // 已发行总款额
  paidAmount: number // 已缴款额
}

// 股东信息参数定义
interface IHKCorpShareholderInfo {
  shareholderName: string // 股东名称
  holdingCategory: string // 持股类别
  holdingQuantity: number // 持股数（股）
  holdingRatio: number // 占同类股比例
  address: string // 地址
}

// 董事信息参数定义
interface IHKCorpDirectorInfo {
  name: string // 姓名/名称
  directorCategory: string // 董事类别
  identificationNumber: string // 证件号码/唯一业务识别码
  numberType: string // 号码类型
}

// 秘书信息参数定义
interface IHKCorpSecretaryInfo {
  name: string // 姓名/名称
  secretaryCategory: string // 秘书类别
  identificationNumber: string // 证件号码/唯一业务识别码
  numberType: string // 号码类型
  address: string // 地址
  appointmentDate: Date // 委任日期
}

// 通用响应数据类型
export type IHKCorpInfoData =
  | IHKCorpEquityStructure[] // 股权结构数据
  | IHKCorpShareholderInfo[] // 股东信息数据
  | IHKCorpDirectorInfo[] // 董事信息数据
  | IHKCorpSecretaryInfo[] // 秘书信息数据

export const hkCorpInfoSubModuleCMDList: HKCompanyInfoSubModule[] = [
  'equityStructure',
  'shareholderInfo',
  'directorInfo',
  'secretaryInfo',
]
