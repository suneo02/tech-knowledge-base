// import { getServerApiByConfig } from '@/api/serverApi'
import { memo } from 'react'
import ComposeChart from './ComposeChart'
import { ChartProps } from './type'
export { ChartType, type ChartProps } from './type'

const WCB_Raw = ({ indicators, width, height, ...rest }: ChartProps) => {
  return (
    <div style={{ width: width || '100%', height: height || 300 }}>
      <ComposeChart indicators={indicators} {...rest} />
    </div>
  )
}

const WCB = memo(WCB_Raw)

WCB.displayName = 'WindChartBarOrPie'

export { WCB }
