import React from 'react'
import { Spin } from '@wind/wind-ui'
import './index.less'

const SpinLoading = () => {
  return <Spin tip="Loading..." className="graph-view-spin-loading"></Spin>
}

export default SpinLoading
