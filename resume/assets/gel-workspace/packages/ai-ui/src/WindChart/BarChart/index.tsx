import { WCBChart } from '@wind/chart-builder'
import defaultThemeObj from '@wind/chart-builder/lib/themes/standard/wind.characteristic.theme.json'
import { isEn } from 'gel-util/intl'
import { memo } from 'react'
type BarChartProps = {
  indicators: any[]
}
const BarChart = memo(function ({ indicators, ...rest }: BarChartProps) {
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
      lang={isEn() ? 'en' : 'cn'}
      defaultTheme={{ name: 'wind.characteristic', data: defaultThemeObj }}
      data={{
        ...defaultData,
        indicators: indicators,
      }}
      {...rest}
    />
  )
})

export default BarChart
