import { type ReactElement } from 'react'

interface ChartProps {
  data: Array<Record<string, string | number>>
  xField?: string
  yField?: string
  seriesField?: string
  angleField?: string
  colorField?: string
  radius?: number
  label?: Record<string, string | number | boolean>
  color?: string
  title?: {
    text: string
    style?: Record<string, string | number>
  }
  legend?:
    | boolean
    | {
        position: 'top' | 'bottom' | 'left' | 'right'
      }
  xAxis?: {
    title?: { text: string }
  }
  yAxis?: {
    title?: { text: string }
  }
}

export const Line = (props: ChartProps): ReactElement => (
  <div data-testid="mock-line-chart">{JSON.stringify(props)}</div>
)

export const Bar = (props: ChartProps): ReactElement => <div data-testid="mock-bar-chart">{JSON.stringify(props)}</div>

export const Area = (props: ChartProps): ReactElement => (
  <div data-testid="mock-area-chart">{JSON.stringify(props)}</div>
)

export const Pie = (props: ChartProps): ReactElement => <div data-testid="mock-pie-chart">{JSON.stringify(props)}</div>
