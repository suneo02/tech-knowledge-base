import { processColumnTags, processAdvancedTags } from '../prompt-processor'
import { ExtendedColumnDefine } from '@/components/MultiTable/utils/columnsUtils'

describe('Prompt Processor', () => {
  // 测试数据
  const mockColumns: ExtendedColumnDefine[] = [
    { field: 'companyName', title: '企业名称', width: 120 },
    { field: 'website', title: '网站', width: 120 },
    { field: 'industry', title: '所属行业', width: 100 },
    { field: 'registeredCapital', title: '注册资本', width: 100 },
    { field: 'foundingDate', title: '成立日期', width: 100 },
    { field: 'legalPerson', title: '法定代表人', width: 100 },
    { field: 'contact', title: '联系方式', width: 100 },
    { field: 'address', title: '企业地址', width: 120 },
  ]

  describe('processColumnTags', () => {
    it('应当正确替换精确匹配的标记', () => {
      const input = '请分析@企业名称的注册资本情况'
      const expected = '请分析{{companyName}}的注册资本情况'
      const result = processColumnTags(input, mockColumns)
      expect(result).toBe(expected)
    })

    it('应当处理忽略空格匹配的情况', () => {
      const input = '@企业  名称'
      const expected = '{{companyName}}'
      const result = processColumnTags(input, mockColumns)
      expect(result).toBe(expected)
    })

    it('应当正确处理多个标记', () => {
      const input = '请分析@企业名称的@注册资本情况'
      const expected = '请分析{{companyName}}的{{registeredCapital}}情况'
      const result = processColumnTags(input, mockColumns)
      expect(result).toBe(expected)
    })
  })

  describe('processAdvancedTags', () => {
    it('应当正确处理简单标记', () => {
      const input = '请访问 @企业名称 的网址'
      const expected = '请访问 {{companyName}} 的网址'
      const result = processAdvancedTags(input, mockColumns)
      expect(result).toBe(expected)
    })

    it('应当处理多个标记', () => {
      const input = '请访问 @企业名称 的网址（@网站）'
      const expected = '请访问 {{companyName}} 的网址（{{website}}）'
      const result = processAdvancedTags(input, mockColumns)
      expect(result).toBe(expected)
    })

    it('应当使用关键词映射', () => {
      const input = '请分析 @公司 的信息'
      const expected = '请分析 @公司 的信息'
      const result = processAdvancedTags(input, mockColumns)
      expect(result).toBe(expected)
    })

    it('应当支持模糊匹配', () => {
      const input = '请访问 @企业 的网址'
      const expected = '请访问 @企业 的网址'
      const result = processAdvancedTags(input, mockColumns)
      expect(result).toBe(expected)
    })

    it('当找不到匹配时应保留原始文本', () => {
      const input = '请访问 @不存在的字段 的网址'
      const expected = '请访问 @不存在的字段 的网址'
      const result = processAdvancedTags(input, mockColumns)
      expect(result).toBe(expected)
    })
  })
})
