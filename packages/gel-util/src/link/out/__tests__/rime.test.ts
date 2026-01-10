import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getRimeLink, getRimeOrganizationUrl, RimeLinkModule, RimeTargetType } from '../rime'

vi.mock('../../../env', () => ({
  usedInClient: vi.fn(),
  getCurrentEnv: vi.fn(),
  WindSessionHeader: 'wind.sessionid',
}))

describe('rime module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getRimeLink', () => {
    it('PEVC_EVENT terminal', () => {
      const url = getRimeLink(RimeLinkModule.PEVC_EVENT, {}, true)
      expect(url).toBe(
        'https://rime/rime/frontend/web/database/realm/pevc.event?from=%2Fdatabase%2Frealm%2Fpevc.aboard_deal'
      )
    })

    it('PEVC_EVENT web', () => {
      const url = getRimeLink(RimeLinkModule.PEVC_EVENT, {}, false)
      expect(url).toBe('https://rimedata.com/database/realm/pevc.event?from=%2Fdatabase%2Frealm%2Fpevc.event')
    })

    it('VERTICAL_ALL terminal', () => {
      const url = getRimeLink(RimeLinkModule.VERTICAL_ALL, {}, true)
      expect(url).toBe('https://rime/rime/frontend/web/vertical/all?from=%2Fvertical%2Findustry-tree')
    })

    it('VERTICAL_ALL web', () => {
      const url = getRimeLink(RimeLinkModule.VERTICAL_ALL, {}, false)
      expect(url).toBe('https://rimedata.com/vertical/all?from=%2F')
    })

    it('PEVC_FUND terminal', () => {
      const url = getRimeLink(RimeLinkModule.PEVC_FUND, {}, true)
      expect(url).toBe('https://rime/rime/frontend/web/database/realm/pevc.fund?from=%2Fdatabase%2Frealm%2Fpevc.fund')
    })

    it('PEVC_FUND web', () => {
      const url = getRimeLink(RimeLinkModule.PEVC_FUND, {}, false)
      expect(url).toBe('https://rimedata.com/database/realm/pevc.fund?from=%2Fdatabase%2Frealm%2Fpevc.event')
    })

    it('PEVC_INSTITUTION terminal', () => {
      const url = getRimeLink(RimeLinkModule.PEVC_INSTITUTION, {}, true)
      expect(url).toBe(
        'https://rime/rime/frontend/web/database/realm/pevc.institution?from=%2Fdatabase%2Frealm%2Fpevc.event'
      )
    })

    it('PEVC_INSTITUTION web', () => {
      const url = getRimeLink(RimeLinkModule.PEVC_INSTITUTION, {}, false)
      expect(url).toBe('https://rimedata.com/database/realm/pevc.institution?from=%2Fdatabase%2Frealm%2Fpevc.fund')
    })

    it('GOV_FUNDED_PLATFORM_INSTITUTION terminal', () => {
      const url = getRimeLink(RimeLinkModule.GOV_FUNDED_PLATFORM_INSTITUTION, {}, true)
      expect(url).toBe(
        'https://rime/rime/frontend/web/database/realm/pevc.gov_funded_platform_institution?from=%2Fdatabase%2Frealm%2Fpevc.institution'
      )
    })

    it('GOV_FUNDED_PLATFORM_INSTITUTION web', () => {
      const url = getRimeLink(RimeLinkModule.GOV_FUNDED_PLATFORM_INSTITUTION, {}, false)
      expect(url).toBe(
        'https://rimedata.com/database/realm/pevc.gov_funded_platform_institution?from=%2Fdatabase%2Frealm%2Fpevc.lp'
      )
    })

    it('BP_ANALYSIS terminal', () => {
      const url = getRimeLink(RimeLinkModule.BP_ANALYSIS, {}, true)
      expect(url).toBe(
        'https://rime/rime/frontend/web/workbench/ai-lab/bp-analysis?from=%2Fdatabase%2Frealm%2Fpevc.aboard_deal'
      )
    })

    it('BP_ANALYSIS web', () => {
      const url = getRimeLink(RimeLinkModule.BP_ANALYSIS, {}, false)
      expect(url).toBe('https://rimedata.com/workbench/ai-lab/bp-analysis?from=%2Finstitution')
    })

    it('PROFILE terminal with params', () => {
      const url = getRimeLink(RimeLinkModule.PROFILE, { id: '123', type: RimeTargetType.COMPANY }, true)
      expect(url).toBe('https://rime/rime/frontend/web/profile?id=123&type=ORGANIZATION')
    })

    it('PROFILE web with params', () => {
      const url = getRimeLink(RimeLinkModule.PROFILE, { id: '123', type: RimeTargetType.COMPANY }, false)
      expect(url).toBe('https://rimedata.com/profile?id=123&type=ORGANIZATION')
    })
  })

  describe('getRimeOrganizationUrl compatibility', () => {
    it('vertical home -> vertical all', () => {
      const url = getRimeOrganizationUrl({ type: RimeTargetType.VERTICAL_HOME })
      expect(url).toBe('https://rime/rime/frontend/web/vertical/all?from=%2Fvertical%2Findustry-tree')
    })

    it('profile default company type', () => {
      const url = getRimeOrganizationUrl({ id: '123' })
      expect(url).toBe('https://rimedata.com/profile?id=123&type=ORGANIZATION')
    })
  })
})
