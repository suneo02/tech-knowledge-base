import LZString from 'lz-string'

/**
 * 使用 LZ-String 压缩隐藏节点 ID 数组。
 * @param hiddenNodes - 要隐藏的节点 ID 数组。
 * @returns 压缩后的 base64 字符串。
 */
export function compressHiddenNodes(hiddenNodes: string[]): string {
  try {
    // 首先将数组转换为 JSON 字符串
    const jsonString = JSON.stringify(hiddenNodes)
    // 使用 LZ-String 进行压缩
    const compressed = LZString.compressToBase64(jsonString)
    console.log('compressHiddenNodes', compressed)
    return compressed
  } catch (e) {
    console.error('compressHiddenNodes error', e)
    return ''
  }
}

/**
 * 将压缩字符串解压回隐藏节点 ID 数组。
 * @param compressedString - 隐藏节点的压缩字符串表示。
 * @returns 解压后的节点 ID 数组；如果解压失败，则返回空数组。
 */
export function decompressHiddenNodes(compressedString: string): string[] {
  try {
    // 解压字符串
    const jsonString = LZString.decompressFromBase64(compressedString)
    if (!jsonString) {
      return []
    }
    // 解析回数组
    const hiddenNodes = JSON.parse(jsonString)
    console.log('decompressHiddenNodes', hiddenNodes)
    // 验证我们得到的是一个数组
    if (!Array.isArray(hiddenNodes)) {
      return []
    }
    return hiddenNodes
  } catch (error) {
    console.error('Failed to decompress hidden nodes:', error)
    return []
  }
}
