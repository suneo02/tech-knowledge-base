import { CorpCardInfo } from 'gel-types'
import { createContext } from 'react'

export interface ICompanyDetailCtx {
  corpCode?: string
  basicInfo: Partial<CorpCardInfo>
}
// 创建上下文
export const CompanyDetailContext = createContext<ICompanyDetailCtx>({
  basicInfo: {},
})
