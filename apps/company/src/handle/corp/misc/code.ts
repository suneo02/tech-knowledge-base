import { parseQueryString } from '../../../lib/utils'

/**
 * 从 url 中获取 corp id
 */
export const getCorpCodeByUrl = () => {
  const qsParam = parseQueryString()
  let corpCode: string | undefined = qsParam['companycode']
  if (!corpCode) {
    corpCode = qsParam['CompanyCode']
  }
  if (!corpCode) {
    corpCode = qsParam['companyCode']
  }
  if (corpCode) {
    // 转string
    corpCode = corpCode + ''
    if (corpCode.length < 3) {
      corpCode = ''
    }
  }
  return corpCode
}
