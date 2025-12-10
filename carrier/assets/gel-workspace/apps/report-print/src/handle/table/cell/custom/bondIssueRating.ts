import { safeToStringRender } from '@/handle/table/cell/shared'

export const renderBondIssueRating = (txt: any, record: any) => {
  return txt + '/' + safeToStringRender(record['issueCredit'])
}
