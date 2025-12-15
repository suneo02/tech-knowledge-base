import { describe, expect, it } from 'vitest'
import { detectChinese, detectEnglish, getDetectorByLocale, hasTranslatableContent } from '../languageDetector'

describe('languageDetector', () => {
  describe('hasTranslatableContent', () => {
    it('应该识别包含中文的文本', () => {
      expect(hasTranslatableContent('你好')).toBe(true)
      expect(hasTranslatableContent('测试公司')).toBe(true)
      expect(hasTranslatableContent('中文123')).toBe(true)
    })

    it('应该识别包含英文的文本', () => {
      expect(hasTranslatableContent('Hello')).toBe(true)
      expect(hasTranslatableContent('Test Company')).toBe(true)
      expect(hasTranslatableContent('English123')).toBe(true)
    })

    it('应该识别混合语言的文本', () => {
      expect(hasTranslatableContent('Hello世界')).toBe(true)
      expect(hasTranslatableContent('测试Test')).toBe(true)
    })

    it('不应该识别纯数字', () => {
      expect(hasTranslatableContent('123')).toBe(false)
      expect(hasTranslatableContent('456.789')).toBe(false)
    })

    it('不应该识别纯符号', () => {
      expect(hasTranslatableContent('$%^&')).toBe(false)
      expect(hasTranslatableContent('!@#')).toBe(false)
      expect(hasTranslatableContent('---')).toBe(false)
    })

    it('不应该识别空字符串或空白', () => {
      expect(hasTranslatableContent('')).toBe(false)
      expect(hasTranslatableContent('   ')).toBe(false)
      expect(hasTranslatableContent('\n\t')).toBe(false)
    })

    it('应该正确处理数字加符号的组合', () => {
      expect(hasTranslatableContent('$100')).toBe(false)
      expect(hasTranslatableContent('50%')).toBe(false)
      expect(hasTranslatableContent('123-456')).toBe(false)
    })

    it('应该识别包含文字和数字符号的混合内容', () => {
      expect(hasTranslatableContent('用户123')).toBe(true)
      expect(hasTranslatableContent('User456')).toBe(true)
      expect(hasTranslatableContent('价格$100')).toBe(true)
    })
  })

  describe('detectChinese', () => {
    it('应该检测包含中文字符的文本', () => {
      expect(detectChinese('你好')).toBe(true)
      expect(detectChinese('测试')).toBe(true)
      expect(detectChinese('中文English')).toBe(true)
    })

    it('不应该检测不包含中文字符的文本', () => {
      expect(detectChinese('Hello')).toBe(false)
      expect(detectChinese('123')).toBe(false)
      expect(detectChinese('$%^&')).toBe(false)
    })

    it('应该检测包含中文的混合文本', () => {
      expect(detectChinese('用户123')).toBe(true)
      expect(detectChinese('测试Test')).toBe(true)
    })
  })

  describe('detectEnglish', () => {
    it('应该检测纯英文文本', () => {
      expect(detectEnglish('Hello')).toBe(true)
      expect(detectEnglish('Test Company')).toBe(true)
    })

    it('应该检测包含数字和特殊字符的英文文本', () => {
      expect(detectEnglish('John123')).toBe(true)
      expect(detectEnglish('Mary-Jane')).toBe(true)
      expect(detectEnglish('User$100')).toBe(true)
    })

    it('不应该检测包含中文的文本', () => {
      expect(detectEnglish('你好')).toBe(false)
      expect(detectEnglish('Hello世界')).toBe(false)
      expect(detectEnglish('测试Test')).toBe(false)
    })

    it('不应该检测纯数字或符号', () => {
      expect(detectEnglish('123')).toBe(false)
      expect(detectEnglish('$%^&')).toBe(false)
      expect(detectEnglish('---')).toBe(false)
    })
  })

  describe('getDetectorByLocale', () => {
    it('应该为 en-US 返回英文检测器', () => {
      const detector = getDetectorByLocale('en-US')
      expect(detector('Hello')).toBe(true)
      expect(detector('你好')).toBe(false)
    })

    it('应该为 zh-CN 返回中文检测器', () => {
      const detector = getDetectorByLocale('zh-CN')
      expect(detector('你好')).toBe(true)
      expect(detector('Hello')).toBe(false)
    })

    it('默认应该返回中文检测器', () => {
      // @ts-expect-error: 测试默认行为
      const detector = getDetectorByLocale('unknown')
      expect(detector('你好')).toBe(true)
      expect(detector('Hello')).toBe(false)
    })
  })
})

