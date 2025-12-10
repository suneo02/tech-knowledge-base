/**
 * @vitest-environment jsdom
 */
import { getUrlParamCorpCode, getUrlParamHiddenNodes, getUrlParamLang, getUrlParamPattern, getUrlSearch } from '@/url'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('./misc', () => ({
  getUrlSearch: vi.fn(),
}))

describe('urlParams', () => {
  afterEach(() => {
    vi.mocked(getUrlSearch).mockReset()
  })

  describe('functions depending on URL', () => {
    it('getUrlParamPattern should get pattern from URL', () => {
      const pattern = 'test_pattern'
      vi.mocked(getUrlSearch).mockReturnValue(pattern)
      expect(getUrlParamPattern()).toBe(pattern)
      expect(getUrlSearch).toHaveBeenCalledWith('pattern')
    })

    it('getUrlParamPattern should return empty string if pattern not in URL', () => {
      vi.mocked(getUrlSearch).mockReturnValue('')
      expect(getUrlParamPattern()).toBe('')
    })

    it('getUrlParamCorpCode should get companyCode from URL parameter', () => {
      const companyCode = 'C123'
      vi.mocked(getUrlSearch).mockImplementation((param) => {
        if (param === 'companyCode') return companyCode
        return ''
      })
      expect(getUrlParamCorpCode()).toBe(companyCode)
    })

    it('getUrlParamLang should get lang from URL parameter', () => {
      const lang = 'fr'
      vi.mocked(getUrlSearch).mockImplementation((param) => {
        if (param === 'lang') {
          return lang
        }
        return ''
      })
      expect(getUrlParamLang()).toBe(lang)
    })

    it('getUrlParamLang should get lan (alternative) from URL parameter', () => {
      const lang = 'de'
      vi.mocked(getUrlSearch).mockImplementation((param) => {
        if (param === 'lan') {
          return lang
        }
        return ''
      })
      expect(getUrlParamLang()).toBe(lang)
    })

    it('getUrlParamHiddenNodes should return empty array if no pattern', () => {
      vi.mocked(getUrlSearch).mockReturnValue('')
      expect(getUrlParamHiddenNodes()).toEqual([])
    })
  })
})
