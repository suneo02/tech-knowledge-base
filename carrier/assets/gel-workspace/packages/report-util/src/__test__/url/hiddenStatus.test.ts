import { compressHiddenNodes, decompressHiddenNodes } from '@/url'
import { describe, expect, it } from 'vitest'

describe('hiddenStatus', () => {
  // 测试 compressHiddenNodes 函数
  describe('compressHiddenNodes', () => {
    it('应该能正确压缩一个包含简单字符串的数组', () => {
      const nodes = ['node1', 'node2', 'node3']
      const compressed = compressHiddenNodes(nodes)
      // 压缩结果应该是一个非空字符串
      expect(compressed).toBeTypeOf('string')
      expect(compressed.length).toBeGreaterThan(0)
    })

    it('应该能正确处理一个空数组', () => {
      const nodes: string[] = []
      const compressed = compressHiddenNodes(nodes)
      // 压缩空数组应该得到一个固定的压缩字符串
      // JSON.stringify([]) -> "[]"
      // LZString.compressToBase64("[]") -> "BIADAgA="
      expect(compressed).toBe('NoXSA===')
    })

    it('应该能处理包含特殊字符的字符串数组', () => {
      const nodes = ['node-1_&', 'n@de/2', 'node=3?']
      const compressed = compressHiddenNodes(nodes)
      expect(compressed).toBeTypeOf('string')
      expect(compressed.length).toBeGreaterThan(0)
    })
  })

  // 测试 decompressHiddenNodes 函数
  describe('decompressHiddenNodes', () => {
    it('对于一个空的压缩字符串，应该返回一个空数组', () => {
      const decompressed = decompressHiddenNodes('')
      expect(decompressed).toEqual([])
    })

    it('对于一个无效的 base64 字符串，应该返回一个空数组', () => {
      const decompressed = decompressHiddenNodes('invalid-base64-string')
      expect(decompressed).toEqual([])
    })

    it('对于解压后不是有效 JSON 数组的字符串，应该返回一个空数组', () => {
      // "not an array" 经过 lz-string 压缩和 base64 编码后的字符串
      const compressedString = 'BIUgZg9gJgrgzgOwC5g'
      const decompressed = decompressHiddenNodes(compressedString)
      expect(decompressed).toEqual([])
    })
  })

  // 组合测试：压缩后再解压
  describe('compress and decompress cycle', () => {
    it('对于一个常规数组，压缩后再解压应该得到原始数组', () => {
      const originalNodes = ['id_a_1', 'id_b_2', 'id_c_3']
      const compressed = compressHiddenNodes(originalNodes)
      const decompressed = decompressHiddenNodes(compressed)
      expect(decompressed).toEqual(originalNodes)
    })

    it('对于一个空数组，压缩后再解压应该得到原始空数组', () => {
      const originalNodes: string[] = []
      const compressed = compressHiddenNodes(originalNodes)
      const decompressed = decompressHiddenNodes(compressed)
      expect(decompressed).toEqual(originalNodes)
    })

    it('对于包含大量节点的数组，压缩后再解压应该得到原始数组', () => {
      const originalNodes = Array.from({ length: 100 }, (_, i) => `node_id_${i}`)
      const compressed = compressHiddenNodes(originalNodes)
      const decompressed = decompressHiddenNodes(compressed)
      expect(decompressed).toEqual(originalNodes)
    })

    it('对于包含复杂字符的数组，压缩后再解压应该得到原始数组', () => {
      const originalNodes = ['{"key":"value"}', '[1,2,3]', '特殊字符-!@#$%^&*()_+']
      const compressed = compressHiddenNodes(originalNodes)
      const decompressed = decompressHiddenNodes(compressed)
      expect(decompressed).toEqual(originalNodes)
    })
  })
})
