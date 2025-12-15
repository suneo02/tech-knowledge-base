import CompanyLink from '../../../../components/company/CompanyLink'
import { isArray } from 'lodash'
import React from 'react'

export const unitArrRender = (unit) => {
  if (isArray(unit) && unit.length > 0) {
    const htmlArr = unit.map((i) =>
      i.unitType == 483 ? <CompanyLink name={i.unitName} id={i.unitId} /> : <span>{i.unitName}</span>
    )
    return <div>{htmlArr}</div>
  } else {
    return '--'
  }
}
