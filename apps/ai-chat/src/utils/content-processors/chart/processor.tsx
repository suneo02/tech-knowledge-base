import type { ChartData } from './types'
import { hasChart, parseChart } from './parser'
import { ChartComponent } from './component'
import { createProcessor } from '../processor'

/**
 * 图表处理器
 */
export const chartProcessor = createProcessor<ChartData>({
  name: 'chart',
  check: hasChart,
  parse: (text: string) => {
    const result = parseChart(text)
    if (!result) return null

    // 获取图表前后的文本
    const beforeText = text.substring(0, result.position.start)
    const afterText = text.substring(result.position.end)

    return {
      data: result.data,
      position: result.position,
      beforeText,
      afterText,
    }
  },
  render: (data) => <ChartComponent chartData={data} />,
})
