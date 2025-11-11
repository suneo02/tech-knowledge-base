import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLangSource, useNavigateWithLangSource, openWindowWithParams } from '@/hooks/useLangSource'
import { MemoryRouter } from 'react-router-dom'
import { appendLangSourceToUrl } from '@/utils/langSource'

describe('useLangSource', () => {
  const originalLocation = window.location

  beforeEach(() => {
    vi.restoreAllMocks()
    // 模拟 URL
    Object.defineProperty(window, 'location', {
      value: new URL('https://example.com/path?lan=en&from=Baifen'),
      writable: true,
    })
  })

  it('should parse lan and from from URL', () => {
    const { result } = renderHook(() => useLangSource())
    expect(result.current.language).toBe('en')
    expect(result.current.source).toBe('Baifen')
    expect(result.current.isEN).toBe(true)
  })

  it('should append params to url (relative)', () => {
    const { result } = renderHook(() => useLangSource())
    const out = result.current.appendToUrl('/page')
    expect(out).toBe('/page?lan=en&from=Baifen')
  })

  it('should override when specified', () => {
    const url = '/page?lan=cn'
    const out = appendLangSourceToUrl(url, { override: true })
    expect(out).toContain('lan=en')
  })

  it('should preserve original query params when opening innerlinks', () => {
    // 模拟在 iframe 中
    Object.defineProperty(window.location, 'ancestorOrigins', {
      value: ['https://host.example.com'],
      configurable: true,
    })

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <MemoryRouter>{children}</MemoryRouter>

    const { result } = renderHook(() => useNavigateWithLangSource(), { wrapper })

    act(() => {
      result.current('/super/chat/abc123?type=CDE')
    })

    expect(openSpy).toHaveBeenCalled()
    const calledWith = openSpy.mock.calls[0][0] as string
    const u = new URL(calledWith)
    expect(u.searchParams.get('type')).toBe('CDE')
    expect(u.searchParams.get('id')).toBe('abc123')

    openSpy.mockRestore()
  })

  it('openWindowWithParams merges searchParams for absolute URL', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const url = 'https://example.org/path?a=1'
    const params = { b: '2', c: 3 }
    openWindowWithParams({ url, searchParams: params })
    expect(openSpy).toHaveBeenCalled()
    const calledUrl = openSpy.mock.calls[0][0] as string
    const u = new URL(calledUrl)
    expect(u.searchParams.get('a')).toBe('1')
    expect(u.searchParams.get('b')).toBe('2')
    expect(u.searchParams.get('c')).toBe('3')
    openSpy.mockRestore()
  })

  it('openWindowWithParams supports target and features string', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    openWindowWithParams({ url: '/local', options: { target: '_blank', features: 'noopener,noreferrer' } })
    expect(openSpy).toHaveBeenCalled()
    expect(openSpy.mock.calls[0][1]).toBe('_blank')
    expect(openSpy.mock.calls[0][2]).toBe('noopener,noreferrer')
    openSpy.mockRestore()
  })

  it('openWindowWithParams supports features object and replace fallback', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const replaceSpy = vi.spyOn(window.location, 'replace').mockImplementation(() => {})
    openWindowWithParams({
      url: '/local?p=1',
      options: { target: '_self', replace: true, features: { width: 600, height: 400, popup: true } },
    })
    expect(replaceSpy).toHaveBeenCalled()
    expect(openSpy).not.toHaveBeenCalled()
    replaceSpy.mockRestore()
    openSpy.mockRestore()
  })
})
