import React, { useEffect, useMemo, useRef } from 'react'
import { Spin } from '@wind/wind-ui'
import { isEn } from 'gel-util/intl'
import * as echarts from 'echarts'
import styles from './ProductWordsCloud.module.less'

interface ProductWordItem {
  subject: string
  count: number
}

interface ProductWordsCloudData {
  words: ProductWordItem[]
}

interface ProductWordsCloudProps {
  data: ProductWordsCloudData
  height?: number
  loading?: boolean
  title?: string
  // 动态展示策略配置
  targetCoverage?: number // 累计覆盖率阈值，默认 0.85
  minWords?: number // 最小展示词条数，默认 30
  maxWords?: number // 最大展示词条数，默认 120
  // 交互
  onSelectWord?: (subject: string) => void
}

const DEFAULT_HEIGHT = 360

function selectWordsDynamically(
  originalWords: ProductWordItem[],
  options: { targetCoverage: number; minWords: number; maxWords: number }
): ProductWordItem[] {
  const { targetCoverage, minWords, maxWords } = options
  if (!originalWords || originalWords.length === 0) return []

  const total = originalWords.reduce((sum, item) => sum + Math.max(item.count, 0), 0)
  if (total <= 0) return []

  // 次数降序；并列时可按字数/字典序微调
  const sorted = [...originalWords].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    if (a.subject.length !== b.subject.length) return a.subject.length - b.subject.length
    return a.subject.localeCompare(b.subject)
  })

  const selected: ProductWordItem[] = []
  let cumulative = 0
  for (let i = 0; i < sorted.length; i += 1) {
    const item = sorted[i]
    selected.push(item)
    cumulative += item.count
    const coverage = cumulative / total

    // 达到覆盖率阈值且已满足最小展示
    if (coverage >= targetCoverage && selected.length >= minWords) break
    // 避免超过最大展示数
    if (selected.length >= maxWords) break
  }

  return selected
}

export const ProductWordsCloud: React.FC<ProductWordsCloudProps> = ({
  data,
  height = DEFAULT_HEIGHT,
  loading = false,
  title,
  targetCoverage = 0.85,
  minWords = 30,
  maxWords = 120,
  onSelectWord,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  const selectedWords = useMemo(() => {
    return selectWordsDynamically(data?.words || [], {
      targetCoverage,
      minWords,
      maxWords,
    })
  }, [data, targetCoverage, minWords, maxWords])

  const option = useMemo(() => {
    const seriesData = selectedWords.map((item) => ({
      name: item.subject,
      value: Math.max(item.count, 0),
    }))

    return {
      title: title
        ? {
            text: title,
            left: 'center',
            top: 8,
            textStyle: { fontSize: 16, fontWeight: 'normal' },
          }
        : undefined,
      tooltip: {
        show: true,
        formatter: (params: { name?: string; value?: number }) => {
          const name = params?.name ?? ''
          const value = params?.value ?? 0
          return `${name}<br/>${isEn() ? 'Count' : '次数'}: ${value}`
        },
      },
      series: [
        {
          type: 'wordCloud',
          shape: 'circle',
          // 文字大小范围，按 count 线性映射
          sizeRange: [12, 48],
          // 设置旋转范围为 0，让所有词条都水平展示
          rotationRange: [0, 0],
          rotationStep: 0,
          // 增加网格大小，让词条分布更宽松
          gridSize: 24,
          // 增加词条间距
          textPadding: 16,
          // 允许词条超出边界，增加布局空间
          drawOutOfBound: true,
          layoutAnimation: true,
          textStyle: {
            color: () => {
              // 简单的颜色集合
              const palette = ['#1890FF', '#52C41A', '#FAAD14', '#EB2F96', '#722ED1', '#13C2C2', '#F5222D']
              return palette[Math.floor(Math.random() * palette.length)]
            },
            fontWeight: 500,
          },
          emphasis: {
            focus: 'self',
            textStyle: {
              shadowColor: 'rgba(0,0,0,0.25)',
              shadowBlur: 6,
            },
          },
          data: seriesData,
        },
      ],
    }
  }, [selectedWords, title])

  useEffect(() => {
    let disposed = false

    // 动态导入插件（不强绑定构建时依赖）
    import('echarts-wordcloud')
      .then(() => {
        if (disposed) return
        if (!chartRef.current) return

        if (!chartInstance.current) {
          chartInstance.current = echarts.init(chartRef.current)
        }
        chartInstance.current?.setOption(option)

        // 点击事件联动
        chartInstance.current?.off('click')
        chartInstance.current?.on('click', (params: { name?: string }) => {
          if (params?.name && typeof onSelectWord === 'function') {
            onSelectWord(params.name)
          }
        })
      })
      .catch(() => {
        // 插件加载失败时不阻断，其它区域仍可工作
      })

    return () => {
      disposed = true
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [option, onSelectWord])

  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!data || !data.words || data.words.length === 0) {
    return (
      <div className={styles.empty} style={{ height }}>
        <span>{isEn() ? 'No data available' : '暂无数据'}</span>
      </div>
    )
  }

  return (
    <div className={styles.root} style={{ height }}>
      {loading && (
        <div className={styles.overlay}>
          <Spin size="large" />
        </div>
      )}
      <div ref={chartRef} className={styles.chart} />
    </div>
  )
}

export type { ProductWordsCloudProps, ProductWordsCloudData, ProductWordItem }
