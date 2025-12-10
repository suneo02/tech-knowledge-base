import { describe, expect, it } from 'vitest'
import { detectChinese, detectEnglish, hasTranslatableContent } from '../../misc/translate/languageDetector'

describe('languageDetector', () => {
  describe('hasTranslatableContent', () => {
    it('应该识别包含中文的文本', () => {
      expect(hasTranslatableContent('你好')).toBe(true)
      expect(hasTranslatableContent('测试123')).toBe(true)
      expect(hasTranslatableContent('中文&符号')).toBe(true)
    })

    it('应该识别包含英文的文本', () => {
      expect(hasTranslatableContent('Hello')).toBe(true)
      expect(hasTranslatableContent('Test123')).toBe(true)
      expect(hasTranslatableContent('English&Symbol')).toBe(true)
    })

    it('应该识别混合中英文的文本', () => {
      expect(hasTranslatableContent('Hello世界')).toBe(true)
      expect(hasTranslatableContent('测试Test')).toBe(true)
    })

    it('应该拒绝纯数字', () => {
      expect(hasTranslatableContent('123')).toBe(false)
      expect(hasTranslatableContent('456.78')).toBe(false)
      expect(hasTranslatableContent('0')).toBe(false)
    })

    it('应该拒绝纯符号', () => {
      expect(hasTranslatableContent('$%^&')).toBe(false)
      expect(hasTranslatableContent('!!!')).toBe(false)
      expect(hasTranslatableContent('...')).toBe(false)
      expect(hasTranslatableContent('---')).toBe(false)
    })

    it('应该拒绝空白字符', () => {
      expect(hasTranslatableContent('')).toBe(false)
      expect(hasTranslatableContent('   ')).toBe(false)
      expect(hasTranslatableContent('\t')).toBe(false)
      expect(hasTranslatableContent('\n')).toBe(false)
    })

    it('应该拒绝数字和符号组合', () => {
      expect(hasTranslatableContent('123-456')).toBe(false)
      expect(hasTranslatableContent('$100')).toBe(false)
      expect(hasTranslatableContent('50%')).toBe(false)
      expect(hasTranslatableContent('(123)')).toBe(false)
    })

    it('应该识别包含数字的文本但有语言内容', () => {
      expect(hasTranslatableContent('用户123')).toBe(true)
      expect(hasTranslatableContent('User456')).toBe(true)
      expect(hasTranslatableContent('第1章')).toBe(true)
      expect(hasTranslatableContent('Chapter 2')).toBe(true)
    })
  })

  describe('detectChinese', () => {
    it('应该检测包含中文字符的文本', () => {
      expect(detectChinese('你好')).toBe(true)
      expect(detectChinese('测试123')).toBe(true)
      expect(detectChinese('Hello你好')).toBe(true)
    })

    it('应该拒绝不包含中文字符的文本', () => {
      expect(detectChinese('Hello')).toBe(false)
      expect(detectChinese('123')).toBe(false)
      expect(detectChinese('$%^&')).toBe(false)
    })
  })

  describe('detectEnglish', () => {
    it('应该检测纯英文文本', () => {
      expect(detectEnglish('Hello')).toBe(true)
      expect(detectEnglish('Test')).toBe(true)
      expect(detectEnglish('English Text')).toBe(true)
    })

    it('应该检测包含数字和符号的英文文本', () => {
      expect(detectEnglish('John123')).toBe(true)
      expect(detectEnglish('Mary-Jane')).toBe(true)
      expect(detectEnglish('User@123')).toBe(true)
    })

    it('应该拒绝包含中文的文本', () => {
      expect(detectEnglish('Hello你好')).toBe(false)
      expect(detectEnglish('张三')).toBe(false)
    })

    it('应该拒绝纯数字和符号', () => {
      expect(detectEnglish('123')).toBe(false)
      expect(detectEnglish('$%^&')).toBe(false)
      expect(detectEnglish('123-456')).toBe(false)
    })
  })
})
