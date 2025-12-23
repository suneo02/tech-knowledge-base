import { RadarChart } from 'echarts/charts'
import { GraphicComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect, useRef } from 'react'

echarts.use([TooltipComponent, CanvasRenderer, GraphicComponent, RadarChart])

export const RadarChartComponent = ({ opts }) => {
  const chartRef = useRef(null)
  const chart = useRef(null)
  const { data, indicator, style, tooltipHide, tooltipPos, centerTxt, centerTxtFontSize, radarClick } = opts
  useEffect(() => {
    chart.current = echarts.init(chartRef.current)
    const radar = {
      indicator,
      ...opts.radarExtras,
    }

    if (data?.length && indicator?.length) {
      chart.current.setOption({
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

    chart.current.on('click', (params) => {
      if (params?.componentType === 'series') {
        radarClick && radarClick.call()
      }
    })

    return () => {
      chart.current.dispose()
    }
  }, [data, indicator])

  return (
    <div
      ref={chartRef}
      style={{
        width: '120px',
        height: '100%',
        background: '#fff',
        ...style,
      }}
      className={` chart-radar ${opts.css || ''} `}
    ></div>
  )
}
