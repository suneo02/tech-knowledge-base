/**
 * 处理文本中的溯源标记，将文本如 墨西哥和加拿大暂时不征收对等关税，符合USMCA协议的商品继续享受免税待遇。【3(181~223)】【5(269~326)】\n\n
 * 中的溯源标记【3(181~223)】或【13(111~124,215~293)】 转换为 自定义a标签
 * @param text 要处理的文本内容
 * @returns 处理后的文本，溯源标记会被转换为自定义a标签
 */

export const processSourceMarkers = (text: string): string => {
  if (!text || typeof text !== 'string') return ''

  // 直接查找所有可能的溯源标记，使用预处理提取它们，避免替换导致的位置问题
  const markerPattern = /【(\d+)\(([\d~,，]+?)\)】/g
  const markers: Array<{
    sourceId: string
    positionsStr: string
    start: number
    end: number
    original: string
  }> = []
  let matchResult

  // 收集所有匹配项
  while ((matchResult = markerPattern.exec(text)) !== null) {
    const [fullMatch, sourceId, positionsStr] = matchResult
    markers.push({
      sourceId,
      positionsStr,
      start: matchResult.index,
      end: matchResult.index + fullMatch.length,
      original: fullMatch,
    })
  }

  // 如果没有找到任何标记，直接返回原文
  if (markers.length === 0) {
    return text
  }

  // 从后向前替换，避免前面的替换影响后面的位置
  markers.sort((a, b) => b.start - a.start)

  let result = text
  for (const marker of markers) {
    const { sourceId, positionsStr, start, end } = marker

    // 处理位置字符串
    const positions = positionsStr.split(/[,，]/).map((pos) => {
      const [posStart, posEnd] = pos.split('~').map((s) => s.trim())
      return { start: posStart, end: posEnd }
    })

    // 创建JSON字符串
    const positionsJson = JSON.stringify(positions)

    // 创建替换用的a标签
    const replacement = `<a class="source-marker" data-source-id="${sourceId}" data-positions='${positionsJson}' >”</a>`

    // 替换文本
    result = result.substring(0, start) + replacement + result.substring(end)
  }
  return result
}
