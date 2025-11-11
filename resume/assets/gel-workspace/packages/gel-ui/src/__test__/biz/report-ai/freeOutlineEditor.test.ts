import { describe, expect, it } from 'vitest'
import { htmlToMarkdown, markdownToHtml } from '../../../biz/report-ai/FreeOutlineEditor/utils'

// Mock JSDOM environment for DOMParser
import { JSDOM } from 'jsdom'
const dom = new JSDOM()
global.DOMParser = dom.window.DOMParser

describe('FreeOutlineEditor Utils', () => {
  describe('markdownToHtml', () => {
    it('should return an empty string for empty or whitespace-only markdown', () => {
      expect(markdownToHtml('')).toBe('')
      expect(markdownToHtml('   ')).toBe('')
      expect(markdownToHtml('\n\n')).toBe('')
    })

    it('should handle markdown with only a title', () => {
      const markdown = '# Report Title'
      const expectedHtml = '<h1>Report Title</h1>'
      expect(markdownToHtml(markdown)).toBe(expectedHtml)
    })

    it('should handle a simple, single-level list', () => {
      const markdown = '## Item 1\n## Item 2'
      const expectedHtml = '<ol><li>Item 1</li><li>Item 2</li></ol>'
      expect(markdownToHtml(markdown)).toBe(expectedHtml)
    })

    it('should handle a multi-level nested list', () => {
      const markdown = '## Level 1\n### Level 2\n#### Level 3\n## Another Level 1'
      const expectedHtml =
        '<ol><li>Level 1<ol><li>Level 2<ol><li>Level 3</li></ol></li></ol></li><li>Another Level 1</li></ol>'
      expect(markdownToHtml(markdown)).toBe(expectedHtml)
    })

    it('should correctly handle a title and a nested list', () => {
      const markdown = '# My Report\n## Intro\n### Background\n## Body'
      const expectedHtml = '<h1>My Report</h1><ol><li>Intro<ol><li>Background</li></ol></li><li>Body</li></ol>'
      expect(markdownToHtml(markdown)).toBe(expectedHtml)
    })

    it('should ignore lines that are not valid headings', () => {
      const markdown = '## Valid 1\nJust text\n## Valid 2'
      const expectedHtml = '<ol><li>Valid 1</li><li>Valid 2</li></ol>'
      expect(markdownToHtml(markdown)).toBe(expectedHtml)
    })

    it('should handle complex nesting and returning to previous levels', () => {
      const markdown = `
        ## L1 A
        ### L2 A
        #### L3 A
        ### L2 B
        ## L1 B
      `
      const expectedHtml =
        '<ol><li>L1 A<ol><li>L2 A<ol><li>L3 A</li></ol></li><li>L2 B</li></ol></li><li>L1 B</li></ol>'
      expect(markdownToHtml(markdown)).toBe(expectedHtml)
    })
  })

  describe('htmlToMarkdown', () => {
    it('should return an empty string for empty or whitespace-only HTML', () => {
      expect(htmlToMarkdown('')).toBe('')
      expect(htmlToMarkdown('   ')).toBe('')
      expect(htmlToMarkdown('<p><br></p>')).toBe('')
    })

    it('should handle HTML with only an H1 title', () => {
      const html = '<h1>My Awesome Title</h1>'
      const expectedMarkdown = '# My Awesome Title'
      expect(htmlToMarkdown(html)).toBe(expectedMarkdown)
    })

    it('should convert a simple ordered list', () => {
      const html = '<ol><li>First</li><li>Second</li></ol>'
      const expectedMarkdown = '## First\n## Second'
      expect(htmlToMarkdown(html)).toBe(expectedMarkdown)
    })

    it('should convert a nested ordered list', () => {
      const html = '<ol><li>L1<ol><li>L2<ol><li>L3</li></ol></li></ol></li><li>L1 Next</li></ol>'
      const expectedMarkdown = '## L1\n### L2\n#### L3\n## L1 Next'
      expect(htmlToMarkdown(html)).toBe(expectedMarkdown)
    })

    it('should handle a title and a nested list together', () => {
      const html = '<h1>Report</h1><ol><li>Section 1<ol><li>Subsection A</li></ol></li></ol>'
      const expectedMarkdown = '# Report\n## Section 1\n### Subsection A'
      expect(htmlToMarkdown(html)).toBe(expectedMarkdown)
    })

    it('should correctly extract text from LI containing other inline elements', () => {
      const html = '<ol><li>Item with <b>bold</b> and <i>italic</i> text</li></ol>'
      const expectedMarkdown = '## Item with bold and italic text'
      expect(htmlToMarkdown(html)).toBe(expectedMarkdown)
    })

    it('should handle lists with empty list items gracefully', () => {
      const html = '<ol><li>First</li><li></li><li>Third</li></ol>'
      const expectedMarkdown = '## First\n## Third'
      expect(htmlToMarkdown(html)).toBe(expectedMarkdown)
    })
  })

  describe('Symmetry (Markdown -> HTML -> Markdown)', () => {
    const testCases = [
      {
        name: 'Simple List',
        markdown: '## Item 1\n## Item 2\n## Item 3',
      },
      {
        name: 'Nested List',
        markdown: '## L1\n### L2\n#### L3\n### L2 Next',
      },
      {
        name: 'Complex Structure with Title',
        markdown: '# My Report\n## Intro\n### Background\n#### Details\n## Main Content\n## Conclusion',
      },
      {
        name: 'List with gaps',
        markdown: '## A\n### B\n## C\n### D',
      },
      {
        name: 'Empty input',
        markdown: '',
      },
      {
        name: 'Title only',
        markdown: '# Just a Title',
      },
    ]

    testCases.forEach(({ name, markdown }) => {
      it(`should maintain integrity for: ${name}`, () => {
        const generatedHtml = markdownToHtml(markdown)
        const regeneratedMarkdown = htmlToMarkdown(generatedHtml)
        expect(regeneratedMarkdown).toBe(markdown.trim())
      })
    })
  })
})
