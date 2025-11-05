// 添加实体识别和处理函数

import { ChatTraceResponse } from 'gel-api'
/**
 * 判断两个文本在原始文本中是否位于同一段落，段落以\n\n分隔
 * @param text 原始文本
 * @param text1 第一个文本
 * @param text2 第二个文本
 * @returns 是否在同一段落
 */
const isInSameParagraph = (text: string, text1: string, text2: string): boolean => {
  const pos1 = text.indexOf(text1)
  const pos2 = text.indexOf(text2)

  if (pos1 === -1 || pos2 === -1) return false

  // 找到text1和text2所在的段落
  const paragraphs = text.split('\n\n')
  let paragraph1Index = -1
  let paragraph2Index = -1

  let currentPos = 0
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraphLength = paragraphs[i].length
    const paragraphEnd = currentPos + paragraphLength

    if (pos1 >= currentPos && pos1 < paragraphEnd) {
      paragraph1Index = i
    }

    if (pos2 >= currentPos && pos2 < paragraphEnd) {
      paragraph2Index = i
    }

    // 更新位置（加上段落长度和分隔符长度）
    currentPos = paragraphEnd + 2 // 2是'\n\n'的长度

    // 如果两个索引都找到了，就可以提前退出循环
    if (paragraph1Index !== -1 && paragraph2Index !== -1) {
      break
    }
  }

  // 返回是否在同一段落
  return paragraph1Index === paragraph2Index && paragraph1Index !== -1
}

/**
 * 处理文本中的溯源标记
 * @param {string} text - 需要处理的原始文本
 * @param {ChatTraceResponse[]} traces - 溯源标记数组，每个溯源标记包含 start, end, index 等字段
 * @returns {string} - 处理后的文本，溯源标记被替换为标记格式
 * @example
 * processTextWithTraces('小米科技有限责任公司', [{ traced: [{ start: 0, end: 10, index: 0 }，{ start:20, end: 30, index: 0 }], value: '小米科技有限责任公司' }])
 * // 返回: '小米科技有限责任公司【0(0~10，20~30)】'
 */

export const processTextWithTraces = (text: string, traces: ChatTraceResponse[]): string => {
  if (!text || !traces?.length) return text

  // 按索引分组溯源标记
  const tracesByIndex: Record<
    number,
    {
      positions: Array<{ start: number; end: number }>
      value: string
    }[]
  > = {}
  // 收集所有追踪点并按索引分组
  traces.forEach((trace) => {
    if (trace.traced && trace.traced.length > 0 && trace.value) {
      const { value } = trace

      // 添加所有追踪点到对应索引组
      trace.traced.forEach((point) => {
        // 获取组索引
        const index = point.index

        // 如果索引组不存在，则创建一个
        if (!tracesByIndex[index]) {
          tracesByIndex[index] = [
            {
              positions: [],
              value,
            },
          ]
        }
        // 在同索引下找到是否有同一段落的溯源标记
        const trace = tracesByIndex[index]?.find((item) => {
          // 检查item.value和value是否在同一段落
          return isInSameParagraph(text, item.value, value)
        })
        // 如果trace不存在，则创建一个
        if (!trace) {
          tracesByIndex[index].push({
            positions: [{ start: point.start, end: point.end }],
            value,
          })
        } else {
          trace.positions.push({
            start: point.start,
            end: point.end,
          })
        }
      })
    }
  })

  // 如果没有有效的追踪点，直接返回原文
  if (Object.keys(tracesByIndex).length === 0) {
    return text
  }

  console.log('🚀 ~ processTextWithTraces ~ tracesByIndex:', tracesByIndex)

  // 记录需要插入溯源标记的位置信息
  const insertPoints: Array<{
    position: number // 插入位置
    marker: string // 要插入的溯源标记
  }> = []

  // 按索引处理
  for (const index of Object.keys(tracesByIndex).map(Number)) {
    for (const trace of tracesByIndex[index]) {
      const { positions, value } = trace

      // 对位置进行排序并去重
      const sortedPositions = [...positions]
        .filter((pos, idx, self) => self.findIndex((t) => t.start === pos.start && t.end === pos.end) === idx)
        .sort((a, b) => a.start - b.start)

      // 创建位置字符串
      const positionsStr = sortedPositions.map((pos) => `${pos.start}~${pos.end}`).join('，')

      // 查找value在原文中的位置
      const valuePos = text.indexOf(value)

      const paragraphEndRegex = `\n\n`

      if (valuePos !== -1) {
        // 找到value在原文中的位置，接下来找它所在段落的末尾
        const valueEndPos = valuePos + value.length
        // 查找原文中value后的第一个段落分隔符(\n\n)
        let paragraphEndPos = text.indexOf(paragraphEndRegex, valueEndPos)

        // 如果value以段落分隔符结尾，则使用valueEndPos - 2作为段落结束位置
        if (value.endsWith(paragraphEndRegex)) {
          paragraphEndPos = valueEndPos - paragraphEndRegex.length
        }

        // 如果找不到段落分隔符，或者分隔符在文本末尾之外，则使用新文本末尾
        if (paragraphEndPos === -1 || paragraphEndPos > text.length) {
          paragraphEndPos = text.length
        }

        // 如果段落分隔符的前一个非空字符是表格，则使用表格的最后一个单元格的末尾作为paragraphEndPos

        // 检查文本是否包含表格
        const tableRowRegex = /\|.*\|/g
        const textBetween = text.substring(valuePos, paragraphEndPos)
        const tableRows = textBetween.match(tableRowRegex)

        if (tableRows && tableRows.length >= 1) {
          // 找到最后一个单元格 (在最后一个 | 之前)
          const lastPipeIndex = textBetween.lastIndexOf('|')
          console.log('🚀 ~ processTextWithTraces ~ lastPipeIndex:', lastPipeIndex, text.substring(0, paragraphEndPos))
          // 如果最后一个管道符后面没有内容，则使用最后一个管道符的位置作为段落结束位置
          const lastPipeContent = text.substring(valuePos + lastPipeIndex + 1, paragraphEndPos).trim()

          if (lastPipeIndex !== -1 && lastPipeContent === '') {
            // 计算溯源标记应该插入的位置：value起始位置  + 最后一个管道符位置
            const insertPos = valuePos + lastPipeIndex - 1
            // 使用这个位置作为段落结束位置
            paragraphEndPos = insertPos
          }
        }

        // 记录插入点和对应的溯源标记
        insertPoints.push({
          position: paragraphEndPos,
          marker: `【${index}(${positionsStr})】`,
        })
      }
    }
  }

  // 按插入位置从后往前排序
  insertPoints.sort((a, b) => b.position - a.position)
  console.log('🚀 ~ processTextWithTraces ~ insertPoints:', insertPoints)

  // 从后往前插入溯源标记，避免影响后续位置
  let result = text
  for (const point of insertPoints) {
    const { position, marker } = point
    const before = result.substring(0, position)
    console.log('🚀 ~ processTextWithTraces ~ before:', before)
    const after = result.substring(position)
    result = before + marker + after
  }

  return result
}
