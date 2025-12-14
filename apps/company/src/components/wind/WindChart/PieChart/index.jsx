import { WCBChart } from '@wind/chart-builder'
import defaultThemeObj from '@wind/chart-builder/lib/themes/standard/wind.characteristic.theme.json'
import React, { memo } from 'react'
/**
 * @param props.params // 传参
 * @param props.meta // 基础信息
 * @param props.data // 数据
 */
const PieChart = memo(function (props) {
  const { meta, hideLabel, hideLegend, chartData, shape, ...rest } = props

  const defaultData = {
    chart: {
      categoryAxisDataType: 'category',
    },
    config: {
      layoutConfig: {
        isSingleSeries: true,
      },
      series: {
        '0:0-series-0': {
          pie:
            shape !== 'rose'
              ? {
                  radius:
                    props.size === 'small'
                      ? [shape === 'ring' ? '20%' : '0%', '50%']
                      : [shape === 'ring' ? '45%' : '0', '75%'],
                  label: {
                    show: !hideLabel,
                  },
                }
              : {
                  radius: ['0%', '75%'],
                  center: ['50%', '50%'],
                  roseType: 'area',
                  label: {
                    show: !hideLabel,
                  },
                },
        },
      },
      legend: {
        show: !hideLegend,
        position: props.position || 'bottom',
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
      lang={window.en_access_config ? 'en' : 'cn'}
      defaultTheme={{ name: 'wind.characteristic', data: defaultThemeObj }}
      waterMark={false}
      data={{
        ...defaultData,
        indicators: [
          {
            meta: {
              type: 'pie',
              uuid: '0',
              ...meta,
            },
            data: chartData,
          },
        ],
      }}
      {...rest}
    />
  )
})

export default PieChart
