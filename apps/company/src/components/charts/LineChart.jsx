import React, { useState, useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TooltipComponent, CanvasRenderer, GridComponent, LineChart])

const LineChartComponent = ({ opts }) => {
  const chartRef = useRef(null)
  const { data, indicator, style, tooltipHide, tooltipPos, centerTxt, centerTxtFontSize } = opts
  useEffect(() => {
    const chart = echarts.init(chartRef.current)
    if (data) {
      const xData = data.xData
      const yData = data.yData
      chart.setOption({
        xAxis: {
          type: 'category',
          data: xData,
        },
        yAxis: {
          scale: true,
          type: 'value',
        },
        series: [
          {
            type: 'line',
            data: yData,
            smooth: true,
          },
        ],
      })
    }
    return () => {
      chart.dispose()
    }
  }, [data])

  return <div ref={chartRef} style={{ width: '100%', height: '100%', background: '#fff', ...style }} className={` chart-line ${opts.css || ''} `}></div>
}

export default LineChartComponent
