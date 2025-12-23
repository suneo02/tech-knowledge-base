import React from 'react'
import Charts from '../index'
import { getUrlSearchValue } from 'gel-util/common'
import { GRAPH_LINKSOURCE, GRAPH_MENU_TYPE } from '../types'
import ShareInvestChart from '../ShareInvestChart'

const SingleShareInvestChart = (onlyChart = false) => {
  const linksource = getUrlSearchValue('linksource')
  const isF9 = linksource === GRAPH_LINKSOURCE.F9

  return (
    <>
      {isF9 || onlyChart ? (
        <Charts activeMenu={GRAPH_MENU_TYPE.EQUITY_PENETRATION} hideMenu={true} hideOperator={true}></Charts>
      ) : (
        <ShareInvestChart></ShareInvestChart>
      )}
    </>
  )
}
export default SingleShareInvestChart
