import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import './index.less'

import { usePageTitle } from '../../handle/siteTitle'
import { parseQueryString } from '../../lib/utils'
import { useSingleDynamicStore } from './../../store/singleCompanyDynamic'
import CorpHeaderCard from './CorpHeaderCard'
import DynamicFilter from './DynamicFilter'

function SingleCompanyDynamic(props) {
  const qsParam = parseQueryString()
  let companycode = qsParam['companycode']
  const { location, history } = props
  let { id } = parseQueryString()

  const { corp, dynamicList, initStore, getcorpbasicinfo, getDynamicList } = useSingleDynamicStore()

  usePageTitle('CompanyDynamicsDetail', corp?.corp_name)
  useEffect(() => {
    getcorpbasicinfo(companycode)
  }, [])

  return (
    <div className="singleCompanyDynamic">
      <CorpHeaderCard data={corp} />

      <DynamicFilter companycode={companycode}></DynamicFilter>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleCompanyDynamic)
