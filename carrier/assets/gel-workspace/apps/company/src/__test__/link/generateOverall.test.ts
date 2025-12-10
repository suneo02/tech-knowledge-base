import { getUrlByLinkModule, LinksModule } from '@/handle/link'

// Mock dependencies
jest.mock('@/handle/link/handle/common.ts', () => ({
  getPrefixUrl: jest.fn(() => 'http://test.com/'),
  generateCommonLink: jest.fn((options) => `http://test.com/${options.module}`),
}))

describe('getUrlByLinkModule', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Test basic modules that use generateCommonLink
  test('should generate basic module links correctly', () => {
    const basicModules = [
      LinksModule.REPORT_HOME,
      LinksModule.QUALIFICATION_HOME,
      LinksModule.COMPANY_DYNAMIC,
      LinksModule.HOME,
    ]

    basicModules.forEach((module) => {
      const result = getUrlByLinkModule(module)
      expect(result).toBe(`http://test.com/${module}`)
    })
  })

  // Test modules that require ID parameter
  test('should generate links with ID parameter correctly', () => {
    const modules = [LinksModule.GROUP, LinksModule.CHARACTER, LinksModule.FEATURED, LinksModule.FEATURED_LIST]

    modules.forEach((module) => {
      const result = getUrlByLinkModule(module, { id: '123' })
      expect(result).toBe(`http://test.com/${module}`)
    })
  })

  // Test COMPANY module
  test('should generate company link correctly', () => {
    const result = getUrlByLinkModule(LinksModule.COMPANY, {
      id: '123',
      env: 'web',
      target: '_blank',
    })
    expect(result).toContain('http://test.com/')
  })

  // Test DATA_BROWSER module
  test('should generate data browser link correctly', () => {
    const result = getUrlByLinkModule(LinksModule.DATA_BROWSER, {
      value: 'testValue',
      title: 'Test Title',
      env: 'web',
    })
    expect(result).toContain('http://test.com/')
  })

  // Test RISK module
  test('should generate risk link correctly', () => {
    const result = getUrlByLinkModule(LinksModule.RISK, {
      id: '123',
    })
    expect(result).toBe('http://test.com/index.html#/lawdetail?reportName=risk-report&id=123')
  })

  // Test RISK module with missing parameters
  test('should return null for risk link with missing parameters', () => {
    const result = getUrlByLinkModule(LinksModule.RISK, {})
    expect(result).toBeNull()
  })

  // Test default case
  test('should return url for unknown module', () => {
    const testUrl = 'http://example.com'
    const result = getUrlByLinkModule('UNKNOWN_MODULE' as LinksModule, { url: testUrl })
    expect(result).toBe(testUrl)
  })

  // Test with empty options
  test('should handle empty options', () => {
    const result = getUrlByLinkModule(LinksModule.HOME)
    expect(result).toBe(`http://test.com/${LinksModule.HOME}`)
  })
})
