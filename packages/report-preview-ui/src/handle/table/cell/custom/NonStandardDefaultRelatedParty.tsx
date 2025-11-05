import React from 'react'
import { tForRPPreview } from '../../../../utils'

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
  return <span className="parties-tooltip">{`${tForRPPreview('4600', '担保人')}: ${partiesArr[0].companyName}`}</span>
}
