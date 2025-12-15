import { describe, expect, test } from 'vitest'
import { generateUrlByModule, LinkModule } from '../../link'
import { checkRequiredParams } from '../../link/config/params'

describe('Required Parameters Tests', () => {
  test('checkRequiredParams should return true when all required params are present', () => {
    const result = checkRequiredParams(LinkModule.COMPANY_DETAIL, { companycode: '123456' })
    expect(result).toBe(true)
  })

  test('checkRequiredParams should return false when required params are missing', () => {
    // @ts-expect-error
    const result = checkRequiredParams(LinkModule.COMPANY_DETAIL, {})
    expect(result).toBe(false)
  })

  test('checkRequiredParams should return false when required params are empty', () => {
    const result = checkRequiredParams(LinkModule.COMPANY_DETAIL, { companycode: '' })
    expect(result).toBe(false)
  })

  test('checkRequiredParams should return true when module has no required params', () => {
    const result = checkRequiredParams(LinkModule.AI_CHAT, {})
    expect(result).toBe(true)
  })

  test('generateUrlByModule should return undefined when required params are missing', () => {
    const url = generateUrlByModule({
      module: LinkModule.COMPANY_DETAIL,
      // @ts-expect-error
      params: {},
    })
    expect(url).toBeUndefined()
  })

  test('generateUrlByModule should return a URL when all required params are present', () => {
    const url = generateUrlByModule({
      module: LinkModule.COMPANY_DETAIL,
      params: { companycode: '123456' },
    })
    expect(url).toBeDefined()
    expect(typeof url).toBe('string')
  })
})
