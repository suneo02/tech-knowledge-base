declare module '@wind/chart-builder' {
  import type { FC, CSSProperties } from 'react'

  export interface WCBChartProps {
    option: Record<string, unknown>
    style?: CSSProperties
    className?: string
    theme?: string
    notMerge?: boolean
    lazyUpdate?: boolean
    onEvents?: Record<string, (...args: unknown[]) => void>
  }

  const WCBChart: FC<WCBChartProps>
  export default WCBChart
}

declare module '@wind/chart-builder' {
  import type { FC, CSSProperties } from 'react'

  export interface WCBChartProps {
    option: Record<string, unknown>
    style?: CSSProperties
    className?: string
    theme?: string
    notMerge?: boolean
    lazyUpdate?: boolean
    onEvents?: Record<string, (...args: unknown[]) => void>
  }

  const WCBChart: FC<WCBChartProps>
  export default WCBChart
}
