import type { ChartData } from './types'

/**
 * 判断文本是否包含图表
 */
export const hasChart = (text: string): boolean => {
  return (
    /^```chart\s*\n/.test(text) ||
    text.includes('\n```chart\n') ||
    /^```mermaid\s*\n/.test(text) ||
    text.includes('\n```mermaid\n')
  )
}

/**
 * 从文本中提取图表内容和上下文
 */
export const extractChartContent = (text: string): { content: string; start: number; end: number } | null => {
  // 尝试匹配 chart 格式
  const chartRegex = /(```chart\s*\n)([\s\S]*?)(\n```)/
  const chartMatch = text.match(chartRegex)
  if (chartMatch) {
    const start = chartMatch.index || 0
    return {
      content: chartMatch[2],
      start,
      end: start + chartMatch[0].length,
    }
  }

  // 尝试匹配 mermaid 格式
  const mermaidRegex = /(```mermaid\s*\n)([\s\S]*?)(\n```)/
  const mermaidMatch = text.match(mermaidRegex)
  if (mermaidMatch) {
    const start = mermaidMatch.index || 0
    return {
      content: mermaidMatch[2],
      start,
      end: start + mermaidMatch[0].length,
    }
  }

  return null
}

/**
 * 解析 Mermaid 饼图数据
 */
const parseMermaidPie = (content: string): ChartData | null => {
  try {
    const lines = content.trim().split('\n')
    if (!lines[0].trim().toLowerCase().startsWith('pie')) return null

    const data = {
      labels: [] as string[],
      values: [] as number[],
    }

    // 获取标题
    let title = ''
    const titleLine = lines.find((line) => line.trim().toLowerCase().startsWith('title'))
    if (titleLine) {
      title = titleLine
        .replace(/^pie\s*title\s*/, '')
        .replace(/^title\s*/, '')
        .trim()
    }

    // 处理数据行
    const dataLines = lines.filter((line) => {
      const trimmed = line.trim()
      return trimmed && !trimmed.startsWith('pie') && !trimmed.startsWith('title')
    })

    dataLines.forEach((line) => {
      // 尝试匹配 label 格式：label 标签(数值%)
      const labelMatch = line.match(/label\s+([^(]+)\((\d+)%\)/)
      if (labelMatch) {
        const [, label, value] = labelMatch
        data.labels.push(label.trim())
        data.values.push(Number(value))
        return
      }

      // 尝试匹配直接数值格式："标签": 数值
      const valueMatch = line.match(/"([^"]+)"\s*:\s*(\d+)/)
      if (valueMatch) {
        const [, label, value] = valueMatch
        data.labels.push(label.trim())
        data.values.push(Number(value))
        return
      }

      // 尝试匹配百分比格式：标签: 数值%
      const percentMatch = line.match(/([^:]+):\s*(\d+)%/)
      if (percentMatch) {
        const [, label, value] = percentMatch
        data.labels.push(label.trim())
        data.values.push(Number(value))
        return
      }
    })

    if (data.labels.length === 0 || data.values.length === 0) return null

    // 如果不是百分比格式，需要计算百分比
    if (!dataLines[0].includes('%')) {
      const total = data.values.reduce((sum, value) => sum + value, 0)
      data.values = data.values.map((value) => Math.round((value / total) * 100))
    }

    return {
      type: 'pie',
      data,
      config: {
        title,
        showLegend: true,
      },
    }
  } catch (error) {
    console.error('Error parsing mermaid pie chart:', error)
    return null
  }
}

/**
 * 解析 Mermaid 流程图数据
 */
const parseMermaidGraph = (content: string): ChartData | null => {
  try {
    const lines = content.trim().split('\n')
    if (!lines[0].trim().toLowerCase().startsWith('graph')) return null

    const data = {
      labels: [] as string[],
      values: [] as number[],
      nodes: new Set<string>(),
    }

    // 处理每一行连接关系
    lines.slice(1).forEach((line) => {
      // 匹配形如 A[标签] -- 数值 --> B[标签] 的模式
      const match = line.match(/([A-Z])\[([^\]]+)\]\s*--\s*(\d+)\s*-->\s*([A-Z])\[([^\]]+)\]/)
      if (match) {
        const [, , sourceLabel, value, , targetLabel] = match
        data.labels.push(sourceLabel.trim())
        data.values.push(Number(value))
        data.nodes.add(targetLabel.trim())
      }
    })

    // 如果目标节点只有一个，说明是汇总型图表，可以转换为饼图
    if (data.nodes.size === 1) {
      return {
        type: 'pie',
        data: {
          labels: data.labels,
          values: data.values,
        },
        config: {
          title: `${Array.from(data.nodes)[0]}的分布`,
          showLegend: true,
        },
      }
    }

    return null
  } catch (error) {
    console.error('Error parsing mermaid graph:', error)
    return null
  }
}

/**
 * 解析图表数据
 */
export const parseChart = (text: string): { data: ChartData; position: { start: number; end: number } } | null => {
  try {
    const extracted = extractChartContent(text)
    if (!extracted) return null

    // 检查是否是 Mermaid 格式
    if (text.includes('```mermaid')) {
      // 尝试解析饼图
      const pieData = parseMermaidPie(extracted.content)
      if (pieData) {
        return {
          data: pieData,
          position: {
            start: extracted.start,
            end: extracted.end,
          },
        }
      }

      // 尝试解析流程图
      const graphData = parseMermaidGraph(extracted.content)
      if (graphData) {
        return {
          data: graphData,
          position: {
            start: extracted.start,
            end: extracted.end,
          },
        }
      }

      return null
    }

    // 解析 JSON 格式的图表
    const chartData = JSON.parse(extracted.content) as ChartData

    // 验证必要的字段
    if (!chartData.type || !chartData.data || !chartData.data.labels || !chartData.data.values) {
      return null
    }

    // 确保数据长度匹配
    if (chartData.data.labels.length !== chartData.data.values.length) {
      return null
    }

    return {
      data: chartData,
      position: {
        start: extracted.start,
        end: extracted.end,
      },
    }
  } catch (error) {
    console.error('Error parsing chart data:', error)
    return null
  }
}
