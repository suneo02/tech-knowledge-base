import { WCBChart } from '@wind/chart-builder'
import defaultThemeObj from '@wind/chart-builder/lib/themes/standard/wind.characteristic.theme.json'
import React, { memo } from 'react'
const BarChart = memo(function (props) {
  const { meta, chartData, hideLabel, hideLegend, ...rest } = props
  const defaultData = {
    chart: {
      categoryAxisDataType: 'category',
    },
    legend: {
      show: false,
    },
    config: {
      layoutConfig: {
        transpose: true,
        type: 'bar',
      },
      yAxis: {
        '0:0-yAxis-0': {
          axisLabel: {
            autoRotate: false,
          },
          axisTick: {
            alignWithLabel: false,
          },
        },
      },

      xAxis: {
        '0:0-xAxis-0': {
          copy: false,
        },
      },
    },
    chartConfig: {
      waterMark: false,
      copyYaxis: true,
      animation: true,
    },
  }
  return (
    <WCBChart
      waterMark={false}
      lang={window.en_access_config ? 'en' : 'cn'}
      defaultTheme={{ name: 'wind.characteristic', data: defaultThemeObj }}
      data={{
        ...defaultData,
        indicators: [
          {
            meta,
            data: chartData,
          },
        ],
      }}
      {...rest}
    />
  )
})

export default BarChart
