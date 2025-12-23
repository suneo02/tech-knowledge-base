import { describe, expect, it } from 'vitest'
import { splitBaifenElementToSeveral } from '../../utils/html/splitElementToSeveral'

describe('splitBaifenElementToSeveral', () => {
  it('should split html into expected segments with correct titles', () => {
    const segments = splitBaifenElementToSeveral('')

    // 期望的标题顺序，与 idArr 的顺序保持一致
    const expectedTitles = ['财报识别结果', '平衡诊断结果', '科目变化诊断结果', '财务指标诊断结果', '综合总结分析']

    expect(segments.map((s) => s.title)).toEqual(expectedTitles)
    expect(segments).toHaveLength(expectedTitles.length)

    // 简单验证首段 html 片段包含关键信息
    expect(segments[0].html).toContain('资产负债表')
  })

  it('should return empty array when html has no target ids', () => {
    const emptyHtml = '<div><p>no match</p></div>'
    const segments = splitBaifenElementToSeveral(emptyHtml)
    expect(segments).toEqual([])
  })
})
