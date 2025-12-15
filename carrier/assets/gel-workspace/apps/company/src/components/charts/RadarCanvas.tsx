import React, { useEffect, useRef } from 'react'
import { ErrorBoundary } from 'gel-ui'

// 雷达图配置选项接口
interface RadarChartOptions {
  maxValue?: number
  levels?: number
  sides?: number
  gridColor?: string
  axisColor?: string
  dataColor?: string
  dataStrokeColor?: string
  pointColor?: string
  pointRadius?: number
  lineWidth?: number
  labels?: string[]
  labelColor?: string
  labelFont?: string
  centerText?: string
  centerTextColor?: string
  centerTextFont?: string
}

// 数据点接口
interface DataPoint {
  x: number
  y: number
  value: number
}

// 坐标点接口
interface Point {
  x: number
  y: number
}

// 高DPI设置返回值接口
interface HighDPIResult {
  displayWidth: number
  displayHeight: number
}

// 指标配置接口
interface Indicator {
  name?: string
  max?: number
}

// 数据项接口
interface DataItem {
  value: number[]
  name?: string
}

// 系列样式接口
interface SeriesStyle {
  areaStyle?: {
    color?: string
  }
}

// 样式接口
interface StyleConfig {
  width?: string
  height?: string
  color?: string
  [key: string]: any
}

// 组件Props接口
interface RadarCanvasProps {
  opts: {
    data?: DataItem[]
    indicator?: Indicator[]
    style?: StyleConfig
    tooltipHide?: boolean
    tooltipPos?: string | null
    centerTxt?: string
    centerTxtFontSize?: number
    radarClick?: () => void
    radarExtras?: Partial<RadarChartOptions>
    series?: SeriesStyle
    css?: string
  }
}

/**
 * Canvas 雷达图类
 */
class RadarChart {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  public centerX: number
  public centerY: number
  public radius: number
  public options: Required<RadarChartOptions>

  constructor(canvasElement: HTMLCanvasElement, options: Partial<RadarChartOptions> = {}) {
    this.canvas = canvasElement
    const context = this.canvas.getContext('2d')
    if (!context) {
      throw new Error('Unable to get 2D context from canvas')
    }
    this.ctx = context

    // 处理高DPI屏幕，解决模糊问题
    const { displayWidth, displayHeight } = this.setupHighDPI()

    this.centerX = displayWidth / 2
    this.centerY = displayHeight / 2
    this.radius = Math.min(this.centerX, this.centerY) - 15 // 增大图形尺寸，为下方文字留出适当空间

    // 默认配置
    this.options = {
      maxValue: 100, // 最大值
      levels: 5, // 网格层数
      sides: 5, // 边数
      gridColor: '#e0e0e0', // 网格颜色
      axisColor: '#ccc', // 坐标轴颜色
      dataColor: 'rgba(0, 174, 199, 0.3)', // 数据区域填充颜色
      dataStrokeColor: '#00aec7', // 数据区域边框颜色
      pointColor: '#00aec7', // 数据点颜色
      pointRadius: 4, // 数据点半径
      lineWidth: 2, // 数据线宽度
      labels: [], // 标签数组
      labelColor: '#666', // 标签颜色
      labelFont: '12px Arial', // 标签字体
      centerText: '', // 中心文字
      centerTextColor: '#00aec7', // 中心文字颜色
      centerTextFont: '14px Arial', // 中心文字字体
      ...options,
    }
  }

  /**
   * 设置高DPI支持，解决Canvas模糊问题
   */
  private setupHighDPI(): HighDPIResult {
    const devicePixelRatio = window.devicePixelRatio || 1
    const rect = this.canvas.getBoundingClientRect()

    const displayWidth = rect.width
    const displayHeight = rect.height

    // 设置Canvas实际尺寸（考虑设备像素比）
    this.canvas.width = displayWidth * devicePixelRatio
    this.canvas.height = displayHeight * devicePixelRatio

    // 设置Canvas显示尺寸
    this.canvas.style.width = displayWidth + 'px'
    this.canvas.style.height = displayHeight + 'px'

    // 缩放绘图上下文以匹配设备像素比
    this.ctx.scale(devicePixelRatio, devicePixelRatio)

    // 启用平滑渲染
    this.ctx.imageSmoothingEnabled = true
    // @ts-ignore - textRenderingOptimization 可能不存在于所有浏览器
    if (this.ctx.textRenderingOptimization) {
      // @ts-ignore
      this.ctx.textRenderingOptimization = 'optimizeQuality'
    }

    return { displayWidth, displayHeight }
  }

  /**
   * 将极坐标转换为直角坐标
   */
  private polarToCartesian(angle: number, radius: number): Point {
    const x = this.centerX + radius * Math.cos(angle)
    const y = this.centerY + radius * Math.sin(angle)
    return { x, y }
  }

  /**
   * 绘制网格线
   */
  private drawGrid(): void {
    this.ctx.strokeStyle = this.options.gridColor
    this.ctx.lineWidth = 1

    // 绘制同心多边形
    for (let level = 1; level <= this.options.levels; level++) {
      const levelRadius = (this.radius / this.options.levels) * level

      this.ctx.beginPath()
      for (let side = 0; side < this.options.sides; side++) {
        // 修改角度计算，让顺序与ECharts一致（逆时针方向）
        const angle = (-side * 2 * Math.PI) / this.options.sides - Math.PI / 2
        const point = this.polarToCartesian(angle, levelRadius)

        if (side === 0) {
          this.ctx.moveTo(point.x, point.y)
        } else {
          this.ctx.lineTo(point.x, point.y)
        }
      }
      this.ctx.closePath()
      this.ctx.stroke()
    }
  }

  /**
   * 绘制坐标轴
   */
  private drawAxes(): void {
    this.ctx.strokeStyle = this.options.axisColor
    this.ctx.lineWidth = 1

    for (let side = 0; side < this.options.sides; side++) {
      // 修改角度计算，让顺序与ECharts一致（逆时针方向）
      const angle = (-side * 2 * Math.PI) / this.options.sides - Math.PI / 2
      const endPoint = this.polarToCartesian(angle, this.radius)

      this.ctx.beginPath()
      this.ctx.moveTo(this.centerX, this.centerY)
      this.ctx.lineTo(endPoint.x, endPoint.y)
      this.ctx.stroke()
    }
  }

  /**
   * 绘制标签 - 已禁用以获得更清晰的显示效果
   */
  private drawLabels(): void {
    // 不绘制标签，让雷达图显示更清楚、更大
    return
  }

  /**
   * 绘制中心文字 - 显示在五角形下方
   */
  private drawCenterText(): void {
    if (!this.options.centerText) {
      return
    }

    this.ctx.fillStyle = this.options.centerTextColor
    this.ctx.font = this.options.centerTextFont
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'top'

    // 在五角形下方显示文字，距离图形2px
    const textY = this.centerY + this.radius + 2
    this.ctx.fillText(this.options.centerText, this.centerX, textY)
  }

  /**
   * 绘制数据区域
   */
  private drawData(dataPoints: number[]): DataPoint[] | undefined {
    if (!dataPoints || dataPoints.length === 0) {
      return
    }

    const points: DataPoint[] = []

    // 计算每个数据点的坐标
    for (let i = 0; i < dataPoints.length; i++) {
      // 修改角度计算，让数据点顺序与ECharts一致（逆时针方向）
      const angle = (-i * 2 * Math.PI) / this.options.sides - Math.PI / 2
      const normalizedValue = Math.max(0, Math.min(dataPoints[i], this.options.maxValue))
      const pointRadius = (normalizedValue / this.options.maxValue) * this.radius
      const point = this.polarToCartesian(angle, pointRadius)
      points.push({ ...point, value: normalizedValue })
    }

    // 只绘制边框线条，不填充背景色
    this.ctx.beginPath()
    points.forEach((point, index) => {
      if (index === 0) {
        this.ctx.moveTo(point.x, point.y)
      } else {
        this.ctx.lineTo(point.x, point.y)
      }
    })
    this.ctx.closePath()

    // 绘制边框
    this.ctx.strokeStyle = this.options.dataStrokeColor
    this.ctx.lineWidth = this.options.lineWidth
    this.ctx.stroke()

    // 绘制数据点
    this.ctx.fillStyle = this.options.pointColor
    points.forEach((point) => {
      this.ctx.beginPath()
      this.ctx.arc(point.x, point.y, this.options.pointRadius, 0, Math.PI * 2)
      this.ctx.fill()
    })

    return points
  }

  /**
   * 清空画布
   */
  private clear(): void {
    // 使用显示尺寸清空画布
    this.ctx.clearRect(0, 0, this.centerX * 2, this.centerY * 2)
  }

  /**
   * 绘制完整的雷达图
   */
  public draw(dataPoints: number[]): DataPoint[] | undefined {
    // 清空画布
    this.clear()

    // 绘制各个部分
    this.drawGrid()
    this.drawAxes()
    this.drawLabels()
    const points = this.drawData(dataPoints)
    this.drawCenterText()

    return points
  }

  /**
   * 更新配置
   */
  public updateOptions(newOptions: Partial<RadarChartOptions>): void {
    this.options = { ...this.options, ...newOptions }
  }
}

/**
 * Canvas 实现的雷达图组件
 * 保持与 ECharts 版本相同的接口
 */
const RadarCanvas: React.FC<RadarCanvasProps> = ({ opts }) => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const radarChart = useRef<RadarChart | null>(null)

  const {
    data = [],
    indicator = [],
    style = {},
    tooltipHide,
    tooltipPos,
    centerTxt,
    centerTxtFontSize = 14,
    radarClick,
    radarExtras = {},
    series = {},
    css = '',
  } = opts

  useEffect(() => {
    if (!chartRef.current) return

    // 初始化雷达图
    const canvas = chartRef.current
    radarChart.current = new RadarChart(canvas)

    // 处理点击事件
    const handleClick = (event: MouseEvent): void => {
      if (radarClick && radarChart.current) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        // 简单判断是否点击在雷达图区域内
        const distance = Math.sqrt(
          Math.pow(x - radarChart.current.centerX, 2) + Math.pow(y - radarChart.current.centerY, 2)
        )

        if (distance <= radarChart.current.radius) {
          radarClick()
        }
      }
    }

    canvas.addEventListener('click', handleClick)

    return () => {
      canvas.removeEventListener('click', handleClick)
    }
  }, [radarClick])

  useEffect(() => {
    if (!radarChart.current || !data.length || !indicator.length) {
      return
    }

    // 构建配置选项
    const options: Partial<RadarChartOptions> = {
      maxValue: Math.max(...indicator.map((item) => item.max || 100)),
      sides: indicator.length,
      labels: indicator.map((item) => item.name || ''),
      dataColor: series?.areaStyle?.color || 'rgba(0, 174, 199, 0.3)',
      dataStrokeColor: style?.color || '#00aec7',
      pointColor: style?.color || '#00aec7',
      centerText: centerTxt || '',
      centerTextFont: `${centerTxtFontSize}px Arial`,
      ...radarExtras,
    }

    // 更新配置
    radarChart.current.updateOptions(options)

    // 提取数据值
    const dataValues = data[0]?.value || []

    // 绘制雷达图
    radarChart.current.draw(dataValues)
  }, [data, indicator, style, centerTxt, centerTxtFontSize, radarExtras, series])

  return (
    <ErrorBoundary>
      <canvas
        ref={chartRef}
        style={{
          width: style?.width || '120px',
          height: style?.height || '110px',
          background: '#fff',
          cursor: radarClick ? 'pointer' : 'default',
          ...style,
        }}
        className={`chart-radar ${css}`}
      />
    </ErrorBoundary>
  )
}

export default RadarCanvas
