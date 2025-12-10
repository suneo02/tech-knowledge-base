import { myWfcAjax } from '@/api/common.ts'

export type TCorpTechScoreReport = {
  companyCode: string // 公司代码
  report: string // 报告日期
  innovateScore: number // 创新得分
  influenceScore?: number // 影响力得分（可选）
  strengthScore?: number // 实力得分（可选）
  qualityScore?: number // 质量得分（可选）
  scaleScore?: number // 规模得分（可选）
  layoutScore?: number // 布局得分（可选）
}[]

export const apiCustomShareholderPenetrationReport = ({ phone, email }) => {
  return myWfcAjax('operation/get/EPRCustomized', undefined, {
    phone,
    email,
  })
}

export const apiGetTechScore = (companyCode: string) => {
  return myWfcAjax<TCorpTechScoreReport>(`detail/company/technologicalScore/${companyCode}`)
}
