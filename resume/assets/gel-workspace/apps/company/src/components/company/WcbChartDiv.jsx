import React from 'react'
import { WCBChart } from '@wind/chart-builder'

function WCBChartDiv(props) {
  // 企业详情中用到的 WCBChart 太大，用于外部调用时做lazy加载处理
  return <WCBChart data={props.data} waterMark={false} style={{ height: 400 }} />
}

export default WCBChartDiv
