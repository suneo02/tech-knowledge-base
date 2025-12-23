import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getCurrentEnv, usedInClient } from '../../../env'
import { BaiFenSites, getBaiFenHost } from '../baiFen'

// Mock dependencies
vi.mock('../../../env', () => ({
  usedInClient: vi.fn(),
  getCurrentEnv: vi.fn(),
}))

vi.mock('../../handle', () => ({
  getUrlByLinkModule: vi.fn(),
}))

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    host: 'test.wind.com.cn',
  },
  writable: true,
})

describe('baiFen module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getBaiFenHost', () => {
    beforeEach(() => {
      vi.mocked(getCurrentEnv).mockReturnValue('web')
    })

    it('should return terminal host when isTerminal is true', () => {
      expect(getBaiFenHost({ isTerminal: true })).toBe('govwebsite')
    })

    it('should return web host when isTerminal is false', () => {
      vi.mocked(getCurrentEnv).mockReturnValue('web')
      expect(getBaiFenHost({ isTerminal: false })).toBe('wx.wind.com.cn')
    })

    it('should use usedInClient when isTerminal is not provided', () => {
      vi.mocked(usedInClient).mockReturnValue(true)
      vi.mocked(getCurrentEnv).mockReturnValue('web')
      expect(getBaiFenHost()).toBe('govwebsite')

      vi.mocked(usedInClient).mockReturnValue(false)
      vi.mocked(getCurrentEnv).mockReturnValue('web')
      expect(getBaiFenHost()).toBe('wx.wind.com.cn')
    })

    it('should return window.location.host in dev mode', () => {
      expect(getBaiFenHost({ isTerminal: false, isDev: true })).toBe('test.wind.com.cn')
    })

    it('should return window.location.host in staging mode', () => {
      expect(getBaiFenHost({ isTerminal: false, isStaging: true })).toBe('test.wind.com.cn')
    })
  })

  describe('BaiFenSites', () => {
    describe('Terminal version', () => {
      it('should return terminal URLs when isTerminal is true', () => {
        const sites = BaiFenSites({ isTerminal: true })
        const host = 'govwebsite'

        expect(sites.download).toBe(`https://${host}/govbusiness/#/myenterprise/download`)
        expect(sites.business).toBe(`https://${host}/govbusiness/#/dashboard/business0`)
        expect(sites.home).toBe(`https://${host}/govbusiness/#/web-home`)
        expect(sites.regionalKey).toBe(`https://${host}/govbusiness/#/web-market/100153000`)
        expect(sites.otherBankCustomers).toBe(`https://${host}/govbusiness/#/web-market/100161100`)
        expect(sites.branchCustomers).toBe(`https://${host}/govbusiness/#/web-market/100152000`)
        expect(sites.creditMining).toBe(`https://${host}/govbusiness/#/web-market/100162000`)
        expect(sites.creditOpportunities).toBe(`https://${host}/govbusiness/#/web-market/100111000`)
        expect(sites.depositOpportunities).toBe(`https://${host}/govbusiness/#/web-market/100113000`)
        expect(sites.strategicIndustries).toBe(`https://${host}/govbusiness/#/web-market/100124000`)
      })

      it('should generate correct financing details URL with all parameters', () => {
        const sites = BaiFenSites({ isTerminal: true })
        const params = {
          companyId: 'EGCWVAQPST',
          corpId: '1203509354',
          title: '测试企业',
        }
        const queryParams = new URLSearchParams()
        queryParams.append('companyId', 'EGCWVAQPST')
        queryParams.append('corpId', '1203509354')
        queryParams.append('title', encodeURIComponent('测试企业'))
        const expectedUrl = `https://govwebsite/govbusiness/?${queryParams.toString()}#/corpInfo`
        expect(sites.getFinancingDetails(params)).toBe(expectedUrl)
      })

      it('should generate correct financing details URL without title', () => {
        const sites = BaiFenSites({ isTerminal: true })
        const params = {
          companyId: 'EGCWVAQPST',
          corpId: '1203509354',
        }
        const queryParams = new URLSearchParams()
        queryParams.append('companyId', 'EGCWVAQPST')
        queryParams.append('corpId', '1203509354')
        const expectedUrl = `https://govwebsite/govbusiness/?${queryParams.toString()}#/corpInfo`
        expect(sites.getFinancingDetails(params)).toBe(expectedUrl)
      })
    })

    describe('Web version', () => {
      beforeEach(() => {
        vi.mocked(getCurrentEnv).mockReturnValue('web')
      })

      it('should return login URL for all links when isTerminal is false', () => {
        const sites = BaiFenSites({ isTerminal: false })
        const host = 'wx.wind.com.cn'
        const loginUrl = `https://${host}/baifenweb/`

        expect(sites.download).toBe(loginUrl)
        expect(sites.business).toBe(loginUrl)
        expect(sites.home).toBe(loginUrl)
        expect(sites.regionalKey).toBe(loginUrl)
        expect(sites.otherBankCustomers).toBe(loginUrl)
        expect(sites.branchCustomers).toBe(loginUrl)
        expect(sites.creditMining).toBe(loginUrl)
        expect(sites.creditOpportunities).toBe(loginUrl)
        expect(sites.depositOpportunities).toBe(loginUrl)
        expect(sites.strategicIndustries).toBe(loginUrl)

        expect(
          sites.getFinancingDetails({
            companyId: 'EGCWVAQPST',
            corpId: '1203509354',
          })
        ).toBe(loginUrl)
      })

      it('should use usedInClient when isTerminal is not provided', () => {
        vi.mocked(usedInClient).mockReturnValue(false)
        vi.mocked(getCurrentEnv).mockReturnValue('web')

        const sites = BaiFenSites()
        const host = 'wx.wind.com.cn'
        const loginUrl = `https://${host}/baifenweb/`

        expect(sites.download).toBe(loginUrl)
        expect(sites.home).toBe(loginUrl)
      })
    })

    describe('Report Analysis Process', () => {
      it('should generate correct report analysis process URL with id parameter', () => {
        const sites = BaiFenSites({ isTerminal: true })
        const params = { id: 'report123' }
        const expectedUrl = 'https://govwebsite/govbusiness?id=report123#/report-analysis/process-for-gel'
        expect(sites.getReportAnalysisProcessForGel(params)).toBe(expectedUrl)
      })

      it('should return login URL for report analysis process in web mode', () => {
        vi.mocked(getCurrentEnv).mockReturnValue('web')
        const sites = BaiFenSites({ isTerminal: false })
        const params = { id: 'report123' }
        const loginUrl = 'https://wx.wind.com.cn/baifenweb/'
        expect(sites.getReportAnalysisProcessForGel(params)).toBe(loginUrl)
      })
    })
  })
})
