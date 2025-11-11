// 获取企业详情头部信息
import { myWfcAjax } from '@/api/common.ts'
import { CorpCardInfo } from 'gel-types'

export const getCorpHeaderInfo = (id: string) => {
  return myWfcAjax<CorpCardInfo>(`detail/company/getcorpbasicinfo_card/${id}`)
}
