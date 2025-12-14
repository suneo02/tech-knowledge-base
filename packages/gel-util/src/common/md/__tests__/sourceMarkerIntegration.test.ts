/**
 * 溯源标记集成测试
 *
 * 验证 insertTraceMarkers 和 convertSourceMarkersToHtml 的集成流程
 * 以及重构后功能的一致性
 */
import type { ChatTraceItem } from 'gel-api'
import { describe, expect, it } from 'vitest'
import { convertSourceMarkersToHtml } from '../convertSourceMarkersToHtml'
import { insertTraceMarkers } from '../insertTraceMarkers'
import {
  batchInsert,
  buildSourceMarker,
  formatPositions,
  normalizePositions,
  parsePositions,
} from '../sourceMarkerUtils'

describe('sourceMarkerUtils - 工具函数测试', () => {
  describe('formatPositions', () => {
    it('应该正确格式化单个位置', () => {
      const result = formatPositions([{ start: 10, end: 20 }])
      expect(result).toBe('10~20')
    })

    it('应该正确格式化多个位置', () => {
      const result = formatPositions([
        { start: 10, end: 20 },
        { start: 30, end: 40 },
      ])
      expect(result).toBe('10~20，30~40')
    })
  })

  describe('parsePositions', () => {
    it('应该正确解析单个位置', () => {
      const result = parsePositions('10~20')
      expect(result).toEqual([{ start: 10, end: 20 }])
    })

    it('应该正确解析多个位置（中文逗号）', () => {
      const result = parsePositions('10~20，30~40')
      expect(result).toEqual([
        { start: 10, end: 20 },
        { start: 30, end: 40 },
      ])
    })

    it('应该正确解析多个位置（英文逗号）', () => {
      const result = parsePositions('10~20,30~40')
      expect(result).toEqual([
        { start: 10, end: 20 },
        { start: 30, end: 40 },
      ])
    })
  })

  describe('buildSourceMarker', () => {
    it('应该正确生成单个位置的标记', () => {
      const result = buildSourceMarker(3, [{ start: 181, end: 223 }])
      expect(result).toBe('【3(181~223)】')
    })

    it('应该正确生成多个位置的标记', () => {
      const result = buildSourceMarker(13, [
        { start: 111, end: 124 },
        { start: 215, end: 293 },
      ])
      expect(result).toBe('【13(111~124，215~293)】')
    })
  })

  describe('normalizePositions', () => {
    it('应该去除重复位置', () => {
      const result = normalizePositions([
        { start: 10, end: 20 },
        { start: 10, end: 20 },
        { start: 30, end: 40 },
      ])
      expect(result).toEqual([
        { start: 10, end: 20 },
        { start: 30, end: 40 },
      ])
    })

    it('应该按 start 升序排列', () => {
      const result = normalizePositions([
        { start: 30, end: 40 },
        { start: 10, end: 20 },
        { start: 50, end: 60 },
      ])
      expect(result).toEqual([
        { start: 10, end: 20 },
        { start: 30, end: 40 },
        { start: 50, end: 60 },
      ])
    })

    it('应该同时去重和排序', () => {
      const result = normalizePositions([
        { start: 50, end: 60 },
        { start: 10, end: 20 },
        { start: 30, end: 40 },
        { start: 10, end: 20 },
      ])
      expect(result).toEqual([
        { start: 10, end: 20 },
        { start: 30, end: 40 },
        { start: 50, end: 60 },
      ])
    })
  })

  describe('batchInsert', () => {
    it('应该正确插入单个点', () => {
      const result = batchInsert('ABCDEFGH', [{ position: 4, content: '[1]' }])
      expect(result).toBe('ABCD[1]EFGH')
    })

    it('应该从后向前正确插入多个点', () => {
      const result = batchInsert('ABCDEFGH', [
        { position: 4, content: '[1]' },
        { position: 2, content: '[2]' },
      ])
      expect(result).toBe('AB[2]CD[1]EFGH')
    })

    it('应该自动处理乱序的插入点', () => {
      const result = batchInsert('ABCDEFGH', [
        { position: 2, content: '[2]' },
        { position: 6, content: '[3]' },
        { position: 4, content: '[1]' },
      ])
      expect(result).toBe('AB[2]CD[1]EF[3]GH')
    })
  })
})

describe('insertTraceMarkers - 插入溯源标记', () => {
  it('场景1：单个溯源标记', () => {
    const text = '小米科技有限责任公司成立于2010年'
    const traces: ChatTraceItem[] = [
      {
        value: '小米科技有限责任公司',
        traced: [{ start: 0, end: 10, index: 0 }],
      },
    ]
    const result = insertTraceMarkers(text, traces)
    expect(result).toBe('小米科技有限责任公司成立于2010年【0(0~10)】')
  })

  it('场景2：同一段落多个溯源位置合并', () => {
    const text = '小米科技在2010年成立，小米集团是其母公司'
    const traces: ChatTraceItem[] = [
      {
        value: '小米科技在2010年成立，小米集团是其母公司',
        traced: [
          { start: 0, end: 10, index: 0 },
          { start: 20, end: 30, index: 0 },
        ],
      },
    ]
    const result = insertTraceMarkers(text, traces)
    expect(result).toBe('小米科技在2010年成立，小米集团是其母公司【0(0~10，20~30)】')
  })

  it('场景3：跨段落溯源标记分别插入', () => {
    const text = '第一段内容A\n\n第二段内容B'
    const traces: ChatTraceItem[] = [
      { value: '第一段内容A', traced: [{ start: 0, end: 5, index: 0 }] },
      { value: '第二段内容B', traced: [{ start: 10, end: 15, index: 0 }] },
    ]
    const result = insertTraceMarkers(text, traces)
    expect(result).toBe('第一段内容A【0(0~5)】\n\n第二段内容B【0(10~15)】')
  })

  it('场景4：不同参考资料索引', () => {
    const text = '根据公告，小米2024年营收增长20%\n\n根据研报，预计2025年继续增长'
    const traces: ChatTraceItem[] = [
      {
        value: '根据公告，小米2024年营收增长20%',
        traced: [{ start: 0, end: 10, index: 0 }],
      },
      {
        value: '根据研报，预计2025年继续增长',
        traced: [{ start: 5, end: 15, index: 1 }],
      },
    ]
    const result = insertTraceMarkers(text, traces)
    expect(result).toBe('根据公告，小米2024年营收增长20%【0(0~10)】\n\n根据研报，预计2025年继续增长【1(5~15)】')
  })

  it('边界条件：空文本', () => {
    const result = insertTraceMarkers('', [])
    expect(result).toBe('')
  })

  it('边界条件：无溯源数据', () => {
    const result = insertTraceMarkers('测试文本', [])
    expect(result).toBe('测试文本')
  })
})

describe('convertSourceMarkersToHtml - 转换为 HTML', () => {
  it('场景1：单个位置的溯源标记', () => {
    const text = '墨西哥暂不征收对等关税【3(181~223)】'
    const result = convertSourceMarkersToHtml(text)
    expect(result).toContain('墨西哥暂不征收对等关税')
    expect(result).toContain('class="source-marker"')
    expect(result).toContain('data-source-id="3"')
    expect(result).toContain('"start":"181"')
    expect(result).toContain('"end":"223"')
  })

  it('场景2：多个位置的溯源标记', () => {
    const text = '相关政策【13(111~124,215~293)】'
    const result = convertSourceMarkersToHtml(text)
    expect(result).toContain('相关政策')
    expect(result).toContain('data-source-id="13"')
    expect(result).toContain('"start":"111"')
    expect(result).toContain('"end":"124"')
    expect(result).toContain('"start":"215"')
    expect(result).toContain('"end":"293"')
  })

  it('场景3：多个溯源标记', () => {
    const text = '内容A【1(10~20)】，内容B【2(30~40)】'
    const result = convertSourceMarkersToHtml(text)
    expect(result).toContain('内容A')
    expect(result).toContain('data-source-id="1"')
    expect(result).toContain('内容B')
    expect(result).toContain('data-source-id="2"')
  })

  it('场景4：支持中文逗号分隔的位置', () => {
    const text = '相关政策【13(111~124，215~293)】'
    const result = convertSourceMarkersToHtml(text)
    expect(result).toContain('data-source-id="13"')
    expect(result).toContain('"start":"111"')
    expect(result).toContain('"end":"124"')
    expect(result).toContain('"start":"215"')
    expect(result).toContain('"end":"293"')
  })

  it('边界条件：空文本', () => {
    const result = convertSourceMarkersToHtml('')
    expect(result).toBe('')
  })

  it('边界条件：无溯源标记', () => {
    const result = convertSourceMarkersToHtml('普通文本')
    expect(result).toBe('普通文本')
  })
})

describe('集成测试：insertTraceMarkers + convertSourceMarkersToHtml', () => {
  it('完整流程：从原始文本到 HTML', () => {
    // 阶段1：插入溯源标记
    const originalText = '小米科技有限责任公司成立于2010年'
    const traces: ChatTraceItem[] = [
      {
        value: '小米科技有限责任公司',
        traced: [{ start: 0, end: 10, index: 0 }],
      },
    ]
    const textWithMarkers = insertTraceMarkers(originalText, traces)
    expect(textWithMarkers).toBe('小米科技有限责任公司成立于2010年【0(0~10)】')

    // 阶段2：转换为 HTML
    const html = convertSourceMarkersToHtml(textWithMarkers)
    expect(html).toContain('小米科技有限责任公司成立于2010年')
    expect(html).toContain('class="source-marker"')
    expect(html).toContain('data-source-id="0"')
    expect(html).toContain('"start":"0"')
    expect(html).toContain('"end":"10"')
    expect(html).not.toContain('【0(0~10)】') // 标记应被替换
  })

  it('完整流程：多个段落和多个溯源', () => {
    const originalText = '根据公告，小米2024年营收增长20%\n\n根据研报，预计2025年继续增长'
    const traces: ChatTraceItem[] = [
      {
        value: '根据公告，小米2024年营收增长20%',
        traced: [
          { start: 0, end: 10, index: 0 },
          { start: 20, end: 30, index: 0 },
        ],
      },
      {
        value: '根据研报，预计2025年继续增长',
        traced: [{ start: 5, end: 15, index: 1 }],
      },
    ]

    const textWithMarkers = insertTraceMarkers(originalText, traces)
    expect(textWithMarkers).toContain('【0(0~10，20~30)】')
    expect(textWithMarkers).toContain('【1(5~15)】')

    const html = convertSourceMarkersToHtml(textWithMarkers)
    expect(html).toContain('data-source-id="0"')
    expect(html).toContain('data-source-id="1"')
    expect(html).not.toContain('【') // 所有标记应被替换
  })
})
