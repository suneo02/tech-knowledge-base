import { describe, expect, it } from 'vitest'
import {
  escapeRegExp,
  extractTextsFromData,
  extractTranslatableStrings,
  replaceStringsInText,
  replaceTextsInData,
} from '../htmlProcessor'
import { detectChinese } from '../languageDetector'

describe('htmlProcessor', () => {
  describe('extractTranslatableStrings', () => {
    it('应该从纯文本中提取文本', () => {
      const result = extractTranslatableStrings('你好世界', detectChinese)
      expect(result).toEqual(['你好世界'])
    })

    it('应该从简单HTML中提取文本', () => {
      const html = '<div>你好</div>'
      const result = extractTranslatableStrings(html, detectChinese)
      expect(result).toEqual(['你好'])
    })

    it('应该从复杂HTML中提取所有文本节点', () => {
      const html = '<div><h1>标题</h1><p>内容</p></div>'
      const result = extractTranslatableStrings(html, detectChinese)
      expect(result).toContain('标题')
      expect(result).toContain('内容')
    })

    it('应该跳过不符合检测条件的文本', () => {
      const html = '<div>你好<span>Hello</span>世界</div>'
      const result = extractTranslatableStrings(html, detectChinese)
      expect(result).toContain('你好')
      expect(result).toContain('世界')
      expect(result).not.toContain('Hello')
    })

    it('应该跳过 script 标签内容', () => {
      const html = '<div>你好<script>const x = "测试";</script>世界</div>'
      const result = extractTranslatableStrings(html, detectChinese)
      expect(result).toContain('你好')
      expect(result).toContain('世界')
      expect(result).not.toContain('测试')
    })

    it('应该跳过 style 标签内容', () => {
      const html = '<div>你好<style>.class { content: "样式"; }</style>世界</div>'
      const result = extractTranslatableStrings(html, detectChinese)
      expect(result).toContain('你好')
      expect(result).toContain('世界')
      expect(result).not.toContain('样式')
    })

    it('应该处理空白和换行', () => {
      const html = '<div>  你好  \n  世界  </div>'
      const result = extractTranslatableStrings(html, detectChinese)
      expect(result.length).toBeGreaterThan(0)
      result.forEach((text) => {
        expect(text.trim()).toBeTruthy()
      })
    })

    it('对于不包含HTML标签的纯文本应该直接返回', () => {
      const text = '你好世界'
      const result = extractTranslatableStrings(text, detectChinese)
      expect(result).toEqual(['你好世界'])
    })

    it('不符合检测条件的纯文本应该返回空数组', () => {
      const text = 'Hello World'
      const result = extractTranslatableStrings(text, detectChinese)
      expect(result).toEqual([])
    })
  })

  describe('replaceStringsInText', () => {
    it('应该在纯文本中替换字符串', () => {
      const result = replaceStringsInText('你好世界', ['你好', '世界'], ['Hello', 'World'], {
        shouldProcessNodeText: () => true,
      })
      expect(result).toBe('HelloWorld')
    })

    it('应该在HTML中替换文本节点内容', () => {
      const html = '<div>你好</div>'
      const result = replaceStringsInText(html, ['你好'], ['Hello'], { shouldProcessNodeText: () => true })
      expect(result).toContain('Hello')
      expect(result).toContain('<div>')
      expect(result).toContain('</div>')
    })

    it('应该保持HTML标签结构不变', () => {
      const html = '<div class="test"><span>你好</span></div>'
      const result = replaceStringsInText(html, ['你好'], ['Hello'], { shouldProcessNodeText: () => true })
      expect(result).toContain('class="test"')
      expect(result).toContain('<span>')
      expect(result).toContain('</span>')
      expect(result).toContain('Hello')
    })

    it('应该按长度优先替换（避免子串问题）', () => {
      const html = '<div>你好世界</div>'
      const result = replaceStringsInText(html, ['你好世界', '你好'], ['Hello World', 'Hello'], {
        shouldProcessNodeText: () => true,
      })
      expect(result).toContain('Hello World')
      expect(result).not.toContain('HelloWorld')
    })

    it('应该处理正则特殊字符', () => {
      const html = '<div>价格$100</div>'
      const result = replaceStringsInText(html, ['价格$100'], ['Price $100'], { shouldProcessNodeText: () => true })
      expect(result).toContain('Price $100')
    })

    it('应该根据 shouldProcessNodeText 选择性替换', () => {
      const html = '<div>你好<span>世界</span></div>'
      const result = replaceStringsInText(html, ['你好', '世界'], ['Hello', 'World'], {
        shouldProcessNodeText: (text) => text.includes('你好'),
      })
      expect(result).toContain('Hello')
      expect(result).toContain('世界') // 不应该被替换
    })
  })

  describe('escapeRegExp', () => {
    it('应该转义正则特殊字符', () => {
      expect(escapeRegExp('.')).toBe('\\.')
      expect(escapeRegExp('*')).toBe('\\*')
      expect(escapeRegExp('+')).toBe('\\+')
      expect(escapeRegExp('?')).toBe('\\?')
      expect(escapeRegExp('^')).toBe('\\^')
      expect(escapeRegExp('$')).toBe('\\$')
      expect(escapeRegExp('{')).toBe('\\{')
      expect(escapeRegExp('}')).toBe('\\}')
      expect(escapeRegExp('(')).toBe('\\(')
      expect(escapeRegExp(')')).toBe('\\)')
      expect(escapeRegExp('|')).toBe('\\|')
      expect(escapeRegExp('[')).toBe('\\[')
      expect(escapeRegExp(']')).toBe('\\]')
      expect(escapeRegExp('\\')).toBe('\\\\')
    })

    it('应该处理包含多个特殊字符的字符串', () => {
      expect(escapeRegExp('$100.00')).toBe('\\$100\\.00')
      expect(escapeRegExp('[test]')).toBe('\\[test\\]')
      expect(escapeRegExp('a+b*c?')).toBe('a\\+b\\*c\\?')
    })

    it('不应该修改普通字符', () => {
      expect(escapeRegExp('abc123')).toBe('abc123')
      expect(escapeRegExp('测试')).toBe('测试')
    })
  })

  describe('extractTextsFromData', () => {
    it('应该从对象中提取所有文本', () => {
      const data = {
        name: '测试公司',
        description: '这是描述',
      }
      const result = extractTextsFromData(data, detectChinese)
      expect(result).toContain('测试公司')
      expect(result).toContain('这是描述')
    })

    it('应该从数组中提取所有文本', () => {
      const data = ['测试1', '测试2', '测试3']
      const result = extractTextsFromData(data, detectChinese)
      expect(result).toContain('测试1')
      expect(result).toContain('测试2')
      expect(result).toContain('测试3')
    })

    it('应该从嵌套结构中提取文本', () => {
      const data = {
        user: {
          name: '张三',
          profile: {
            bio: '个人简介',
          },
        },
        items: ['项目1', '项目2'],
      }
      const result = extractTextsFromData(data, detectChinese)
      expect(result).toContain('张三')
      expect(result).toContain('个人简介')
      expect(result).toContain('项目1')
      expect(result).toContain('项目2')
    })

    it('应该去重复文本', () => {
      const data = {
        field1: '测试',
        field2: '测试',
        field3: '测试',
      }
      const result = extractTextsFromData(data, detectChinese)
      expect(result.filter((text) => text === '测试')).toHaveLength(1)
    })

    it('应该按长度降序排列', () => {
      const data = {
        short: '短',
        medium: '中等长度',
        long: '这是一个很长的文本内容',
      }
      const result = extractTextsFromData(data, detectChinese)
      expect(result[0].length).toBeGreaterThanOrEqual(result[1].length)
      expect(result[1].length).toBeGreaterThanOrEqual(result[2].length)
    })

    it('应该从HTML字符串中提取文本', () => {
      const data = {
        html: '<div>标题</div><p>内容</p>',
      }
      const result = extractTextsFromData(data, detectChinese)
      expect(result).toContain('标题')
      expect(result).toContain('内容')
    })
  })

  describe('replaceTextsInData', () => {
    it('应该替换对象中的文本', () => {
      const data = {
        name: '测试',
        description: '描述',
      }
      const result = replaceTextsInData(data, ['测试', '描述'], ['Test', 'Description'], {
        shouldProcessNodeText: () => true,
      })
      expect(result.name).toBe('Test')
      expect(result.description).toBe('Description')
    })

    it('应该替换数组中的文本', () => {
      const data = ['测试1', '测试2']
      const result = replaceTextsInData(data, ['测试1', '测试2'], ['Test1', 'Test2'], {
        shouldProcessNodeText: () => true,
      })
      expect(result).toEqual(['Test1', 'Test2'])
    })

    it('应该替换嵌套结构中的文本', () => {
      const data = {
        user: {
          name: '张三',
        },
        items: ['项目1'],
      }
      const result = replaceTextsInData(data, ['张三', '项目1'], ['Zhang San', 'Project 1'], {
        shouldProcessNodeText: () => true,
      })
      expect(result.user.name).toBe('Zhang San')
      expect(result.items[0]).toBe('Project 1')
    })

    it('应该保持原数据结构不变', () => {
      const data = {
        id: 123,
        name: '测试',
        active: true,
        tags: ['标签1', '标签2'],
      }
      const result = replaceTextsInData(data, ['测试', '标签1', '标签2'], ['Test', 'Tag1', 'Tag2'], {
        shouldProcessNodeText: () => true,
      })
      expect(result.id).toBe(123)
      expect(result.active).toBe(true)
      expect(Array.isArray(result.tags)).toBe(true)
    })

    it('应该处理HTML内容', () => {
      const data = {
        content: '<div>你好</div>',
      }
      const result = replaceTextsInData(data, ['你好'], ['Hello'], { shouldProcessNodeText: () => true })
      expect(result.content).toContain('Hello')
      expect(result.content).toContain('<div>')
    })
  })
})
