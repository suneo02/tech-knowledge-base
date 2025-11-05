import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { GraphicComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TooltipComponent, CanvasRenderer, GraphicComponent, RadarChart])

const RadarChartComponent = ({ opts }) => {
  const chartRef = useRef(null)
  const { data, indicator, style, tooltipHide, tooltipPos, centerTxt, centerTxtFontSize, radarClick } = opts
  useEffect(() => {
    const chart = echarts.init(chartRef.current)
    const radar = {
      indicator,
      ...opts.radarExtras,
    }

    if (data?.length && indicator?.length) {
      chart.setOption({
        color: style?.color || '#00aec7',
        tooltip: {
          cursorStyle: 'default',
          trigger: 'item',
          show: tooltipHide ? false : true,
          position: tooltipPos || null, // 默认null 跟随鼠标，图形在屏幕旁边区域时，可以自行设置上下左右避免超出屏幕,如 right、bottom
        },
        radar,
        series: [
          {
            type: 'radar',
            data,
            areaStyle: opts.series?.areaStyle || {
              color: 'transparent', // color 如果不设置，将与上述边线的颜色一致
            },
          },
        ],
        graphic: {
          type: 'text',
          left: 'center',
          top: 'bottom',
          style: {
            text: centerTxt || '',
            fill: '#00aec7',
            fontSize: centerTxtFontSize || 14,
            z: 10,
          },
          cursor: 'default',
          tooltip: {
            show: false,
          },
        },
      })
    }

    chart.on('click', (params) => {
      if (params?.componentType === 'series') {
        radarClick && radarClick.call()
      }
    })

    return () => {
      chart.dispose()
    }
  }, [data, indicator])

  return (
    <div
      ref={chartRef}
      style={{ width: '120px', height: '100%', background: '#fff', ...style }}
      className={` chart-radar ${opts.css || ''} `}
    ></div>
  )
}

export default RadarChartComponent
