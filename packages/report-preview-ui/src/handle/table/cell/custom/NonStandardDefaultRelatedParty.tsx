import React from 'react'
import { TIntl } from 'report-util/types'

interface Party {
  companyName: string
  [key: string]: any
}

/**
 *
 * @param txt
 * @param _row
 * @returns
 */
export const renderNonStandardDefaultRelatedParty = (
  t: TIntl,
  txt: Record<string, Party[]> | undefined,
  _row: any
): React.ReactNode => {
  if (!txt) return ''
  const partiesArr: Party[] = []
  Object.keys(txt).forEach((item) => {
    if (txt[item]) {
      txt[item].forEach((itemChild) => {
        partiesArr.push(itemChild)
      })
    }
  })
  if (!partiesArr.length) return ''
  return <span className="parties-tooltip">{`${t('4600', '担保人')}: ${partiesArr[0].companyName}`}</span>
}
