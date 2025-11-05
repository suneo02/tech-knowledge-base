import React, { useState, useEffect } from 'react'
import { parseQueryString } from '../../lib/utils'
import ShareAndInvest from './ShareInvestChart'

function InvestChart(props) {
  const qsParam = parseQueryString()
  let code = props.companycode || qsParam['companycode']
  return <ShareAndInvest onlyInvestTree={true} companycode={code}></ShareAndInvest>
}

export default InvestChart
