import { BaiFenHostMap, BaiFenSites, getBaiFenHost } from '../../handle/link/out/baiFen.ts'
import { wftCommon } from '../../utils/utils.tsx'

// Mock dependencies
jest.mock('../../../src/utils/utils.tsx', () => ({
  wftCommon: {
    usedInClient: jest.fn(),
    isBaiFenTerminal: jest.fn(),
  },
}))

jest.mock('../../../src/handle/link/handle', () => ({
  getUrlByLinkModule: jest.fn(),
}))

describe('baiFen module', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('BaiFenHost', () => {
    it('should return terminal host when isTerminal is true', () => {
      expect(getBaiFenHost(true)).toBe(BaiFenHostMap.terminal)
    })

    it('should return web host when isTerminal is false', () => {
      expect(getBaiFenHost(false)).toBe(BaiFenHostMap.web)
    })

    it('should fallback to wftCommon.usedInClient when isTerminal is not provided', () => {
      ;(wftCommon.usedInClient as jest.Mock).mockReturnValue(true)
      expect(getBaiFenHost()).toBe(BaiFenHostMap.terminal)
      ;(wftCommon.usedInClient as jest.Mock).mockReturnValue(false)
      expect(getBaiFenHost()).toBe(BaiFenHostMap.web)
    })
  })

  describe('BaiFenSites', () => {
    describe('Terminal version', () => {
      it('should return terminal URLs when isTerminal is true', () => {
        const sites = BaiFenSites({ isTerminal: true })
        const host = BaiFenHostMap.terminal

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
        const expectedUrl = `https://${BaiFenHostMap.terminal}/govbusiness/?companyId=EGCWVAQPST&corpId=1203509354&title=${encodeURIComponent('测试企业')}#/corpInfo`
        expect(sites.getFinancingDetails(params)).toBe(expectedUrl)
      })

      it('should generate correct financing details URL without title', () => {
        const sites = BaiFenSites({ isTerminal: true })
        const params = {
          companyId: 'EGCWVAQPST',
          corpId: '1203509354',
        }
        const expectedUrl = `https://${BaiFenHostMap.terminal}/govbusiness/?companyId=EGCWVAQPST&corpId=1203509354#/corpInfo`
        expect(sites.getFinancingDetails(params)).toBe(expectedUrl)
      })
    })

    describe('Web version', () => {
      it('should return login URL for all links when isTerminal is false', () => {
        const sites = BaiFenSites({ isTerminal: false })
        const host = BaiFenHostMap.web
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

        // Test financing details also returns login URL
        expect(
          sites.getFinancingDetails({
            companyId: 'EGCWVAQPST',
            corpId: '1203509354',
          })
        ).toBe(loginUrl)
      })

      it('should fallback to wftCommon.usedInClient when isTerminal is not provided', () => {
        ;(wftCommon.usedInClient as jest.Mock).mockReturnValue(false)
        const sites = BaiFenSites()
        const host = BaiFenHostMap.web
        const loginUrl = `https://${host}/baifenweb/`

        expect(sites.download).toBe(loginUrl)
        expect(sites.home).toBe(loginUrl)
      })
    })
  })
})
