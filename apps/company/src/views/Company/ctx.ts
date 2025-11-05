import { createContext } from 'react'
import { ICorpCardInfo } from '@/api/corp/info/cardInfo.ts'

export interface ICompanyDetailCtx {
  corpCode?: string
  basicInfo: Partial<ICorpCardInfo>
}
// 创建上下文
export const CompanyDetailContext = createContext<ICompanyDetailCtx>({
  basicInfo: {},
})
