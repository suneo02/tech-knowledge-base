import { EnumValues } from '../../../utils/enum'

export const TerminalCommandParam = 'CommandParam'

export enum ETerminalCommandId {
  INTELLIGENT_MARKETING_BANK = '44141',
}

/**
 * @example `!CommandParam[8514,CompanyCode=${id},SubjectID=4778,grid=${target}]`
 * @param id
 * @param params
 *
 *
 */
export const getTerminalCommandLink = (
  id: EnumValues<ETerminalCommandId>,
  params?: Record<string, string>
): string | null => {
  try {
    const paramsStr = Object.entries(params || {})
      .map(([key, value]) => {
        return `${key}-${value}`
      })
      .join(',')
    return `!${TerminalCommandParam}[${id},${paramsStr}]`
  } catch (e) {
    console.error(e)
    return null
  }
}
