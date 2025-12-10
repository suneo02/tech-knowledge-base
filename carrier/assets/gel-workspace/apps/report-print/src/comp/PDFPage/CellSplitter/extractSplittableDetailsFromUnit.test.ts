import { describe, expect, it } from 'vitest'

import { extractSplittableDetailsFromUnit } from './extractSplittableDetailsFromUnit'

describe('_extractSplittableDetailsFromUnit', () => {
  it('should correctly identify a simple element wrapper like <p>', () => {
    const html = '<p>Hello World</p>'
    const result = extractSplittableDetailsFromUnit(html)
    expect(result.isComplex).toBe(false)
    expect(result.isSimpleElementWrapper).toBe(true)
    expect(result.originalText).toBe('Hello World')
    expect(result.$children).toBeDefined()
    expect(result.$children!.text()).toBe('Hello World')
    expect(result.$children!.prop('outerHTML')).toBe(html)
  })

  it('should correctly identify a simple element wrapper like <span>', () => {
    const html = '<span>Test Text</span>'
    const result = extractSplittableDetailsFromUnit(html)
    expect(result.isComplex).toBe(false)
    expect(result.isSimpleElementWrapper).toBe(true)
    expect(result.originalText).toBe('Test Text')
    expect(result.$children).toBeDefined()
    expect(result.$children!.text()).toBe('Test Text')
    expect(result.$children!.prop('outerHTML')).toBe(html)
  })

  it('should correctly identify a pure text node', () => {
    const html = 'Just some text'
    const result = extractSplittableDetailsFromUnit(html)
    expect(result.isComplex).toBe(false)
    expect(result.isSimpleElementWrapper).toBe(false)
    expect(result.originalText).toBe('Just some text')
    expect(result.$children).toBeNull()
  })

  it('should identify complex HTML with multiple top-level elements', () => {
    const html = '<span>Hello</span> <span>World</span>'
    const result = extractSplittableDetailsFromUnit(html)
    expect(result.isComplex).toBe(true)
    expect(result.originalText).toBe('')
    expect(result.$children).toBeNull()
  })

  it('should identify complex HTML with mixed text and elements at top level', () => {
    const html = 'Text <b>and</b> more text'
    const result = extractSplittableDetailsFromUnit(html)
    expect(result.isComplex).toBe(true)
    expect(result.originalText).toBe('')
    expect(result.$children).toBeNull()
  })

  it('should handle empty string input', () => {
    const html = ''
    const result = extractSplittableDetailsFromUnit(html)
    expect(result.isComplex).toBe(false)
    expect(result.isSimpleElementWrapper).toBe(false)
    expect(result.originalText).toBe('')
    expect(result.$children).toBeNull()
  })

  it('should handle simple element wrapper with leading/trailing spaces in text', () => {
    const html = '<p>  Spaced Out  </p>'
    const result = extractSplittableDetailsFromUnit(html)
    expect(result.isComplex).toBe(false)
    expect(result.isSimpleElementWrapper).toBe(true)
    expect(result.originalText).toBe('  Spaced Out  ')
    expect(result.$children).toBeDefined()
    expect(result.$children!.text()).toBe('  Spaced Out  ')
  })

  it('should identify as complex if text is outside the single child element', () => {
    const html = '<p>Text</p> Stray'
    const result = extractSplittableDetailsFromUnit(html)
    expect(result.isComplex).toBe(true)
  })

  it('should treat unit as simple wrapper if it IS a single element containing all text, even with comments', () => {
    const html = '<div><span>Text</span><!-- comment --></div>'
    const result = extractSplittableDetailsFromUnit(html)
    expect(result.isComplex).toBe(false)
    expect(result.isSimpleElementWrapper).toBe(true)
    expect(result.originalText).toBe('Text')
    expect(result.$children).toBeDefined()
    expect(result.$children!.prop('outerHTML')).toBe(html)
  })
})
