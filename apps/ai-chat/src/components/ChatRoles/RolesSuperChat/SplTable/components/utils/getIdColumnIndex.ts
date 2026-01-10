import { COMPANY_CODE_TITLE, COMPANY_NAME_TITLE } from '../constants'
import type { HeaderItem } from '../types'

const findIndexByColumnId = (headers: HeaderItem[], colId: string | number): number =>
  headers.findIndex((h) => String(h.columnId) === String(colId))

export const getIdColumnIndex = (headers: HeaderItem[], header: HeaderItem): number | null => {
  const companyCodeIndex = headers.findIndex((h) => h.title === COMPANY_CODE_TITLE)

  if (header.title === COMPANY_NAME_TITLE && companyCodeIndex !== -1) {
    return companyCodeIndex
  }

  if (header.linkToIdColumn) {
    const linkTo = header.linkToIdColumn
    if (typeof linkTo === 'string' || typeof linkTo === 'number') {
      const idx = findIndexByColumnId(headers, linkTo)
      return idx !== -1 ? idx : null
    }
    return companyCodeIndex !== -1 ? companyCodeIndex : null
  }

  return null
}
