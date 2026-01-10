import { GEL_WEB, GEL_WEB_TEST, GELService, PC_Front, WFC_Enterprise_Web } from 'gel-util/link'
import { getGeneralPrefixUrl, getPrefixUrl } from '../../handle/link/handle/prefixUrl.ts'

describe('prefixUrl', () => {
  const mockWindow = {
    location: {
      protocol: 'https:',
      host: 'test.example.com',
    },
  }

  beforeAll(() => {
    // Mock window object
    global.window = mockWindow as any
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getGeneralPrefixUrl', () => {
    const testCases = [
      {
        name: 'terminal environment',
        env: 'terminal',
        service: GELService.Company,
        expected: `https://test.example.com/${WFC_Enterprise_Web}/${PC_Front}/${GELService.Company}/`,
      },
      {
        name: 'terminalWeb environment',
        env: 'terminalWeb',
        service: GELService.Company,
        expected: `https://test.example.com/${WFC_Enterprise_Web}/${PC_Front}/${GELService.Company}/`,
      },
      {
        name: 'local environment',
        env: 'local',
        service: GELService.Company,
        expected: 'https://test.example.com/',
      },
      {
        name: 'webTest environment without login',
        env: 'webTest',
        service: GELService.Company,
        isLoginIn: false,
        expected: `https://test.example.com/${GEL_WEB_TEST}/${GELService.Company}/`,
      },
      {
        name: 'webTest environment with login',
        env: 'webTest',
        service: GELService.Company,
        isLoginIn: true,
        expected: `https://test.example.com/${GEL_WEB_TEST}/`,
      },
      {
        name: 'web environment without login',
        env: 'web',
        service: GELService.Company,
        isLoginIn: false,
        expected: `https://test.example.com/${GEL_WEB}/${GELService.Company}/`,
      },
      {
        name: 'web environment with login',
        env: 'web',
        service: GELService.Company,
        isLoginIn: true,
        expected: `https://test.example.com/${GEL_WEB}/`,
      },
      {
        name: 'default environment',
        env: 'unknown',
        service: GELService.Company,
        expected: 'https://test.example.com/',
      },
    ]
  })

  describe('getPrefixUrl', () => {
    it('should call getGeneralPrefixUrl with Company service', () => {
      const mockEnv = 'web'
      const isLoginIn = true

      const result = getPrefixUrl({ isLoginIn, envParam: mockEnv as any })
      const expectedResult = getGeneralPrefixUrl({
        service: GELService.Company,
        isLoginIn,
        envParam: mockEnv as any,
      })

      expect(result).toBe(expectedResult)
    })

    it('should work with default parameters', () => {
      const result = getPrefixUrl()
      const expectedResult = getGeneralPrefixUrl({
        service: GELService.Company,
        isLoginIn: undefined,
        envParam: undefined,
      })

      expect(result).toBe(expectedResult)
    })
  })
})
