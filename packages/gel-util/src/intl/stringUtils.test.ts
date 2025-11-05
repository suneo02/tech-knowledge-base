import { describe, expect, test } from 'vitest'
import { extractTranslatableStrings } from './stringUtils'

describe('extractTranslatableStrings', () => {
  // Group 1: Basic non-translation cases
  describe('Basic Cases: No Translation Needed', () => {
    test('should return an empty array for strings with no Chinese characters', () => {
      expect(extractTranslatableStrings('Hello world')).toEqual([])
      expect(extractTranslatableStrings('12345')).toEqual([])
    })

    test('should return an empty array for empty or whitespace strings', () => {
      expect(extractTranslatableStrings('')).toEqual([])
      expect(extractTranslatableStrings('   \t\n ')).toEqual([])
    })

    test('should return an empty array for strings with only HTML and no Chinese', () => {
      expect(extractTranslatableStrings('<p>Just English</p>')).toEqual([])
      expect(extractTranslatableStrings('<div><span></span></div>')).toEqual([])
    })
  })

  // Group 2: Simple extraction cases
  describe('Simple Text Extraction', () => {
    test('should extract a simple Chinese string', () => {
      expect(extractTranslatableStrings('你好')).toEqual(['你好'])
    })

    test('should extract the whole string if it contains Chinese and no HTML', () => {
      expect(extractTranslatableStrings('Hello 你好 world')).toEqual(['Hello 你好 world'])
    })

    test('should handle text with numbers and symbols', () => {
      expect(extractTranslatableStrings('净利润: 500万元')).toEqual(['净利润: 500万元'])
    })

    test('should extract text with Chinese punctuation', () => {
      expect(extractTranslatableStrings('"你好，世界！"')).toEqual(['"你好，世界！"'])
    })
  })

  // Group 3: HTML-related cases
  describe('HTML Handling', () => {
    test('should extract text from simple HTML tags', () => {
      const htmlString = '<p>这是一个段落。</p>'
      expect(extractTranslatableStrings(htmlString)).toEqual(['这是一个段落。'])
    })

    test('should extract text from deeply nested HTML structures', () => {
      const nestedHtml = '<div><p>这是<span>一段嵌套的</span>文字。</p></div>'
      expect(extractTranslatableStrings(nestedHtml)).toEqual(['这是', '一段嵌套的', '文字。'])
    })

    test('should handle multiple top-level text nodes and tags', () => {
      const complexHtml = '<span>第一部分</span><br/><strong>第二部分</strong>'
      expect(extractTranslatableStrings(complexHtml)).toEqual(['第一部分', '第二部分'])
    })

    test('should extract only text nodes containing Chinese from mixed content', () => {
      const mixedContent = '<span>Only English</span><div>这是中文</div><p>More English</p>'
      expect(extractTranslatableStrings(mixedContent)).toEqual(['这是中文'])
    })

    test('should ignore content inside <script> and <style> tags', () => {
      const scriptAndStyle =
        '<style>.red { color: red; /* 红色 */ }</style><p>正文内容</p><script>console.log("脚本内容");</script>'
      expect(extractTranslatableStrings(scriptAndStyle)).toEqual(['正文内容'])
    })

    test('should handle self-closing tags correctly', () => {
      expect(extractTranslatableStrings('第一行<br/>第二行')).toEqual(['第一行', '第二行'])
      expect(extractTranslatableStrings('图片<img src="test.jpg"/>在这里')).toEqual(['图片', '在这里'])
    })

    test('should handle tags with complex attributes', () => {
      expect(extractTranslatableStrings('<p class="text-red-500" data-test="greeting">你好</p>')).toEqual(['你好'])
    })
  })

  // Group 4: Edge cases and malformed strings
  describe('Edge Cases and Malformed Strings', () => {
    test('should handle non-HTML strings containing < and > characters', () => {
      expect(extractTranslatableStrings('a < b 并且 c > d')).toEqual(['a < b 并且 c > d'])
      expect(extractTranslatableStrings('if (a < 5 && b > 3) { /* 执行代码 */ }')).toEqual([
        'if (a < 5 && b > 3) { /* 执行代码 */ }',
      ])
    })

    test('should handle improperly formatted HTML gracefully', () => {
      // DOMParser is quite good at fixing broken HTML
      expect(extractTranslatableStrings('<p>未关闭的标签 和文本')).toEqual(['未关闭的标签 和文本'])
      expect(extractTranslatableStrings('<div>你好<b>世界</div>')).toEqual(['你好', '世界'])
    })

    test('should handle HTML entities', () => {
      // HTML entities are decoded by the DOM parser's textContent
      expect(extractTranslatableStrings('你好&nbsp;世界')).toEqual(['你好&nbsp;世界']) // \u00A0 is &nbsp;
      expect(extractTranslatableStrings('<p>这是一个段落</p>')).toEqual(['这是一个段落'])
    })

    test('should preserve meaningful whitespace but not extract whitespace-only nodes', () => {
      const html = `
          <div>
            <p>
              你好
            </p>  
          </div>
        `
      // The text node contains the surrounding newlines and spaces, which is correct.
      expect(extractTranslatableStrings(html)).toEqual(['\n              你好\n            '])
      // This only contains whitespace between tags, so it should be empty.
      expect(extractTranslatableStrings('<p> </p><div>\n\t</div>')).toEqual([])
    })
  })
})
